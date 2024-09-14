import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

import path from "node:path"

export default defineConfig({
  plugins: [
    solidPlugin()
  ],
  build: {
    target: 'esnext',
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src")
    }
  },
  base: "./",
});
