# Engineering Decisions

## 1. Why did you choose your project architecture?

I went with a **modular architecture**, where each business domain (auth, appointments, doctors, patients, etc.) has its own self-contained module. Example structure:

```
modules/
  └── auth/
      ├── auth.controller.ts   # parses request, validates input, calls service
      ├── auth.service.ts      # business logic, coordinates operations
      ├── auth.repository.ts   # database access and query logic
      ├── auth.routes.ts       # API endpoints for this module
      └── index.ts
```

Each layer has one job:

- **Controller** – handles the request/response cycle and input validation. No business logic here.
- **Service** – holds the actual business logic and rules.
- **Repository** – the only layer that talks to the database.

**Why this way:** it keeps changes isolated. If a business rule changes, I only touch the service layer. If something changes at the database level (e.g. switching a query, adding a field), I only touch the repository. Controllers stay thin and don't need to change often. This also makes the code easier to test since each layer can be tested independently, and easier for a new developer to find where to make a change.

## 2. How did you design your MongoDB schema?

Before writing any schema, I drew a **DFD (Data Flow Diagram)** to understand how data moves between entities — patients, doctors, schedules, appointments — and where the read/write pressure would be.

For the actual schema design, I used **embedding in a few places** where the data is small, tightly coupled, and doesn't need to be queried independently (e.g. break timings inside a doctor's schedule). For everything else — patients, appointments, doctors — I kept them as **separate collections** and referenced them by ID, since these grow independently and need their own indexes and queries.

The idea is: start with embedding where it makes sense for the current usage pattern, but structure it so it can be moved into its own collection later if the data grows or needs to be queried on its own. I didn't over-normalize everything upfront — I based the decision on how the data is actually going to be read and written.

## 3. How did you prevent double booking?

I used a **composite unique index** on the appointment collection, combined with a **partial filter expression** so the uniqueness rule only applies to "active" appointments:

```typescript
// Prevent double booking of active appointments
appointmentSchema.index(
    {
        doctorId: 1,
        date: 1,
        startTime: 1,
        endTime: 1,
    },
    {
        unique: true,
        partialFilterExpression: {
            status: {
                $in: [
                    AppointmentStatus.SCHEDULED,
                    AppointmentStatus.ARRIVED,
                    AppointmentStatus.IN_PROGRESS,
                    AppointmentStatus.COMPLETED,
                ],
            },
        },
    },
);
```

This means the same doctor can't have two active appointments in the same slot — MongoDB itself rejects the second insert at the database level. This is important because it works even under concurrent requests (two receptionists booking the same slot at the same time). I'm not relying on application-level checks (like "check if slot is free, then book") because that has a race condition — the unique index is the actual guarantee of data consistency.

The `partialFilterExpression` is there so that a **cancelled** appointment doesn't block the same slot from being booked again — only active statuses count toward the uniqueness rule.

## 4. Which database indexes did you create and why?

- **Composite unique index** on `doctorId + date + startTime + endTime` (with partial filter on active statuses) — to prevent double booking, explained above.
- **Indexes on frequently filtered/searched fields** such as `doctorId`, `date`, `status`, `department`, and patient search fields (`mobileNumber`, `name`, `patientId`) — since the appointment list screen supports search, filtering, and date range queries, these fields are hit on almost every read request.
- The general rule I followed: index the fields that appear in `find()`/`sort()` queries that run often, and avoid indexing fields that are rarely queried, since every extra index adds write overhead and storage cost.

## 5. What security measures did you implement?

- **Password hashing** using bcrypt — plain text passwords are never stored.
- **JWT-based authentication** with access + refresh tokens, and refresh token invalidation on logout.
- **RBAC middleware** — every API checks the user's role before allowing the action (Super Admin / Receptionist / Doctor).
- **Input validation and sanitization** on all incoming requests, to block malformed or malicious payloads.
- **Mongoose** itself helps prevent NoSQL injection since it doesn't allow raw query strings to be executed directly the way raw MongoDB driver calls might if used carelessly.
- **Rate limiting** on APIs (especially auth routes) to prevent brute-force and abuse.
- Sensitive fields (like password hashes, tokens) are never returned in API responses.

## 6. What performance optimizations did you apply?

- **Memoization** on expensive computed data on the frontend, so it doesn't get recalculated on every re-render.
- **Debouncing** on the search input, so we're not firing an API call on every keystroke — only after the user stops typing.
- **Server-side pagination, filtering, and sorting** on the backend, so we're never pulling the entire appointments collection to the client.
- **Indexes** (covered above) to keep the common queries fast as data grows.

**Not done yet, but planned:** list virtualization on the frontend (for rendering large appointment lists without mounting every row in the DOM), which would help a lot once the list size grows into the thousands.

## 7. If this application needed to support millions of appointments, what architectural changes would you make?

- **Read/write separation:** Use **read replicas** for read-heavy operations like search and appointment listing, so reads don't compete with writes (bookings) on the primary.
- **Caching:** Add a caching layer (like Redis) for things that don't change often — doctor schedules, department lists — instead of hitting MongoDB every time.
- **Horizontal scaling of the API:** Run multiple instances of the Node.js backend behind a load balancer, since the app itself is stateless
- **Queue-based processing:** For things like sending appointment reminders or audit logging, move them off the request/response cycle into a message queue (e.g. RabbitMQ/Kafka) so they don't slow down the main booking flow.
- **Rate limiting and connection pooling:** Tune database connection pools and add stricter rate limiting per client, since millions of records usually come with a much higher request volume too.

Basically, the core logic (services, double-booking protection via unique index) stays the same — what changes is how data is distributed, cached, and read, so the system stays fast as both data volume and traffic grow.
