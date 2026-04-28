import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Static SPA build for GitHub Pages.
// base "./" даёт относительные пути — работает и в корне домена,
// и в подпапке /repo-name/ без всякой настройки.
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  server: { host: "0.0.0.0", port: 5173 },
});
