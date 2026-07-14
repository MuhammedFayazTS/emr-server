# Folder Structure Documentation

This project is built using a **Modular Architecture** in TypeScript. This structure organizes the code by domain features (modules) rather than technical layers, making the codebase highly scalable, maintainable, and self-documenting.

---

## 📂 Directory Layout

```text
server/
├── docs/
│   └── FolderStructure.md          # Folder structure and architectural documentation
│
├── src/
│   ├── config/                     # Server configuration (DB connection, environment variables)
│   │   ├── db.ts                   # Database connection configuration using Mongoose
│   │   └── index.ts                # Global configuration parameters
│   │
│   ├── middleware/                 # Express middlewares
│   │   ├── authenticate.ts
│   │   ├── authorize.ts
│   │   ├── error-handler.ts        # Global centralized error handler
│   │   └── __tests__/              # Unit tests for middleware
│   │       ├── authenticate.test.ts
│   │       └── authorize.test.ts
│   │
│   ├── modules/                    # Self-contained business modules (by domain)
│   │   └── auth/
│   │       ├── __tests__/          # Unit tests for Auth module
│   │       │   ├── auth.controller.test.ts
│   │       │   ├── auth.repository.test.ts
│   │       │   ├── auth.routes.test.ts
│   │       │   └── auth.service.test.ts
│   │       ├── auth.controller.ts  # Parses requests, validates input, calls service
│   │       ├── auth.repository.ts  # Handles database access and query logic
│   │       ├── auth.routes.ts      # Defines API endpoints
│   │       ├── auth.service.ts     # Holds business logic
│   │       └── index.ts            # Dependency injection entry point
│   │
│   ├── routes/                     # Centralized router configuration
│   │   └── index.ts                # Mounts all feature module routers
│   │
│   ├── shared/                     # Shared utilities, constants and helpers
│   │   ├── auth/
│   │   │   ├── bcrypt.ts
│   │   │   ├── jwt.ts
│   │   │   ├── permissions.ts
│   │   │   ├── role-permissions.ts
│   │   │   ├── permission.service.ts
│   │   │   └── __tests__/
│   │   │       ├── bcrypt.test.ts
│   │   │       ├── jwt.test.ts
│   │   │       └── permission.service.test.ts
│   │   │
│   │   ├── constants/
│   │   │   └── http-status-codes.ts
│   │   │
│   │   ├── errors/
│   │   │   ├── AppError.ts
│   │   │   └── CommonExceptions.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── api-response.ts
│   │   │   └── __tests__/
│   │   │       ├── api-response.test.ts
│   │   │       └── date.test.ts
│   │   │
│   │   └── validators/
│   │       └── __tests__/
│   │           └── validators.test.ts
│   │
│   ├── app.ts                      # Express app initialization
│   └── server.ts                   # HTTP server entry point
│
├── tests/                          # Application-level tests
│   ├── integration/                # Route/API integration tests
│   │   ├── health.test.ts
│   │   ├── auth/
│   │   ├── appointment/
│   │   ├── patient/
│   │   ├── doctor/
│   │   └── department/
│   │
│   ├── e2e/                        # End-to-end workflow tests
│   │   ├── appointment-booking.test.ts
│   │   └── complete-flow.test.ts
│   │
│   ├── helpers/                    # Shared test utilities
│   │   ├── factory.ts
│   │   ├── test-app.ts
│   │   ├── test-db.ts
│   │   └── seed.ts
│   │
│   ├── fixtures/                   # Static test data
│   │   ├── users.ts
│   │   ├── doctors.ts
│   │   └── patients.ts
│   │
│   └── setup.ts                    # Global Vitest setup
│
├── package.json                    # Project dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
├── vitest.config.ts                # Vitest configuration
└── .env                            # Local environment variables
```

---

## 💡 Key Architectural Concepts

### 1. Modular Separation (modules/)
Every module encapsulates its own complete feature set:
* **Repository**: Communicates directly with the database or data models.
* **Service**: Executes the core business logic.
* **Controller**: Interacts with the HTTP layer (Express `Request`/`Response`).
* **Routes**: Maps HTTP verbs and paths to their controllers.

### 2. Dependency Injection (modules/*/index.ts)
To promote testability and clean architecture, classes do not directly instantiate their dependencies. Dependencies are injected through constructors and initialized in the module's `index.ts`:
```typescript
// Example from src/modules/auth/index.ts
const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

export { authController };
```

### 3. Path Aliases (tsconfig.json)
To avoid messy relative imports (e.g., `../../shared/utils`), path aliases are configured:
- `@/*` -> `/src/*`
- `@config/*` -> `/src/config/*`
- `@modules/*` -> `/src/modules/*`
- `@utils/*` -> `/src/shared/utils/*`
- `@constants/*` -> `/src/shared/constants/*`
- `@errors/*` -> `/src/shared/errors/*`

