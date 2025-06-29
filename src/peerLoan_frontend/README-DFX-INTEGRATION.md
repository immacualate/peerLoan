
# peerLoan - DFX Integration Guide

This guide explains how to integrate the peerLoan frontend with a Motoko backend using the Internet Computer's DFX framework.

## Prerequisites

1. Install the DFX SDK: https://internetcomputer.org/docs/current/developer-docs/setup/install
2. Basic knowledge of Internet Computer, Motoko, and React

## Integration Steps

### 1. Create a new DFX project

```bash
dfx new peerloan --frontend=react
```

### 2. Replace the frontend code

Copy all the files from this repository into the `frontend` directory of your DFX project, replacing the default frontend.

### 3. Configure canister IDs

Create a `.env` file in the root of the frontend directory with the following variables:

```
VITE_LOAN_CANISTER_ID=your_loan_canister_id
VITE_USER_CANISTER_ID=your_user_canister_id
VITE_IDENTITY_CANISTER_ID=rdmx6-jaaaa-aaaaa-aaadq-cai
```

Note: During local development, the identity canister ID is typically `rdmx6-jaaaa-aaaaa-aaadq-cai`.

### 4. Create Motoko backend canisters

You'll need to implement at least two canisters:

1. `loan_canister` - Handles all loan-related operations
2. `user_canister` - Manages user accounts and authorization

Use the interface definitions in `src/services/api.ts` as a reference for the methods your canisters should implement.

### 5. Generate canister declarations

After implementing your Motoko canisters, generate the TypeScript declarations:

```bash
dfx generate
```

This will create TypeScript bindings for your canisters in the `.dfx/local/canisters/` directory.

### 6. Update imports

Replace the mock implementations in `src/services/api.ts` with actual canister calls using the generated declarations.

### 7. Build and deploy

```bash
# Start the local replica
dfx start --clean --background

# Deploy the canisters
dfx deploy

# Open the frontend in your browser
npm start
```

## Development Tips

1. During development, you can use the mock implementations in `src/services/api.ts` while building your Motoko backend.
2. Test authentication using a local Internet Identity canister.
3. Gradually replace mock functions with actual canister calls as you implement the backend.

## Known Limitations

1. Local development requires running a local Internet Identity canister for authentication.
2. Some browser security features may affect the authentication flow - use Chrome or Firefox for best results.

## Troubleshooting

If you encounter issues with authentication:
1. Make sure the Internet Identity canister is running locally
2. Check your browser console for errors
3. Verify that the canister IDs in your `.env` file are correct

For API call issues:
1. Check your agent configuration in `src/services/api.ts`
2. Verify that your Motoko canister methods match the expected interface
3. Look for errors in the dfx deployment logs
