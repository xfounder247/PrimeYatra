/**
 * Static site build:  npm run build   ->   dist/
 * Steps: photos -> pages -> Tailwind CSS -> browser script -> sitemap, robots, icons.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { compile } from 'tailwindcss';
import { transform, build as esbuild } from 'esbuild';
import sharp from 'sharp';
import { site } from './config';
import { layout } from './components';
import { allPages, notFoundPage } from './pages/index';
import { artSvg, SCENE_SLUGS } from './art';
import { destinations } from './data/destinations';
import { registerPhoto } from './images';
import { abs } from './seo';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
const PUBLIC = path.join(ROOT, 'public');

const write = (rel: string, data: string | Buffer) => {
  const file = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, data);
};
const hash = (data: string | Buffer) => crypto.createHash('sha1').update(data).digest('hex').slice(0, 8);

const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 40 40"><rect width="40" height="40" rx="11" fill="#0e1f3b"/><path d="M9 21.5 30 10l-5.2 21-5.8-6.4z" fill="#fff"/><path d="m19 24.6 11-14.6-14 9.6z" fill="#2ec4bf"/><path d="M9 21.5 15.8 19.6 19 24.6 17.6 29.5z" fill="#cfe3ff"/></svg>`;

const OG_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#081428"/><stop offset=".6" stop-color="#0e1f3b"/><stop offset="1" stop-color="#134059"/></linearGradient></defs><rect width="1200" height="630" fill="url(#g)"/><circle cx="1050" cy="90" r="260" fill="#2ec4bf" opacity=".16"/><g transform="translate(80 90) scale(2.6)"><rect width="40" height="40" rx="11" fill="#fff" opacity=".08"/><path d="M9 21.5 30 10l-5.2 21-5.8-6.4z" fill="#fff"/><path d="m19 24.6 11-14.6-14 9.6z" fill="#2ec4bf"/></g><text x="80" y="300" font-family="DejaVu Serif, Georgia, serif" font-size="84" font-weight="700" fill="#fff">Prime Enterprises</text><text x="80" y="370" font-family="DejaVu Sans, Arial, sans-serif" font-size="38" fill="#74dcd5">Tours · Forex · Money Transfer · Visa</text><text x="80" y="520" font-family="DejaVu Sans, Arial, sans-serif" font-size="34" fill="#dbe5f3">primeyatra.co.in  |  WhatsApp ${site.phone.display}</text></svg>`;

// ───────────── Photos (optional) ─────────────

async function processPhotos(): Promise<number> {
  const dir = path.join(PUBLIC, 'images', 'destinations');
  if (!fs.existsSync(dir)) return 0;
  let n = 0;
  for (const d of destinations) {
    const src = ['jpg', 'jpeg', 'png', 'webp'].map((e) => path.join(dir, `${d.slug}.${e}`)).find((f) => fs.existsSync(f));
    if (!src) continue;
    const meta = await sharp(src).metadata();
    const sizes = [480, 800, 1200].filter((w) => (meta.width ?? 0) >= w * 0.9 || w === 480);
    const srcset: string[] = [];
    for (const w of sizes) {
      const buf = await sharp(src).rotate().resize({ width: w, height: Math.round((w * 3) / 4), fit: 'cover' }).webp({ quality: 74 }).toBuffer();
      const rel = `assets/photos/${d.slug}-${w}.webp`;
      write(rel, buf);
      srcset.push(`/${rel} ${w}w`);
    }
    const mid = sizes.includes(800) ? 800 : sizes[sizes.length - 1];
    registerPhoto(d.slug, { src: `/assets/photos/${d.slug}-${mid}.webp`, srcset: srcset.join(', '), width: mid, height: Math.round((mid * 3) / 4) });
    n++;
  }
  return n;
}

// ───────────── Tailwind + JS ─────────────

async function buildCss(html: string[]): Promise<string> {
  const candidates = new Set<string>();
  for (const h of html) for (const m of h.match(/[^\s"'`<>=]+/g) ?? []) candidates.add(m);
  const compiler = await compile(fs.readFileSync(path.join(ROOT, 'src/styles.css'), 'utf8'), {
    base: ROOT,
    loadStylesheet: async (id, base) => {
      const file = id === 'tailwindcss' ? require.resolve('tailwindcss/index.css') : id.startsWith('tailwindcss/') ? require.resolve(id) : path.resolve(base, id);
      return { path: file, base: path.dirname(file), content: fs.readFileSync(file, 'utf8') };
    },
  });
  const css = compiler.build([...candidates]);
  return (await transform(css, { loader: 'css', minify: true })).code;
}

async function buildJs(): Promise<string> {
  const res = await esbuild({ entryPoints: [path.join(ROOT, 'src/client/app.ts')], bundle: true, minify: true, write: false, format: 'iife', target: 'es2019' });
  return res.outputFiles[0].text;
}

// ───────────── Main ─────────────

async function main() {
  const t0 = Date.now();
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });

  const photoCount = await processPhotos();
  for (const slug of SCENE_SLUGS) write(`assets/art/${slug}.svg`, artSvg(slug));

  const pages = allPages();
  const rendered = [...pages, notFoundPage()].map((p) => ({ meta: p, html: layout(p) }));

  const css = await buildCss(rendered.map((r) => r.html));
  const js = await buildJs();
  const cssName = `/assets/site.${hash(css)}.css`;
  const jsName = `/assets/app.${hash(js)}.js`;
  write(cssName.slice(1), css);
  write(jsName.slice(1), js);

  for (const { meta, html } of rendered) {
    const out = html.replace('%%CSS%%', cssName).replace('%%JS%%', jsName);
    const rel = meta.path.endsWith('.html') ? meta.path.slice(1) : `${meta.path.slice(1)}index.html`;
    write(rel, out);
  }

  // Icons and social image
  write('favicon.svg', LOGO_SVG);
  write('assets/logo.png', await sharp(Buffer.from(LOGO_SVG)).resize(512, 512).png().toBuffer());
  write('apple-touch-icon.png', await sharp(Buffer.from(LOGO_SVG)).resize(180, 180).png().toBuffer());
  write('assets/og-default.png', await sharp(Buffer.from(OG_SVG)).png().toBuffer());

  // Sitemap and robots
  const urls = pages
    .map((p) => `  <url><loc>${abs(p.path)}</loc><lastmod>${site.buildDate}</lastmod><priority>${p.path === '/' ? '1.0' : p.path.startsWith('/destinations/') ? '0.7' : '0.8'}</priority></url>`)
    .join('\n');
  write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
  write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${abs('/sitemap.xml')}\n`);

  // Anything in public/ (except the photo sources) is copied as is
  if (fs.existsSync(PUBLIC)) {
    fs.cpSync(PUBLIC, DIST, { recursive: true, filter: (src) => !src.includes(`${path.sep}images${path.sep}destinations`) });
  }

  const kb = (s: string) => `${(Buffer.byteLength(s) / 1024).toFixed(1)} KB`;
  console.log(`Built ${pages.length} pages + 404 in ${Date.now() - t0} ms -> dist/`);
  console.log(`CSS ${kb(css)}, JS ${kb(js)}, photos from public/images/destinations: ${photoCount}/${destinations.length}`);
  if (!site.email) console.log('Note: business.json has no email, so it is hidden on the site.');
  if (!site.address) console.log('Note: business.json has no address, so the map shows a Google Business Profile button instead.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
