// Downloads PUBLIC catalogue data and product photography from the live store into ./fixtures (gitignored).
// Purpose: realistic local previews only. Nothing is copied into the theme. Re-run any time; read-only requests.
import fs from 'node:fs/promises';
import path from 'node:path';
const base = process.env.STORE_URL || 'https://gracefuldivinemelts.com';
const out = path.resolve('fixtures');
await fs.mkdir(path.join(out, 'img'), { recursive: true });
const get = async (u) => { const r = await fetch(u); if (!r.ok) throw new Error(u + ' ' + r.status); return r; };
const products = (await (await get(`${base}/products.json?limit=250`)).json()).products;
const collections = (await (await get(`${base}/collections.json`)).json()).collections;
await fs.writeFile(path.join(out, 'products.json'), JSON.stringify(products, null, 1));
await fs.writeFile(path.join(out, 'collections.json'), JSON.stringify(collections, null, 1));
const urls = new Set(products.flatMap((p) => p.images.map((i) => i.src)));
const logo = `${base}/cdn/shop/files/Black_and_Beige_Minimalist_Elegant_Cosmetics_Logo-4.png`;
urls.add(logo);
for (const u of urls) {
  const name = u.split('?')[0].split('/').pop();
  const dest = path.join(out, 'img', name);
  try { await fs.access(dest); continue; } catch {}
  const r = await get(`${u.split('?')[0]}?width=1100`);
  await fs.writeFile(dest, Buffer.from(await r.arrayBuffer()));
  console.log('saved', name);
}
console.log(`${products.length} products, ${collections.length} collections`);
