/**
 * End-to-end checks in a real browser (Chromium via Playwright).
 * Run after a build:  npm run build && npm run e2e
 */
import fs from 'node:fs';
import path from 'node:path';
import { chromium, type Page, type Browser } from 'playwright';
import { startServer } from './server';
import { addDaysISO, todayISO } from '../src/lib/validate';

const PORT = 4179;
const BASE = `http://localhost:${PORT}`;
const DIST = path.resolve(import.meta.dirname, '..', 'dist');
const WA = 'https://wa.me/919899290016';

let passed = 0;
const failures: string[] = [];
function check(ok: boolean, msg: string): void {
  if (ok) passed++;
  else {
    failures.push(msg);
    console.log(`  FAIL  ${msg}`);
  }
}

function sitemapPaths(): string[] {
  const xml = fs.readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8');
  return [...xml.matchAll(/<loc>https:\/\/primeyatra\.co\.in([^<]*)<\/loc>/g)].map((m) => m[1]);
}

async function newPage(browser: Browser, mobile: boolean): Promise<Page> {
  const ctx = await browser.newContext(
    mobile ? { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } : { viewport: { width: 1280, height: 900 } },
  );
  const page = await ctx.newPage();
  // Fonts come from Google; stub them so tests do not depend on the network.
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
  // tsx injects a __name helper into evaluated functions; define it in the page.
  await page.addInitScript('window.__name = (f) => f;');
  await page.addInitScript(() => {
    (window as unknown as { __opened: string[] }).__opened = [];
    window.open = ((u?: string | URL) => {
      (window as unknown as { __opened: string[] }).__opened.push(String(u));
      return null;
    }) as typeof window.open;
  });
  return page;
}

const opened = (page: Page) => page.evaluate(() => (window as unknown as { __opened: string[] }).__opened);

// ───────────── Per-page checks ─────────────

