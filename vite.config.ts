import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// (Removed path/url usage; no aliases needed)

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    strictPort: false, // Allow Vite to use alternative ports if 8080 is busy
  },
  plugins: [react()],
  // (No custom resolve aliases configured)
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.[jt]sx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },
}));
