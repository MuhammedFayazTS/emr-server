# Folder Structure Documentation

This project is built using a **Modular Architecture** in TypeScript. This structure organizes the code by domain features (modules) rather than technical layers, making the codebase highly scalable, maintainable, and self-documenting.

---

## 📂 Directory Layout

```text
server/
├── docs/
│   └── FolderStructure.md       # Folder structure and architectural documentation
├── src/
│   ├── config/                  # Server configuration (DB connection, environment variables)
│   │   ├── db.ts                # Database connection configuration using Mongoose
│   │   └── index.ts             # Global configuration parameters
│   ├── middleware/              # Express middlewares
│   │   └── error-handler.ts     # Global centralized error handler
│   ├── modules/                 # Self-contained business modules (by domain)
│   │   └── auth/                # Authentication module
│   │       ├── auth.controller.ts  # Parses requests, validates input, calls service
│   │       ├── auth.repository.ts  # Handles database access and query logic
│   │       ├── auth.routes.ts      # Defines API endpoints for auth (e.g. /register)
│   │       ├── auth.service.ts     # Holds business logic and coordinates operations
│   │       └── index.ts            # Entry point for dependency injection instantiation
│   ├── routes/                  # Centralized router configuration
│   │   └── index.ts             # Mounts all feature module routers (e.g. /api/v1/auth)
│   ├── shared/                  # Utilities, constants, and errors shared across modules
│   │   ├── constants/
│   │   │   └── http-status-codes.ts # Centralized enum list of HTTP response codes
│   │   ├── errors/
│   │   │   ├── AppError.ts      # Custom AppError base class for operational errors
│   │   │   └── CommonExceptions.ts # Specific exception subclasses (e.g. BadRequestError)
│   │   └── utils/
│   │       └── api-response.ts  # ApiResponse helper class for consistent JSON formats
│   ├── app.ts                   # Express app initializations (CORS, body parsing, routing)
│   └── server.ts                # App listener entry point
├── package.json                 # Project dependencies and script definitions
├── tsconfig.json                # TypeScript compiler configuration and path aliases
└── .env                         # Local environment configuration file (ignored by Git)
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