async function pageChecks(browser: Browser, paths: string[]): Promise<void> {
  const known = new Set(paths.concat(['/404.html']));
  const titles = new Map<string, string>();
  const descs = new Map<string, string>();
  const checkedLinks = new Set<string>();

  for (const mobile of [true, false]) {
    const page = await newPage(browser, mobile);
    const label = mobile ? 'mobile' : 'desktop';
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
    page.on('console', (m) => m.type() === 'error' && errors.push(`console: ${m.text()}`));
    page.on('requestfailed', (r) => errors.push(`requestfailed: ${r.url()}`));

    for (const p of [...paths, '/404.html']) {
      errors.length = 0;
      const resp = await page.goto(BASE + p, { waitUntil: 'load' });
      const where = `${label} ${p}`;
      check(resp?.status() === (p === '/404.html' ? 404 : 200) || (p === '/404.html' && resp?.status() === 200), `${where}: HTTP status ${resp?.status()}`);
      check(errors.length === 0, `${where}: browser errors ${errors.join(' | ')}`);

      const info = await page.evaluate(() => {
        const q = (s: string) => document.querySelector(s);
        const wa = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href^="https://wa.me/"]'));
        return {
          title: document.title,
          desc: q('meta[name="description"]')?.getAttribute('content') ?? '',
          canonical: q('link[rel="canonical"]')?.getAttribute('href') ?? '',
          h1: document.querySelectorAll('h1').length,
          overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
          floating: q('a.wa-float')?.getAttribute('href') ?? '',
          floatVisible: (() => {
            const el = q('a.wa-float') as HTMLElement | null;
            if (!el) return false;
            const r = el.getBoundingClientRect();
            return r.width > 0 && r.bottom <= window.innerHeight + 1 && r.right <= window.innerWidth + 1;
          })(),
          tel: Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href^="tel:"]')).map((a) => a.getAttribute('href')),
          waLinks: wa.map((a) => a.getAttribute('href') ?? ''),
          badBlank: Array.from(document.querySelectorAll<HTMLAnchorElement>('a[target="_blank"]')).filter((a) => !/noopener/.test(a.rel)).length,
          imgNoAlt: Array.from(document.querySelectorAll('img')).filter((i) => !i.hasAttribute('alt')).length,
          imgBroken: Array.from(document.querySelectorAll<HTMLImageElement>('img')).filter((i) => i.complete && i.naturalWidth === 0).length,
          unlabeled: Array.from(document.querySelectorAll<HTMLElement>('main input:not([type=checkbox]), main select, main textarea')).filter((el) => {
            const id = el.id;
            return !id || !document.querySelector(`label[for="${id}"]`);
          }).length,
          jsonld: Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map((s) => s.textContent ?? ''),
          links: Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href]')).map((a) => a.getAttribute('href') ?? ''),
          destCards: Array.from(document.querySelectorAll('.dest-card')).map((c) => !!c.querySelector('a[href^="https://wa.me/"]')),
          main: !!q('main#main'),
          skip: !!q('a.skip-link'),
        };
      });

      check(info.main && info.skip, `${where}: missing main landmark or skip link`);
      check(info.h1 === 1, `${where}: expected 1 <h1>, found ${info.h1}`);
      check(!info.overflow, `${where}: horizontal scroll at ${label} width`);
      check(info.floating.startsWith(WA), `${where}: floating WhatsApp button missing or wrong link`);
      check(info.floatVisible, `${where}: floating WhatsApp button not visible inside viewport`);
      check(info.tel.includes('tel:+919899290016') && info.tel.includes('tel:+917669426000'), `${where}: both click-to-call links needed`);
      check(info.waLinks.length > 0 && info.waLinks.every((h) => h.startsWith(`${WA}?text=`) && decodeURIComponent(h.split('text=')[1]).startsWith('Hello Prime Enterprises')), `${where}: a WhatsApp link has no prefilled message`);
      check(info.badBlank === 0, `${where}: target=_blank link without rel=noopener`);
      check(info.imgNoAlt === 0, `${where}: image without alt attribute`);
      check(info.unlabeled === 0, `${where}: form control without a <label for>`);
      check(info.destCards.every(Boolean), `${where}: destination card without a WhatsApp button`);

      if (!mobile) {
        const noindex = p === '/404.html';
        if (!noindex) {
          check(info.canonical === `https://primeyatra.co.in${p}`, `${where}: canonical is ${info.canonical}`);
          check(info.title.length > 10 && info.title.length <= 70, `${where}: title length ${info.title.length}`);
          check(info.desc.length >= 70 && info.desc.length <= 175, `${where}: description length ${info.desc.length}`);
          check(!titles.has(info.title), `${where}: duplicate title (also ${titles.get(info.title)})`);
          check(!descs.has(info.desc), `${where}: duplicate description (also ${descs.get(info.desc)})`);
          titles.set(info.title, p);
          descs.set(info.desc, p);
          let parsed = 0;
          for (const j of info.jsonld) {
            try {
              JSON.parse(j);
              parsed++;
            } catch {
              /* counted below */
            }
          }
          check(parsed === info.jsonld.length && parsed > 0, `${where}: invalid or missing JSON-LD`);
        }
        for (const href of info.links) {
          if (/^(https?:|tel:|mailto:|#)/.test(href)) continue;
          const clean = href.split('#')[0].split('?')[0];
          if (!clean || checkedLinks.has(clean)) continue;
          checkedLinks.add(clean);
          const ok = known.has(clean) || fs.existsSync(path.join(DIST, clean)) ;
          check(ok, `${where}: broken internal link ${href}`);
        }
        // in-page anchors
        const anchors = await page.evaluate(() => Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')).map((a) => a.getAttribute('href') ?? '').filter((h) => h.length > 1));
        for (const a of anchors) check((await page.locator(a).count()) > 0, `${where}: anchor ${a} has no target`);
      }
    }
    await page.context().close();
    console.log(`  ${label}: ${paths.length + 1} pages checked`);
  }
}

// ───────────── Navigation ─────────────

async function navChecks(browser: Browser): Promise<void> {
  const m = await newPage(browser, true);
  await m.goto(`${BASE}/`);
  const panel = m.locator('#mobile-nav .mobile-panel');
  check(!(await panel.isVisible()), 'mobile menu starts closed');
  await m.locator('#mobile-nav summary').click();
  check(await panel.isVisible(), 'mobile menu opens');
  const labels = await panel.locator('a.mobile-link').allInnerTexts();
  for (const need of ['Home', 'Domestic Tour Packages', 'International Tour Packages', 'Custom Holidays & Honeymoon', 'Forex & Currency Exchange', 'International Money Transfer', 'Visa', 'About', 'FAQs', 'Contact']) {
    check(labels.some((l) => l.trim() === need), `mobile menu has "${need}"`);
  }
  await m.keyboard.press('Escape');
  check(!(await panel.isVisible()), 'Escape closes the mobile menu');
  await m.locator('#mobile-nav summary').click();
  await panel.getByRole('link', { name: 'FAQs' }).click();
  await m.waitForURL('**/faqs/');
  check(m.url().endsWith('/faqs/'), 'mobile menu link navigates');
  await m.screenshot({ path: path.join(DIST, '..', 'tests', '_shots', 'mobile-faqs.png') }).catch(() => {});
  await m.context().close();

  const d = await newPage(browser, false);
  await d.goto(`${BASE}/`);
  const dd = d.locator('[data-dropdown]').first();
  const menu = dd.locator('.dropdown');
  check(!(await menu.isVisible()), 'desktop dropdown starts closed');
  await dd.locator('button').click();
  check(await menu.isVisible(), 'desktop dropdown opens on click');
  await d.getByRole('link', { name: /International Tour Packages/ }).first().click();
  await d.waitForURL('**/international-tour-packages/');
  check((await d.locator('[aria-current="page"]').count()) > 0, 'active nav item is marked');
  await d.context().close();
}

