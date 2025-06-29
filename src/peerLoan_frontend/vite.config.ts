
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4943',
        changeOrigin: true
      }
    }
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
    sourcemap: true
  }
});
