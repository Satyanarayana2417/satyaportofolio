import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import viteTsconfigPaths from "vite-tsconfig-paths";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { tanstackStartVite } from "@tanstack/react-start/vite";

export default defineConfig({
  plugins: [
    tanstackStartVite(),
    TanStackRouterVite({ autoCodeSplitting: true }),
    viteTsconfigPaths(),
    react(),
  ],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  server: {
    port: 8080,
  },
});
