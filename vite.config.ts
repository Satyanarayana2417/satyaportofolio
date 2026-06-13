import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [viteTsconfigPaths(), react()],
  server: {
    port: 8080,
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
