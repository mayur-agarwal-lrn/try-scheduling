import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "../QM.Scheduling.Api/wwwroot", // Output to .NET wwwroot
    emptyOutDir: true, // Clear wwwroot before each build
    manifest: true, // Generate manifest.json for bootstrapper.js
    rollupOptions: {
      input: {
        main: "src/main.tsx", // React entry point
      },
    },
  },
});