import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@", replacement: "/src" },
      { find: "@/app", replacement: "/src/app" },
      { find: "@/components", replacement: "/src/components" },
      { find: "@/assets", replacement: "/src/assets" },
      { find: "@/hooks", replacement: "/src/hooks" },
      { find: "@/lib", replacement: "/src/lib" },
      { find: "@/services", replacement: "/src/services" },
      { find: "@/utils", replacement: "/src/utils" },
      { find: "@/pages", replacement: "/src/pages" }
    ],
  },
  server: {
    allowedHosts: true,
  },
});