// ───────────── Forms ─────────────

async function lastOpen(page: Page): Promise<string> {
  const list = await opened(page);
  return decodeURIComponent((list[list.length - 1] ?? '').split('text=')[1] ?? '');
}

async function formChecks(browser: Browser): Promise<void> {
  const today = todayISO();
  const future = addDaysISO(today, 45);
  const future2 = addDaysISO(today, 52);
  const past = addDaysISO(today, -3);

  // Trip widget (home)
  const p = await newPage(browser, true);
  await p.goto(`${BASE}/`);
  const form = p.locator('#form-home');
  await form.locator('button[type=submit]').click();
  check((await opened(p)).length === 0, 'trip widget: empty submit does not open WhatsApp');
  check(await p.locator('#err-home-destination').isVisible(), 'trip widget: destination error shown');
  check(await p.locator('#err-home-departure').isVisible(), 'trip widget: departure error shown');
  check((await p.locator('#home-destination').getAttribute('aria-invalid')) === 'true', 'trip widget: aria-invalid set');

  const minAttr = await p.locator('#home-departure').getAttribute('min');
  check(minAttr === today, `trip widget: date picker min is today (${minAttr})`);

  await p.selectOption('#home-destination', 'Goa');
  await p.fill('#home-departure', past);
  await form.locator('button[type=submit]').click();
  check(/passed/.test((await p.locator('#err-home-departure').textContent()) ?? ''), 'trip widget: past date rejected');
  await p.fill('#home-departure', future);
  await p.fill('#home-return', addDaysISO(future, -2));
  await form.locator('button[type=submit]').click();
  check(/before the departure/.test((await p.locator('#err-home-return').textContent()) ?? ''), 'trip widget: return before departure rejected');
  await p.fill('#home-return', future2);
  await p.fill('#home-travellers', '0');
  await form.locator('button[type=submit]').click();
  check(await p.locator('#err-home-travellers').isVisible(), 'trip widget: 0 travellers rejected');
  await p.fill('#home-travellers', '4');
  await p.selectOption('#home-budget', '₹50,000 to ₹1,00,000');
  await p.fill('#home-name', 'Asha Verma');
  await p.fill('#home-from', 'Vadodara');
  await form.locator('button[type=submit]').click();
  const msg = await lastOpen(p);
  const url = (await opened(p)).at(-1) ?? '';
  check(url.startsWith(`${WA}?text=`), 'trip widget: opens wa.me with the business number');
  for (const part of ['Destination: Goa', 'Travellers: 4', 'Approx. total budget: ₹50,000 to ₹1,00,000', 'Your name: Asha Verma', 'Travelling from: Vadodara', 'Sent from primeyatra.co.in']) {
    check(msg.includes(part), `trip widget: message contains "${part}"`);
  }
  check(/Departure date: \d{1,2} [A-Z][a-z]{2} \d{4}/.test(msg), 'trip widget: departure date is formatted for humans');
  check(await p.locator('#form-home .form-status').isVisible(), 'trip widget: confirmation message shown');
  check(!/confirmed|booked successfully/i.test((await p.locator('#form-home .form-status').textContent()) ?? '') || /Nothing is booked/.test((await p.locator('#form-home .form-status').textContent()) ?? ''), 'trip widget: never claims a booking is confirmed');

  // Callback form + date picker (home)
  const cb = p.locator('#form-home-cb');
  await cb.scrollIntoViewIfNeeded();
  await p.fill('#home-cb-name', 'Asha');
  await p.fill('#home-cb-phone', '12345');
  await cb.locator('button[type=submit]').click();
  check(/valid 10-digit/.test((await p.locator('#err-home-cb-phone').textContent()) ?? ''), 'callback: invalid phone rejected');
  const cbMax = await p.locator('#home-cb-date').getAttribute('max');
  check(cbMax === addDaysISO(today, 60), 'callback: date picker limited to 60 days');
  await p.fill('#home-cb-phone', '+91 76694 26000');
  await p.fill('#home-cb-date', future);
  await p.selectOption('#home-cb-slot', 'Evening');
  await p.selectOption('#home-cb-topic', 'Visa assistance');
  const before = (await opened(p)).length;
  await cb.locator('button[type=submit]').click();
  const cbMsg = await lastOpen(p);
  check((await opened(p)).length === before + 1, 'callback: valid form opens WhatsApp');
  for (const part of ['Callback request', 'Your name: Asha', 'Mobile number: +91 7669426000', 'Preferred time: Evening', 'What is it about?: Visa assistance']) {
    check(cbMsg.includes(part), `callback: message contains "${part}"`);
  }
  await p.context().close();

  // Service forms: required fields block, valid fills open the right subject
  const cases: { path: string; id: string; fill: (pg: Page) => Promise<void>; subject: string; expect: string[] }[] = [
    {
      path: '/forex-currency-exchange/',
      id: 'forex',
      fill: async (pg) => {
        await pg.selectOption('#forex-action', 'Buy foreign currency');
        await pg.selectOption('#forex-currency', 'US dollar (USD)');
        await pg.fill('#forex-amount', '1,500');
      },
      subject: 'Foreign currency exchange',
      expect: ['I want to: Buy foreign currency', 'Currency: US dollar (USD)', 'Approx. amount in that currency: 1500'],
    },
    {
      path: '/international-money-transfer/',
      id: 'transfer',
      fill: async (pg) => {
        await pg.selectOption('#transfer-direction', 'Receive money in India');
        await pg.fill('#transfer-country', 'United Kingdom');
        await pg.fill('#transfer-amount', 'GBP 300');
      },
      subject: 'International money transfer (Western Union)',
      expect: ['I want to: Receive money in India', 'Country (sending to or from): United Kingdom', 'Approx. amount: GBP 300'],
    },
    {
      path: '/visa-assistance/',
      id: 'visa',
      fill: async (pg) => {
        await pg.selectOption('#visa-country', 'Schengen (Europe)');
        await pg.selectOption('#visa-type', 'Tourist');
        await pg.fill('#visa-date', future);
      },
      subject: 'Visa assistance',
      expect: ['Destination country: Schengen (Europe)', 'Visa type: Tourist', 'Number of applicants: 1'],
    },
    {
      path: '/custom-holidays-honeymoon-packages/',
      id: 'custom',
      fill: async (pg) => {
        await pg.selectOption('#custom-type', 'Honeymoon');
        await pg.fill('#custom-departure', future);
        await pg.fill('#custom-name', 'Ravi & Neha');
        await pg.locator('#form-custom label.chip-check', { hasText: 'Beaches' }).click();
        await pg.locator('#form-custom label.chip-check', { hasText: 'Spa and wellness' }).click();
      },
      subject: 'Customised holiday or honeymoon',
      expect: ['Type of trip: Honeymoon', 'What matters most: Beaches, Spa and wellness', 'Your name: Ravi & Neha'],
    },
    {
      path: '/contact-us/',
      id: 'contact',
      fill: async (pg) => {
        await pg.fill('#contact-name', 'Sunil Kumar');
        await pg.fill('#contact-phone', '9876543210');
        await pg.fill('#contact-email', 'sunil@example.com');
        await pg.selectOption('#contact-topic', 'Something else');
        await pg.fill('#contact-message', 'Please call me about a group trip.');
      },
      subject: 'Message from the contact form',
      expect: ['Mobile number: +91 9876543210', 'Email: sunil@example.com', 'Your message: Please call me about a group trip.'],
    },
    {
      path: '/destinations/dubai/',
      id: 'd-dubai',
      fill: async (pg) => {
        await pg.fill('#d-dubai-departure', future);
      },
      subject: 'Trip to Dubai',
      expect: ['Destination: Dubai', 'Travellers: 2'],
    },
  ];

  for (const c of cases) {
    const pg = await newPage(browser, true);
    await pg.goto(BASE + c.path);
    const f = pg.locator(`#form-${c.id}`);
    await f.locator('button[type=submit]').click();
    check((await opened(pg)).length === 0, `${c.id}: empty form is blocked`);
    check((await f.locator('.field-error:visible').count()) > 0, `${c.id}: errors are shown`);
    check(await f.locator('.form-status.is-error').isVisible(), `${c.id}: error summary shown`);
    await c.fill(pg);
    await f.locator('button[type=submit]').click();
    const text = await lastOpen(pg);
    check(text.includes(`I would like to enquire about: ${c.subject}`), `${c.id}: subject "${c.subject}" in message`);
    for (const e of c.expect) check(text.includes(e), `${c.id}: message contains "${e}"`);
    await pg.context().close();
  }

  // Contact: short message rejected
  const pc = await newPage(browser, true);
  await pc.goto(`${BASE}/contact-us/`);
  await pc.fill('#contact-name', 'Sunil');
  await pc.fill('#contact-phone', '9876543210');
  await pc.selectOption('#contact-topic', 'Something else');
  await pc.fill('#contact-message', 'hi');
  await pc.locator('#form-contact button[type=submit]').click();
  check(/more detail/.test((await pc.locator('#err-contact-message').textContent()) ?? ''), 'contact: very short message rejected');
  await pc.context().close();

  // Filters
  const f = await newPage(browser, true);
  await f.goto(`${BASE}/domestic-tour-packages/`);
  const total = await f.locator('.dest-card').count();
  await f.getByRole('button', { name: 'Beach & islands' }).click();
  const shown = await f.locator('.dest-card:visible').count();
  check(total === 7 && shown >= 2 && shown < total, `filter: Beach shows ${shown} of ${total}`);
  check((await f.locator('[data-filter-status]').textContent())?.startsWith('Showing') ?? false, 'filter: status announced');
  await f.getByRole('button', { name: 'All', exact: true }).click();
  check((await f.locator('.dest-card:visible').count()) === total, 'filter: All restores every card');
  await f.context().close();
}

