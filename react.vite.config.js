import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: "react/TypographyController.jsx",
      name: "TypographyControllerReact",
      fileName: "react-wrapper",
      formats: ["es"]
    },
    outDir: "dist/react",
    rollupOptions: {
      external: ["react", "react-dom", "@lit/react"]
    }
  }
});