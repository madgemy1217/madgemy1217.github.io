import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Static SPA build for GitHub Pages.
// Set base via VITE_BASE env var when building for a project page (e.g. "/repo-name/").
export default defineConfig({
  base: process.env.VITE_BASE ?? "/",
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  server: { host: "0.0.0.0", port: 5173 },
});
