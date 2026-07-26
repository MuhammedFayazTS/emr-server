# EMR Server

A robust, type-safe Electronic Medical Record (EMR) server backend built with **Node.js**, **Express**, **TypeScript**, and **MongoDB**.

The server is designed using a **modular (screaming) architecture**, where each feature module (such as Authentication) is self-contained with its own routes, controller, service, and repository.

## Engineering Descision [Link](docs/EngineeringDescision.md)

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

## ER Diagram

[Online Link](https://mermaid.live/edit#pako:eNrNWP1u4jgQfxUr0kqtru1tKYUW6f7IkrSgtgkCetWekJCJB_A12FnbuVsWkO4h7gnvSc4JXwk4225vTwtqpQTPjMfz8fuNmVkBJ2DVLBAOxSOBJz3RY8k_0p9379A_f__1o_4yXtS5APQzsmM1RkexBCFRwMMQAkU5Qz8hQmUg6IQyrLiQx4fj_9qTx47bRrP1W_LxB79r95sE9SlBrbvsklSCshFieAKGr2GCaYgeTRoRlvJPLohpacxZzhqweIIEDwH1LBlHIPqY6ACiOSI80FHUDwICiJIIU6l6VlZ5wLUiZohKW6fgj5xhghUoOgEUYqnu-YgyWxnXCYSggORX15ZXi0bFQADeU9ysxhHJry6yiWi7N2230-h3_TvXy2dkFSnFn4E1SdFKA8uxcV_4HFEBssAro88ru0lB2yNgZo8dv971i4qHQISFmmhddGOqCBlBQHFIv-Akj0YTMhgDiUPQj0YTn2KtP6RBzsJOTOtuq9v0vWanawypLks6YkAckM9GC53Hltvu285D05wTxlVSp4zrKCuB0ZBCSOS2Jhd7vTafn57y2U66a9oGTAawVt3XmK_DnYjmUAUdJc3yy7I5jrdbZ3VzgSiykO2qAjvZcBSZyfTscf40B4PazqY4Dw-QHbdlt7sPrtd9Cyyb4ZdAkqZot9NeBZY_BAxXtb7gp6fzeTYkSdENIORsJPuKH2p5LXmqs8IvdJS2NgGCNAc-pwnBU6mnAwkafzg7xLlgmYF-p95wncd799W1uCWANAgpduucxYx-iuH1XE01b8iQKycWewTxXSrsyW_fNb3bvmN_zJ8tHT90fvzhE8Czdv3B987OOo9ekfNPy5ya6cPtdDTqmqnDPEVJpaGpmxygZzUatckkv-961mLELLP4WhITFJ_PcmffZZ7d2Kzoan2QIqLKNOyGqrb7JlpbNt9utCu36veUcVJ6WdXQgfZ5S5dmMuBs-xsToietpLVhAkJPTsFU3weYwoE6wB5v2d3mG3gmWh5bixjJZkiFVJ65uJPJe3cpbTgdKgIi6TasAXOObvRlIn3w1RhEvgW21KQf_OEHKtS46GJhdnF9U0nKUk8CEow9Ngg5J7eCx9E3k-Z_QSbbcfRk2DFiRkgZnBd8XzJ8H1A1NWOMMqUn4DFTwqQRUZbcx40Ouw9u-9b16h_7dd_r2vXut8CdgDAFeDmm0Uu3w4WpeFeT6TpqJjzbEd33twjVDgZp7CjimhIPc2K1Wy2_6b1pZMXbc3mxToDY6deNhS3m3Lw4brxwH92TyeHJ92fkDcYlXRdLLbDmO0fjm91uN39Nn5pev9X2b9MqnqO6_9C6d7vpSt326u79Ut7z-52G_2R0IYpFxCUUXFOlGakwCyAMd7FqE7fN-oep-Ra-FGgDlv_DlJbr3Fmu0pKeHWNpuqfuCy6rIzN4bG8UBRrDrPjXTG8C1B9MlxrWiTUSlFg1JWI4sfQgoOlGv1qzxFrP0oymodBK_cLiWSuxhdaJMPuN88laTfPOaGzVhjiU-m0ZptUvoRuRlDTrCWhbtVI1NWHVZtZnq3ZRrpxdlS8qlevLSuXqfbV0Yk2t2uX5WeWydFGuVsvX16VKpVRZnFhf0k3fn1XL56Xz83LlunxRKlevSot_ARKOT7Y)
