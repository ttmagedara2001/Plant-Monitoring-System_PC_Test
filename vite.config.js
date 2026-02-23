import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // base MUST be '/' for Vercel (root-domain deployment).
  // Do NOT change this to a sub-path unless you know what you are doing.
  base: "/",
  server: {
    port: 3000,
    open: true,
    // NOTE: The proxy below is only active during `npm run dev` and is
    // never included in the production build.  In demo/Vercel mode all
    // data comes from mockData.js — no real network requests are made.
    proxy: {
      "/api": {
        target: process.env.VITE_API_URL ?? "https://api.protonestconnect.co",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, "/api/v1"),
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          charts: ["recharts"],
          websocket: ["@stomp/stompjs"],
        },
      },
    },
  },
});
