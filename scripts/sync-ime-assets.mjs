import {cp, mkdir, readdir, rm} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'dist');
const target = path.join(root, 'android', 'app', 'src', 'main', 'assets', 'www');
const keep = new Set(['README.md', '.gitkeep']);

try {
  await readdir(source);
} catch {
  console.error('[sync-ime-assets] dist/ not found. Run "vite build --mode ime" first.');
  process.exit(1);
}

await mkdir(target, {recursive: true});

for (const entry of await readdir(target)) {
  if (keep.has(entry)) continue;
  await rm(path.join(target, entry), {recursive: true, force: true});
}

await cp(source, target, {recursive: true});
console.log(`[sync-ime-assets] ${path.relative(root, source)} -> ${path.relative(root, target)}`);
