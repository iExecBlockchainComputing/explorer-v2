# iExec Explorer

<img src="src/assets/iexec-logo.svg" alt="iExec logo" width="60" />

## Description

**iExec Explorer** is a modern web app to explore the iExec protocol across multiple supported blockchains (Arbitrum, Arbitrum Sepolia, etc.). It lets you search, browse, and analyze deals, tasks, apps, datasets, workerpools, transactions, and accounts, with an integrated wallet manager.

## Main Features

- 🔎 **Universal search**: by address, deal/task/tx hash, ENS, etc.
- 📊 **Entity explorer**: Deals, Tasks, Apps, Datasets, Workerpools, Transactions, Accounts
- 🧩 **Detailed views**: all key info for each entity
- 🦾 **Multi-chain support**
- 👛 **Wallet Manager**: deposit, withdraw, balance
- ⚡ **Live data**: auto-refresh tables
- 🛡️ **Secure wallet connection** (Wagmi, WalletConnect, etc.)
- 🎨 **Modern UI**: responsive, dark mode

## Quick Start

### Prerequisites
- Node.js >= 22
- npm >= 10

### Install
```bash
git clone <repo-url>
cd explorer-v2
npm install
```

### Generate GraphQL Types (required)
```bash
npm run codegen
```
This command generates the necessary GraphQL types for the project.

### Configure
Create a `.env` file at the root:
```env
VITE_REOWN_PROJECT_ID=your_project_id
VITE_ROLLBAR_ACCESS_TOKEN=your_rollbar_token # (optional)
```

### Run
```bash
npm run dev
```
App runs at [http://localhost:5173](http://localhost:5173) by default.

### Build
```bash
npm run build
npm run preview
```

## Useful Scripts
- `npm run codegen` — GraphQL types
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run preview` — preview build
- `npm run lint` — lint code
- `npm run check-type` — TypeScript check
- `npm run format` — Prettier format

## Tech Stack
- **React 19** + TypeScript
- **Vite**
- **TailwindCSS**
- **TanStack Router & React Query**
- **GraphQL** (TheGraph)
- **Wagmi & WalletConnect**
- **Zustand**
- **Rollbar**

## Links
- [iExec Website](https://www.iex.ec/)
- [iExec Docs](https://docs.iex.ec/)

## Contributing
Contributions are welcome! Please open issues or pull requests.

## License
MIT
