import { fileURLToPath, URL } from "url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import '@/assets/scss/main.scss';`,
      },
    },
  },
  server: {
    proxy: {
      '/api/': 'https://dev.sez.us',
      '/socket.io/': 'https://dev.sez.us'
    },
  },
});
