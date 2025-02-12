import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync } from "fs"; // Import fs for reading package.json

// Read the version from package.json
const version = JSON.parse(readFileSync("./package.json", "utf-8")).version;

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "../QM.Scheduling.Api/wwwroot",
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      input: {
        main: "src/main.tsx",
      },
    },
  },
  define: {
    "import.meta.env.VITE_APP_VERSION": JSON.stringify(version), // Inject the version here
  },
});
