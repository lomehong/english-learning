/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  // 根绝对 base：站点部署在域名根路径，且 /vocabulary/?unit=unit1、/grammar/ 等深链可直达。
  // 若用相对 base（'./'），深链页面的 ./assets/* 会被解析成 /vocabulary/assets/* → 404 白屏。
  base: '/',
  // SPA fallback：/vocabulary /grammar /reading /listening /writing /mistakes /report
  // 等深链直接访问时由 dev/preview 服务器回退到 index.html（默认行为，显式声明以自证）
  appType: 'spa',
  // 预览服务器固定 4174 端口并对 IPv4 回环开放：vite 默认只监听 localhost，
  // 在 Windows 上 localhost 可能仅解析到 ::1，用 127.0.0.1:4174 验收 / 截图会被拒连。
  // host: true 同时监听 IPv4/IPv6 回环；strictPort 端口被占时直接失败而不是悄悄换端口。
  preview: {
    host: true,
    port: 4174,
    strictPort: true,
  },
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