// ───────────── Content rules ─────────────

function contentChecks(paths: string[]): void {
  const priceRe = /(₹\s?\d|\bRs\.?\s?\d|\bINR\s?\d|\$\s?\d|USD\s?\d{2,}|from\s+₹)/;
  const bad = /(guaranteed visa|100% (visa )?approval|visa guaranteed|best price guarantee|lowest price|live rate|rated \d|stars? rating|★)/i;
  for (const p of paths.concat(['/404.html'])) {
    const file = p.endsWith('.html') ? p : `${p}index.html`;
    const html = fs.readFileSync(path.join(DIST, file), 'utf8');
    const text = html
      .replace(/<script[\s\S]*?<\/script>/g, '')
      .replace(/<style[\s\S]*?<\/style>/g, '')
      .replace(/<[^>]+>/g, ' ');
    // Budget ranges in the form dropdowns are choices, not prices.
    const visible = text.replace(/Under ₹25,000|₹25,000 to ₹50,000|₹50,000 to ₹1,00,000|₹1,00,000 to ₹2,50,000|Above ₹2,50,000|₹50,000 or USD 500|e\.g\. ₹50,000/g, '');
    check(!priceRe.test(visible), `${p}: contains a price-like figure`);
    check(!bad.test(text), `${p}: contains a claim we cannot back (${(bad.exec(text) ?? [''])[0]})`);
    check(!/%%(CSS|JS)%%/.test(html), `${p}: unreplaced placeholder`);
  }
  const robots = fs.readFileSync(path.join(DIST, 'robots.txt'), 'utf8');
  check(/Sitemap: https:\/\/primeyatra\.co\.in\/sitemap\.xml/.test(robots), 'robots.txt points to the sitemap');
  check(paths.length >= 10, `sitemap lists ${paths.length} pages`);
  for (const must of ['/', '/domestic-tour-packages/', '/international-tour-packages/', '/custom-holidays-honeymoon-packages/', '/forex-currency-exchange/', '/international-money-transfer/', '/visa-assistance/', '/about-us/', '/contact-us/', '/faqs/']) {
    check(paths.includes(must), `sitemap has ${must}`);
  }
  for (const d of ['kashmir', 'manali', 'goa', 'kerala', 'rajasthan', 'uttarakhand', 'andaman', 'dubai', 'thailand', 'bali', 'singapore', 'maldives', 'vietnam', 'europe']) {
    check(paths.includes(`/destinations/${d}/`), `sitemap has destination ${d}`);
  }
}

// ───────────── Run ─────────────

async function main(): Promise<void> {
  fs.mkdirSync(path.resolve(import.meta.dirname, '_shots'), { recursive: true });
  const paths = sitemapPaths();
  const server = await startServer(PORT);
  const browser = await chromium.launch();
  try {
    console.log('Content rules');
    contentChecks(paths);
    console.log('Pages (mobile 390px and desktop 1280px)');
    await pageChecks(browser, paths);
    console.log('Navigation');
    await navChecks(browser);
    console.log('Forms, dates, WhatsApp hand-off, filters');
    await formChecks(browser);
  } finally {
    await browser.close();
    server.close();
  }
  console.log(`\n${passed} checks passed, ${failures.length} failed`);
  if (failures.length) {
    console.log(failures.map((f) => ` - ${f}`).join('\n'));
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
