# EMR Server

A robust, type-safe Electronic Medical Record (EMR) server backend built with **Node.js**, **Express**, **TypeScript**, and **MongoDB**. 

The server is designed using a **modular (screaming) architecture**, where each feature module (such as Authentication) is self-contained with its own routes, controller, service, and repository.

---

## 🚀 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database (ORM)**: Mongoose / MongoDB
- **Development Tools**: tsx (watch mode), tsc (compiler)

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18+)
- pnpm (or npm / yarn)

### Installation

Install the project dependencies:

```bash
pnpm install
```

### Environment Setup

Create a `.env` file in the root directory and configure the environment variables:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/emr
CORS_ORIGIN=http://localhost:3000
```

### Running the Server

#### Development (Hot-reload)

```bash
pnpm dev
```

#### Build & Start (Production)

```bash
pnpm build
pnpm start
```

---

## 📂 Project Architecture

The codebase follows a modular structure to enforce separation of concerns and maintainability:

- **`src/config/`**: Handles database connections and global configuration variables.
- **`src/modules/`**: Contains self-contained feature modules (e.g. `auth/`). Each module contains its routes, controller, service, and repository.
- **`src/routes/`**: Registers all module-specific routes to form the core API routing.
- **`src/shared/`**: Contains shared components used across modules including:
  - `constants/`: Status codes and other global constant values.
  - `errors/`: Custom application error models (e.g. `AppError`).
  - `utils/`: Common utilities (e.g. the standard `ApiResponse` wrapper).

For a detailed breakdown of the file structure, path aliases, and design choices, please refer to the [Folder Structure Documentation](file:///c:/WORK/machine%20tasks/emr/server/docs/FolderStructure.md).


## API Documentaion
[Online Link](https://documenter.getpostman.com/view/31012866/2sBY4LR2eb)