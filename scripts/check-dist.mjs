/**
 * 构建产物守卫：dist/index.html 引用的脚本 / 样式必须是根绝对路径（/assets/...）。
 *
 * 背景：站点部署在域名根路径，/vocabulary/?unit=unit1、/grammar/ 等深链直接打开。
 * 若 vite base 为 './'，index.html 会输出 ./assets/index-*.js，浏览器按深链目录解析成
 * /vocabulary/assets/* → 404，页面白屏。此脚本在 `npm run build` 收尾校验真实产物，
 * 让该回归在构建阶段立刻失败（配置层不变式另由 src/deploy-base.test.ts 钉住）。
 *
 * 用法：node scripts/check-dist.mjs [distDir]（默认 dist；在项目根目录 / 任意目录执行均可）
 */
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = resolve(projectRoot, process.argv[2] ?? 'dist');
const indexPath = resolve(distDir, 'index.html');

const problems = [];

if (!existsSync(indexPath)) {
  console.error(`✗ 未找到构建产物 ${indexPath}，请先执行 vite build`);
  process.exit(1);
}

const html = readFileSync(indexPath, 'utf8');

/** 提取 <script src> / <link href> 中的资源引用（忽略内联与 data: / 外链） */
function collectAssetRefs(source) {
  const refs = [];
  for (const tag of source.match(/<(?:script|link)\b[^>]*>/gi) ?? []) {
    const attr = /\b(?:src|href)\s*=\s*"([^"]+)"/i.exec(tag)?.[1];
    if (!attr) continue;
    if (attr.startsWith('data:') || /^https?:\/\//i.test(attr) || attr.startsWith('//')) continue;
    refs.push(attr);
  }
  return refs;
}

const refs = collectAssetRefs(html);

if (refs.length === 0) {
  problems.push('dist/index.html 未引用任何脚本 / 样式，构建可能异常');
}

const jsRefs = refs.filter((ref) => ref.startsWith('/assets/') && ref.endsWith('.js'));
const cssRefs = refs.filter((ref) => ref.startsWith('/assets/') && ref.endsWith('.css'));
if (jsRefs.length === 0) problems.push('缺少 /assets/*.js 入口脚本引用');
if (cssRefs.length === 0) problems.push('缺少 /assets/*.css 样式引用');

for (const ref of refs) {
  // 根绝对路径：以单个 / 开头（排除 // 协议相对与相对路径 ./ ../）
  if (!ref.startsWith('/') || ref.startsWith('//')) {
    problems.push(
      `资源引用 "${ref}" 不是根绝对路径（深链下会相对当前页面目录解析而 404）`,
    );
    continue;
  }

  const filePath = resolve(distDir, ref.slice(1).split(/[?#]/)[0]);
  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    problems.push(`资源引用 "${ref}" 指向的文件不存在（${filePath}）`);
  }
}

if (problems.length > 0) {
  console.error('✗ 构建产物资源路径校验失败：');
  for (const problem of problems) console.error(`  - ${problem}`);
  console.error('  期望：index.html 中脚本 / 样式为 /assets/*，与 vite base: \'/\' 一致');
  process.exit(1);
}

console.log(`✓ 构建产物资源路径校验通过（根绝对路径 /assets/*）：${refs.join(', ')}`);
