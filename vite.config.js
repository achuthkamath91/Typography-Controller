import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/typography-controller.js",
      name: "TypographyController",
      fileName: "typography-controller"
    },
     outDir: "dist/web",
  }
});