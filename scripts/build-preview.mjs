// index.html + css + js 모듈을 하나로 합쳐 preview.html을 만들어요.
// 사용법: npm run build:preview   (제작자 개발 환경 전용, 플레이어에게는 필요 없어요)
import { build } from 'esbuild';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => readFile(path.join(root, file), 'utf8');

const CSS_TAG = '<link rel="stylesheet" href="css/style.css">';
const SCRIPT_TAG = '<script type="module" src="js/main.js"></script>';

const html = await read('index.html');
for (const tag of [CSS_TAG, SCRIPT_TAG]) {
  if (!html.includes(tag)) throw new Error(`index.html에서 다음 태그를 찾지 못했어요: ${tag}`);
}

const css = await read('css/style.css');
const bundle = await build({
  entryPoints: [path.join(root, 'js/main.js')],
  bundle: true,
  format: 'iife',
  charset: 'utf8',
  write: false,
  legalComments: 'none'
});
const js = bundle.outputFiles[0].text.replaceAll('</script', '<\\/script');

const output = html
  .replace(CSS_TAG, () => `<style>\n${css}\n</style>`)
  .replace(SCRIPT_TAG, () => `<script>\n${js}\n</script>`);

await writeFile(path.join(root, 'preview.html'), output, 'utf8');
console.log(`preview.html 생성 완료 (${(Buffer.byteLength(output) / 1024).toFixed(1)} KB)`);
