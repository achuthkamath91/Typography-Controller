import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist/web",
    lib: {
      entry: "src/typography-controller.js",
      name: "TypographyController",
      fileName: "typography-controller"
    }
  }
});