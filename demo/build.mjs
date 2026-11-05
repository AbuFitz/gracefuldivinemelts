// Vercel build for the TEMPORARY design preview.
// 1. downloads the store's PUBLIC catalogue + photos (read-only), 2. copies the theme + mock runtime next to the function,
// 3. puts static files (theme assets, photos) in ./public so Vercel's CDN serves them.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
const here = import.meta.dirname;
const repo = path.resolve(here, '..');
const rm = (p) => fs.rmSync(p, { recursive: true, force: true });
const cp = (a, b) => fs.cpSync(a, b, { recursive: true });
for (const d of ['_theme', '_data', '_runtime', 'public']) rm(path.join(here, d));
fs.mkdirSync(path.join(here, 'public'), { recursive: true });

// 1. public data + photos
execFileSync('node', [path.join(repo, 'tools/preview/fetch-fixtures.mjs')], { stdio: 'inherit', env: { ...process.env, GDM_FIXTURES_DIR: path.join(here, '_data') }, cwd: here });
cp(path.join(here, '_data/img'), path.join(here, 'public/img'));
rm(path.join(here, '_data/img')); // keep the function small: photos are served statically

// 2. theme + runtime
for (const d of ['layout', 'sections', 'snippets', 'templates', 'config', 'locales']) cp(path.join(repo, d), path.join(here, '_theme', d));
for (const f of ['shopify-mock.mjs', 'serve.mjs', 'demo-metafields.json', 'demo-media.json', 'payment-icons.json']) { fs.mkdirSync(path.join(here, '_runtime'), { recursive: true }); fs.copyFileSync(path.join(repo, 'tools/preview', f), path.join(here, '_runtime', f)); }

// 3. static assets
cp(path.join(repo, 'assets'), path.join(here, 'public/assets'));
fs.writeFileSync(path.join(here, 'public/robots.txt'), 'User-agent: *\nDisallow: /\n');
console.log('demo build ready');
