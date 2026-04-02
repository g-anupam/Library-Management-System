import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
      // If your Google Login uses a specific path, add it here too
      "/login": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
