
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";


// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: mode === 'development' ? {
      // Proxy API requests to local replica when in development
      '/api': {
        target: 'http://localhost:4943',
        changeOrigin: true,
      },
    } : undefined,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    // Define environment variables for the client
    'process.env.VITE_LOAN_CANISTER_ID': JSON.stringify(process.env.VITE_LOAN_CANISTER_ID),
    'process.env.VITE_USER_CANISTER_ID': JSON.stringify(process.env.VITE_USER_CANISTER_ID),
    'process.env.VITE_IDENTITY_CANISTER_ID': JSON.stringify(process.env.VITE_IDENTITY_CANISTER_ID)
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
  }
}));
