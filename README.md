# peerLoan

A decentralized peer-to-peer lending platform built on the Internet Computer Protocol (ICP).

## Overview

**peerLoan** enables users to request and offer loans directly, without intermediaries. The platform leverages smart contracts (canisters) written in Motoko to ensure transparency, security, and automation of lending processes. The frontend is a modern React application, providing an intuitive interface for borrowers and lenders.

## Features

- **Decentralized Lending:** Users can create loan requests or fund existing ones.
- **Smart Contract Automation:** Loan agreements, repayments, and interest calculations are handled by Motoko canisters.
- **User Authentication:** Secure login and identity management via Internet Identity.
- **Real-time Updates:** React Query and Context provide responsive state management.
- **Accessible UI:** Built with Radix UI and styled using Tailwind CSS.

## Quick Start

### 1. Install Dependencies

```bash
cd src/peerLoan_frontend
npm install
```

### 2. Start Local Replica

```bash
dfx start --clean --background
```

### 3. Deploy Canisters

```bash
dfx deploy
```

### 4. Start Development Server

```bash
npm start
```

Visit [http://localhost:3000](http://localhost:3000) to use the app.

## Environment Setup

Create a `.env` file in `src/peerLoan_frontend`:

```
VITE_LOAN_CANISTER_ID=your_loan_canister_id
VITE_USER_CANISTER_ID=your_user_canister_id
VITE_IDENTITY_CANISTER_ID=your_identity_canister_id
```

Replace the values with your deployed canister IDs.

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, Radix UI
- **Backend:** Motoko (Internet Computer)
- **State Management:** React Context, React Query
- **Build Tools:** Vite, DFX

## Prerequisites

- Node.js (v18 or later)
- DFX SDK (latest version)
- Internet Computer Canister SDK

## Project Structure

```
peerLoan/
├── src/
│   ├── peerLoan_backend/    # Motoko canister code (loan logic, user management)
│   └── peerLoan_frontend/   # React app
│       ├── public/
│       └── src/
│           ├── components/     # UI components (LoanList, LoanForm, etc.)
│           ├── contexts/       # React Contexts (UserContext, LoanContext)
│           ├── hooks/          # Custom hooks (useLoans, useUser)
│           ├── pages/          # Page components (Dashboard, LoanDetails)
│           ├── services/       # API services (canister interactions)
│           └── utils/          # Utility functions
├── dfx.json                   # DFX configuration
└── package.json               # Project dependencies
```

## Core Concepts

### Loan Lifecycle

1. **Request:** Borrower submits a loan request (amount, duration, interest).
2. **Funding:** Lenders can fund open requests.
3. **Agreement:** Once funded, a smart contract locks the terms.
4. **Repayment:** Borrower repays according to schedule; contract enforces repayments.
5. **Completion:** Upon full repayment, funds are released to the lender.

### User Authentication

- Uses Internet Identity for secure, decentralized authentication.
- User data and loan history are stored in canisters.

### Smart Contracts

- Motoko canisters manage all loan logic, including validation, state transitions, and event logging.
- Candid interfaces are generated for frontend-backend communication.

## Development

- **Frontend:** Built with React, TypeScript, and Tailwind CSS for rapid UI development.
- **Backend:** Motoko canisters encapsulate business logic and data storage.
- **State Management:** React Context and React Query ensure efficient data flow and caching.
- **Testing:** Use DFX for local canister testing; Jest for frontend unit tests.

## Building for Production

```bash
npm run build
```

This will:
1. Generate Candid interfaces for canisters.
2. Type check TypeScript code.
3. Build the frontend for production deployment.

## Deployment

- Deploy canisters to the Internet Computer mainnet using `dfx deploy --network ic`.
- Host the frontend on any static site provider or via the asset canister.

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add some amazing feature'`).
4. Push to your branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contact

For support, questions, or business inquiries, please contact:
- **Email**: immaculatesavingsloan@gmail.com
- **GitHub**: [@immacualate](https://github.com/immacualate)

## Resources

- [Internet Computer Developer Docs](https://internetcomputer.org/docs/current/developer-docs/setup/deploy-locally)
- [Motoko Language Guide](https://internetcomputer.org/docs/current/motoko/main/motoko)
- [DFX SDK](https://internetcomputer.org/docs/current/developer-docs/setup/install)

---

**peerLoan** is your gateway to decentralized lending on the Internet Computer. Explore, contribute, and help shape the future of peer-to-peer finance!

**Developed by**: immacualate <immaculatesavingsloan@gmail.com>
