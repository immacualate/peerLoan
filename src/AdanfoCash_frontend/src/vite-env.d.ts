
/// <reference types="vite/client" />

// Define global environment variable types
interface ImportMetaEnv {
  readonly VITE_ICP_ENABLED: string;
  readonly VITE_LOAN_CANISTER_ID: string;
  readonly VITE_USER_CANISTER_ID: string;
  readonly VITE_IDENTITY_CANISTER_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
