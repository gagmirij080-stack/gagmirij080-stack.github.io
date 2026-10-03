import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        coffee: resolve(__dirname, "coffee.html"),
        saas: resolve(__dirname, "saas.html"),
        studio: resolve(__dirname, "studio.html"),
      },
    },
  },
});
