// @vitest-environment node
// 本用例读取 vite 配置（会加载 esbuild），需 node 环境：jsdom 的 TextEncoder 跨 realm 会让 esbuild 自检失败。
import { describe, it, expect } from 'vitest';
import viteConfig from '../vite.config';

/**
 * 站点部署在域名根路径，用户会直接打开 /vocabulary/?unit=unit1、/grammar/ 等深链。
 * 构建产物中的脚本 / 样式必须解析到根 /assets/*：base 一旦退回 './'，
 * 浏览器会把 ./assets/index-*.js 相对深链目录解析成 /vocabulary/assets/* → 404 白屏。
 *
 * 本用例在配置层钉住该契约（npm test 即可发现回归）；
 * 真实产物层由 `npm run build` 收尾的 scripts/check-dist.mjs 校验。
 */
const DEEP_LINK_DIR = 'https://example.com/vocabulary/'; // /vocabulary/?unit=unit1 所在目录

describe('根路径部署的资源基路径', () => {
  it('vite base 为根绝对路径 /', () => {
    expect(viteConfig.base).toBe('/');
  });

  it('深链 /vocabulary/ 下资源仍解析到 /assets/*，而不是 /vocabulary/assets/*', () => {
    const base = viteConfig.base ?? '/';
    const resolved = new URL('assets/index-abc123.js', new URL(base, DEEP_LINK_DIR)).pathname;
    expect(resolved).toBe('/assets/index-abc123.js');
  });
});
