// One-time export of the listings that used to be read from Supabase at build.
// Usage: SUPABASE_URL=... SUPABASE_KEY=... node scripts/export_listings.mjs
// Writes data/listings.json (same row order the old build saw) and
// data/state-order.json (per state: listing ids in Postgres "ORDER BY city, name" order,
// so state pages keep exactly the same order without depending on JS string sorting).
import { writeFileSync } from "node:fs";

const URL_ = process.env.SUPABASE_URL, KEY = process.env.SUPABASE_KEY;
const H = { apikey: KEY, Authorization: `Bearer ${KEY}` };
async function get(q) {
  const r = await fetch(`${URL_}/rest/v1/listings?${q}`, { headers: H });
  if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
  return r.json();
}
const all = [];
for (let from = 0; ; from += 1000) {
  const r = await fetch(`${URL_}/rest/v1/listings?select=*`, { headers: { ...H, Range: `${from}-${from + 999}` } });
  const page = await r.json();
  all.push(...page);
  if (page.length < 1000) break;
}
const order = {};
for (const slug of [...new Set(all.map((l) => l.state_slug))]) {
  const rows = await get(`select=id&state_slug=eq.${encodeURIComponent(slug)}&order=city.asc,name.asc`);
  order[slug] = rows.map((r) => r.id);
}
// Photos now live in Cloudflare R2 under the same file names.
const OLD = `${URL_}/storage/v1/object/public/listing-images/`;
for (const l of all) if (l.featured_image_url?.startsWith(OLD))
  l.featured_image_url = "https://media.comicbookstores.co/" + l.featured_image_url.slice(OLD.length);
writeFileSync("data/listings.json", JSON.stringify(all, null, 0) + "\n");
writeFileSync("data/state-order.json", JSON.stringify(order) + "\n");
console.log("listings:", all.length, "states:", Object.keys(order).length,
  "ordered ids:", Object.values(order).reduce((n, a) => n + a.length, 0));
