/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  // 相对 base，构建产物可部署在任意子路径
  base: './',
  // SPA fallback：/vocabulary /grammar /reading /listening /writing /mistakes /report
  // 等深链直接访问时由 dev/preview 服务器回退到 index.html（默认行为，显式声明以自证）
  appType: 'spa',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
