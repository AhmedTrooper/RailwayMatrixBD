import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const host = process.env.TAURI_DEV_HOST;

export default defineConfig(async () => ({
  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },

  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
    proxy: {
      "/railway-api": {
        target: "https://railspaapi.shohoz.com",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/railway-api/, ""),
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq, req) => {
            proxyReq.setHeader("origin", "https://eticket.railway.gov.bd");
            proxyReq.setHeader("referer", "https://eticket.railway.gov.bd/");
            const authorization = req.headers.authorization;
            if (authorization) {
              proxyReq.setHeader("authorization", authorization);
            }
            const deviceId = req.headers["x-device-id"];
            if (deviceId) {
              proxyReq.setHeader("x-device-id", String(deviceId));
            }
            const deviceKey = req.headers["x-device-key"];
            if (deviceKey) {
              proxyReq.setHeader("x-device-key", String(deviceKey));
            }
          });
        },
      },
      "/github-raw": {
        target: "https://raw.githubusercontent.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/github-raw/, ""),
      },
    },
  },
}));
