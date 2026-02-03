// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  base: "./",

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },

  plugins: [
    react({
      babel: {
        plugins: []
      }
    }),
  ],

  build: {
    target: "es2022",
    minify: "esbuild",
    chunkSizeWarningLimit: 10000,

    rollupOptions: {
      maxParallelFileOps: 24,
      output: {
        entryFileNames: "[name].[hash].js",
        chunkFileNames: "[name].[hash].js",
        assetFileNames: "[name].[hash][extname]",
      },
    },
  },

  esbuild: {
    target: "esnext",
    minifyIdentifiers: false,
    minifySyntax: true,
    minifyWhitespace: true,
    treeShaking: true,
  },

  optimizeDeps: {
    force: false,
  },
});
