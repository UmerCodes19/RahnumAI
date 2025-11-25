import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@", replacement: "/src" },
      { find: "@/components", replacement: "/src/components" },
      { find: "@/layouts", replacement: "/src/layouts" },
      { find: "@/pages", replacement: "/src/pages" }
    ],
  },
  server: {
    allowedHosts: true,
  },
});