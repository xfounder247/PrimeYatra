import { site, mapsEmbedUrl } from './config';
import { esc, cx, jsonLd } from './lib/html';
import { icon, whatsappIcon } from './lib/icons';
import { waUrl, ctaMessage, telUrl } from './lib/whatsapp';
import { abs, businessSchema, websiteSchema, breadcrumbSchema, type Crumb } from './seo';
import { destImg } from './images';
import { THEME_LABEL, MONTHS, domestic, international, type Destination } from './data/destinations';
import { services, type Service } from './data/services';
import type { Faq } from './data/faqs';

// ───────────────────────── Small building blocks ─────────────────────────

export type NavKey = 'home' | 'domestic' | 'international' | 'custom' | 'forex' | 'transfer' | 'visa' | 'about' | 'faqs' | 'contact' | '';

export function waButton(message: string, label: string, o: { cls?: string; size?: 'sm' | 'lg' } = {}): string {
  return `<a href="${esc(waUrl(message))}" target="_blank" rel="noopener noreferrer" class="${cx('btn btn-wa', o.size === 'sm' && 'btn-sm', o.size === 'lg' && 'btn-lg', o.cls)}" data-wa-cta>${whatsappIcon('h-5 w-5 shrink-0')}<span>${esc(label)}</span><span class="sr-only"> (opens WhatsApp)</span></a>`;
}

export function callLink(num: { display: string; tel: string }, cls: string, label = 'Call'): string {
  return `<a href="${telUrl(num.tel)}" class="${cls}" data-call>${icon('phone', 'h-4 w-4 shrink-0')}<span>${label ? `<span class="font-normal opacity-90">${esc(label)}</span> ` : ''}${esc(num.display)}</span></a>`;
}

export function callButtons(variant: 'outline' | 'ghost' = 'outline', size: 'sm' | 'md' = 'md'): string {
  const cls = cx('btn', variant === 'outline' ? 'btn-outline' : 'btn-ghost', size === 'sm' && 'btn-sm');
  return `${callLink(site.phone, cls)}${callLink(site.altPhone, cls)}`;
}

export function monthRange(months: number[], yearRound?: boolean): string {
  const set = new Set(months);
  if (yearRound || set.size === 12) return 'Year-round';
  const out: string[] = [];
  for (let m = 1; m <= 12; m++) {
    if (!set.has(m) || set.has(m === 1 ? 12 : m - 1)) continue;
    let end = m;
    while (set.has(end === 12 ? 1 : end + 1) && (end === 12 ? 1 : end + 1) !== m) end = end === 12 ? 1 : end + 1;
    out.push(end === m ? MONTHS[m - 1] : `${MONTHS[m - 1]} to ${MONTHS[end - 1]}`);
  }
  return out.join(', ');
}

export function eyebrow(text: string, dark = false): string {
  return `<p class="eyebrow ${dark ? 'text-teal-300' : 'text-teal-700'}">${esc(text)}</p>`;
}

export function sectionHead(o: { eyebrow?: string; title: string; lead?: string; center?: boolean; dark?: boolean }): string {
  return `<div class="${cx('max-w-3xl', o.center && 'mx-auto text-center')}">${o.eyebrow ? eyebrow(o.eyebrow, o.dark) : ''}<h2 class="section-title ${o.dark ? 'text-white' : ''}">${esc(o.title)}</h2>${
    o.lead ? `<p class="mt-3 text-base leading-relaxed sm:text-lg ${o.dark ? 'text-navy-100' : 'text-navy-700'}">${esc(o.lead)}</p>` : ''
  }</div>`;
}

export function section(o: { id?: string; tone?: 'white' | 'sand' | 'navy'; body: string; cls?: string }): string {
  const tone = o.tone ?? 'white';
  return `<section${o.id ? ` id="${o.id}"` : ''} class="${cx('py-14 sm:py-20', tone === 'sand' && 'bg-sand-50', tone === 'navy' && 'bg-navy-950 text-white', o.cls)}"><div class="container-x">${o.body}</div></section>`;
}

export function checkList(items: string[], cls = ''): string {
  return `<ul class="space-y-2 ${cls}">${items.map((i) => `<li class="flex gap-2.5">${icon('check', 'mt-0.5 h-5 w-5 shrink-0 text-teal-700')}<span>${esc(i)}</span></li>`).join('')}</ul>`;
}

export function steps(items: { title: string; text: string }[], dark = false): string {
  return `<ol class="grid gap-5 sm:grid-cols-2 lg:grid-cols-${Math.min(items.length, 4)}">${items
    .map(
      (s, i) =>
        `<li class="${dark ? 'rounded-2xl border border-white/15 bg-white/5 p-5' : 'card p-5'}"><span class="${dark ? 'bg-teal-400 text-navy-950' : 'bg-navy-900 text-white'} flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold">${i + 1}</span><h3 class="mt-3 text-lg font-bold ${dark ? 'text-white' : ''}">${esc(s.title)}</h3><p class="mt-1.5 text-sm leading-relaxed ${dark ? 'text-navy-100' : 'text-navy-700'}">${esc(s.text)}</p></li>`,
    )
    .join('')}</ol>`;
}

export function faqList(items: Faq[]): string {
  return `<div class="divide-y divide-navy-100 overflow-hidden rounded-2xl border border-navy-100 bg-white">${items
    .map(
      (f) =>
        `<details class="faq group"><summary><span>${esc(f.q)}</span>${icon('down', 'h-5 w-5 shrink-0 text-teal-700 transition-transform group-open:rotate-180')}</summary><div class="faq-a"><p>${esc(f.a)}</p></div></details>`,
    )
    .join('')}</div>`;
}

export function ctaBand(o: { title: string; text: string; message: string; label?: string }): string {
  return `<section class="cta-band"><div class="container-x py-14 sm:py-16"><div class="mx-auto max-w-3xl text-center"><h2 class="font-display text-3xl font-bold text-white sm:text-4xl">${esc(o.title)}</h2><p class="mt-3 text-base text-navy-50 sm:text-lg">${esc(o.text)}</p><div class="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center">${waButton(o.message, o.label ?? 'Chat on WhatsApp', { size: 'lg' })}${callButtons('ghost')}</div></div></div></section>`;
}

export function breadcrumbs(crumbs: Crumb[]): string {
  return `<nav aria-label="Breadcrumb" class="mb-5"><ol class="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-navy-100">${crumbs
    .map((c, i) =>
      i === crumbs.length - 1
        ? `<li aria-current="page" class="font-semibold text-white">${esc(c.name)}</li>`
        : `<li class="flex items-center gap-2"><a href="${c.path}" class="underline-offset-4 hover:underline">${esc(c.name)}</a><span aria-hidden="true" class="opacity-60">/</span></li>`,
    )
    .join('')}</ol></nav>`;
}

export function pageHero(o: { crumbs: Crumb[]; title: string; lead: string; actions?: string; media?: string; badges?: string[] }): string {
  return `<section class="hero-bg relative overflow-hidden text-white"><div class="container-x relative py-12 sm:py-16 lg:py-20"><div class="grid items-center gap-8 ${o.media ? 'lg:grid-cols-[1.15fr_.85fr]' : ''}"><div>${breadcrumbs(o.crumbs)}<h1 class="font-display text-4xl font-bold leading-tight sm:text-5xl">${esc(o.title)}</h1><p class="mt-4 max-w-2xl text-base leading-relaxed text-navy-50 sm:text-lg">${esc(o.lead)}</p>${
    o.badges?.length ? `<ul class="mt-5 flex flex-wrap gap-2">${o.badges.map((b) => `<li class="chip-dark">${esc(b)}</li>`).join('')}</ul>` : ''
  }${o.actions ? `<div class="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">${o.actions}</div>` : ''}</div>${o.media ? `<div class="overflow-hidden rounded-3xl border border-white/20 shadow-2xl">${o.media}</div>` : ''}</div></div></section>`;
}

// ───────────────────────── Cards ─────────────────────────

export function destMessage(d: Destination, style?: string): string {
  return ctaMessage(
    style
      ? `I would like a ${style.toLowerCase()} package for ${d.name}. Please share itinerary options and a quotation.`
      : `I am interested in the ${d.name} tour package. Please share itinerary options and a quotation.`,
  );
}

export function destCard(d: Destination): string {
  const href = `/destinations/${d.slug}/`;
  return `<article class="dest-card group" data-filter-item data-themes="${d.themes.join(' ')}">
  <a href="${href}" class="relative block aspect-[4/3] overflow-hidden bg-navy-100" tabindex="-1" aria-hidden="true">${destImg(d.slug, `${d.name}, ${d.place}`, { cls: 'h-full w-full object-cover transition duration-700 group-hover:scale-105' })}<span class="chip-light absolute left-3 top-3">${esc(d.place)}</span></a>
  <div class="flex flex-1 flex-col p-4 sm:p-5">
    <h3 class="font-display text-xl font-bold"><a href="${href}" class="hover:text-teal-700">${esc(d.name)}</a></h3>
    <p class="mt-1 text-sm leading-relaxed text-navy-700">${esc(d.tagline)}</p>
    <dl class="mt-3 space-y-1.5 text-sm text-navy-800">
      <div class="flex items-center gap-2">${icon('calendar', 'h-4 w-4 shrink-0 text-teal-700')}<dt class="sr-only">Best time</dt><dd>Best: ${esc(monthRange(d.bestMonths, d.yearRound))}</dd></div>
      <div class="flex items-center gap-2">${icon('clock', 'h-4 w-4 shrink-0 text-teal-700')}<dt class="sr-only">Suggested stay</dt><dd>${esc(d.suggestedStay)}</dd></div>
    </dl>
    <ul class="mt-3 flex flex-wrap gap-1.5">${d.themes.slice(0, 3).map((t) => `<li class="chip">${esc(THEME_LABEL[t])}</li>`).join('')}</ul>
    <p class="mt-3 text-xs font-semibold text-navy-600">Price on request, quoted for your dates</p>
    <div class="mt-auto grid grid-cols-2 gap-2 pt-4"><a href="${href}" class="btn btn-outline btn-sm">View details</a>${waButton(destMessage(d), 'WhatsApp', { size: 'sm' })}</div>
  </div>
</article>`;
}

export function serviceCard(s: Service, headingLevel: 'h2' | 'h3' = 'h3'): string {
  return `<article class="card flex flex-col p-5 sm:p-6"><span class="icon-badge">${icon(s.icon, 'h-6 w-6')}</span><${headingLevel} class="mt-4 font-display text-xl font-bold">${esc(s.title)}</${headingLevel}><p class="mt-2 text-sm leading-relaxed text-navy-700">${esc(s.short)}</p>${checkList(s.points, 'mt-4 text-sm text-navy-800')}<div class="mt-auto flex flex-col gap-2 pt-5 sm:flex-row"><a href="${s.href}" class="btn btn-outline btn-sm flex-1">Learn more${icon('arrow', 'h-4 w-4')}</a>${waButton(ctaMessage(s.waTopic), s.waLabel, { size: 'sm', cls: 'flex-1' })}</div></article>`;
}

export function monthStrip(d: Destination): string {
  const best = new Set(d.yearRound ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] : d.bestMonths);
  return `<ul class="grid grid-cols-6 gap-1.5 sm:grid-cols-12" aria-label="Best months to visit ${esc(d.name)}">${MONTHS.map((m, i) => {
    const on = best.has(i + 1);
    return `<li class="${on ? 'bg-teal-700 text-white' : 'bg-navy-50 text-navy-600'} rounded-lg px-1 py-2 text-center text-xs font-semibold">${m}${on ? '<span class="sr-only"> recommended</span>' : ''}</li>`;
  }).join('')}</ul>`;
}

// ───────────────────────── Map ─────────────────────────

export function mapSection(): string {
  const embed = mapsEmbedUrl();
  const open = `<a href="${esc(site.googleBusinessUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-navy">${icon('pin', 'h-5 w-5')}<span>Open in Google Maps</span><span class="sr-only"> (opens in a new tab)</span></a>`;
  if (embed) {
    return `<div class="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card"><iframe title="Map showing the Prime Enterprises location" src="${esc(embed)}" class="h-80 w-full sm:h-96" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe><div class="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"><p class="text-sm text-navy-800">${icon('pin', 'mr-1.5 inline h-4 w-4 text-teal-700')}${esc(site.address)}</p>${open}</div></div>`;
  }
  return `<div class="rounded-2xl border border-navy-100 bg-white p-6 text-center shadow-card sm:p-10"><span class="icon-badge mx-auto">${icon('pin', 'h-6 w-6')}</span><h3 class="mt-4 font-display text-2xl font-bold">Find us on Google Maps</h3><p class="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-navy-700">See our verified Google Business Profile for the map, directions, photos and reviews from customers.</p><div class="mt-5 flex justify-center">${open}</div></div>`;
}

// ───────────────────────── Header, footer, layout ─────────────────────────

type NavLeaf = { key: NavKey; label: string; href: string; desc?: string };
type NavItem = NavLeaf | { label: string; id: string; children: NavLeaf[] };

const NAV: NavItem[] = [
  { key: 'home', label: 'Home', href: '/' },
  {
    label: 'Tours',
    id: 'tours',
    children: [
      { key: 'domestic', label: 'Domestic Tour Packages', href: '/domestic-tour-packages/', desc: 'Kashmir, Goa, Kerala and more' },
      { key: 'international', label: 'International Tour Packages', href: '/international-tour-packages/', desc: 'Dubai, Thailand, Bali, Europe' },
      { key: 'custom', label: 'Custom Holidays & Honeymoon', href: '/custom-holidays-honeymoon-packages/', desc: 'Trips built around you' },
    ],
  },
  {
    label: 'Forex & Transfers',
    id: 'money',
    children: [
      { key: 'forex', label: 'Forex & Currency Exchange', href: '/forex-currency-exchange/', desc: 'Buy or sell foreign currency' },
      { key: 'transfer', label: 'International Money Transfer', href: '/international-money-transfer/', desc: 'Western Union assistance' },
    ],
  },
  { key: 'visa', label: 'Visa', href: '/visa-assistance/' },
  { key: 'about', label: 'About', href: '/about-us/' },
  { key: 'faqs', label: 'FAQs', href: '/faqs/' },
  { key: 'contact', label: 'Contact', href: '/contact-us/' },
];

function logo(size = 40): string {
  return `<svg width="${size}" height="${size}" viewBox="0 0 40 40" aria-hidden="true" focusable="false"><rect width="40" height="40" rx="11" fill="#0e1f3b"/><path d="M9 21.5 30 10l-5.2 21-5.8-6.4z" fill="#fff"/><path d="m19 24.6 11-14.6-14 9.6z" fill="#2ec4bf"/><path d="M9 21.5 15.8 19.6 19 24.6 17.6 29.5z" fill="#cfe3ff"/></svg>`;
}

function topbar(): string {
  return `<div class="bg-navy-950 text-white"><div class="container-x flex items-center justify-between gap-x-4 gap-y-1 py-1.5 text-xs sm:text-sm"><p class="hidden text-navy-100 md:block">${esc(site.tagline)}${site.hours ? ` · ${esc(site.hours)}` : ''}</p><div class="ml-auto flex flex-wrap items-center justify-end gap-x-4 sm:gap-x-5">${callLink(site.phone, 'topbar-link', 'Call')}${callLink(site.altPhone, 'topbar-link', '')}<a href="${esc(waUrl(ctaMessage('I would like some help planning a trip or with forex and visa.')))}" target="_blank" rel="noopener noreferrer" class="topbar-link hidden sm:inline-flex">${whatsappIcon('h-4 w-4')}<span>WhatsApp<span class="sr-only"> (opens WhatsApp)</span></span></a></div></div></div>`;
}

function navLink(l: NavLeaf, active: NavKey, cls: string): string {
  return `<a href="${l.href}" class="${cls}"${l.key === active ? ' aria-current="page"' : ''}>${esc(l.label)}</a>`;
}

function desktopNav(active: NavKey): string {
  return `<nav aria-label="Main" class="hidden lg:block"><ul class="flex items-center gap-0.5">${NAV.map((item) => {
    if ('children' in item) {
      const on = item.children.some((c) => c.key === active);
      return `<li class="relative" data-dropdown><button type="button" class="nav-link ${on ? 'is-active' : ''}" aria-expanded="false" aria-controls="dd-${item.id}">${esc(item.label)}${icon('down', 'h-4 w-4')}</button><div id="dd-${item.id}" class="dropdown"><ul>${item.children
        .map(
          (c) =>
            `<li><a href="${c.href}" class="dropdown-link"${c.key === active ? ' aria-current="page"' : ''}><span class="block font-semibold text-navy-900">${esc(c.label)}</span><span class="block text-xs text-navy-600">${esc(c.desc ?? '')}</span></a></li>`,
        )
        .join('')}</ul></div></li>`;
    }
    return `<li>${navLink(item, active, 'nav-link')}</li>`;
  }).join('')}</ul></nav>`;
}

function mobileNav(active: NavKey): string {
  const groups = NAV.map((item) =>
    'children' in item
      ? `<li><p class="px-3 pb-1 pt-4 text-xs font-bold uppercase tracking-wider text-teal-700">${esc(item.label)}</p><ul>${item.children.map((c) => `<li>${navLink(c, active, 'mobile-link')}</li>`).join('')}</ul></li>`
      : `<li>${navLink(item, active, 'mobile-link')}</li>`,
  ).join('');
  return `<details class="group lg:hidden" id="mobile-nav"><summary class="menu-btn" aria-label="Open menu"><span class="group-open:hidden">${icon('menu', 'h-6 w-6')}</span><span class="hidden group-open:inline">${icon('close', 'h-6 w-6')}</span></summary><div class="mobile-panel"><ul class="px-2 pb-2">${groups}</ul><div class="grid gap-2 border-t border-navy-100 p-4">${waButton(ctaMessage('I would like some help planning a trip or with forex and visa.'), 'Chat on WhatsApp')}${callButtons('outline')}</div></div></details>`;
}

function header(active: NavKey): string {
  return `<header class="sticky top-0 z-40 border-b border-navy-100 bg-white/95 backdrop-blur" id="site-header"><div class="container-x flex h-16 items-center justify-between gap-3 lg:h-[4.5rem]"><a href="/" class="flex items-center gap-2.5" aria-label="${esc(site.name)}, home">${logo()}<span class="leading-tight"><span class="block font-display text-lg font-bold text-navy-900">${esc(site.name)}</span><span class="block text-[0.65rem] font-bold uppercase tracking-[0.14em] text-teal-700">${esc(site.tagline)}</span></span></a>${desktopNav(active)}<div class="flex items-center gap-2">${waButton(ctaMessage('I would like some help planning a trip or with forex and visa.'), 'Enquire', { size: 'sm', cls: 'hidden lg:inline-flex' })}${mobileNav(active)}</div></div></header>`;
}

function footer(): string {
  const social = [
    site.social.instagram && ['Instagram', site.social.instagram],
    site.social.facebook && ['Facebook', site.social.facebook],
    site.social.youtube && ['YouTube', site.social.youtube],
  ].filter(Boolean) as [string, string][];
  const li = (href: string, text: string) => `<li><a href="${href}" class="footer-link">${esc(text)}</a></li>`;
  return `<footer class="dark-zone bg-navy-950 pb-28 pt-14 text-navy-100 sm:pb-10"><div class="container-x"><div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
<div><a href="/" class="flex items-center gap-2.5 text-white" aria-label="${esc(site.name)}, home">${logo(44)}<span class="font-display text-xl font-bold">${esc(site.name)}</span></a><p class="mt-4 max-w-sm text-sm leading-relaxed">Tour packages, forex, money transfer assistance and visa support, all reachable on WhatsApp or phone.</p><div class="mt-5 flex flex-col items-start gap-2">${waButton(ctaMessage('I would like some help planning a trip or with forex and visa.'), 'Chat on WhatsApp', { size: 'sm' })}${callLink(site.phone, 'footer-link inline-flex items-center gap-2 font-semibold text-white', 'Call')}${callLink(site.altPhone, 'footer-link inline-flex items-center gap-2 font-semibold text-white', 'Call')}</div>${site.email ? `<p class="mt-3 text-sm"><a class="footer-link" href="mailto:${esc(site.email)}">${esc(site.email)}</a></p>` : ''}${site.address ? `<p class="mt-3 max-w-xs text-sm">${esc(site.address)}</p>` : ''}</div>
<div><h2 class="footer-h">Services</h2><ul class="mt-3 space-y-2 text-sm">${services.map((s) => li(s.href, s.title)).join('')}</ul></div>
<div><h2 class="footer-h">Destinations</h2><ul class="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">${[...domestic, ...international].map((d) => li(`/destinations/${d.slug}/`, d.name)).join('')}</ul></div>
<div><h2 class="footer-h">Company</h2><ul class="mt-3 space-y-2 text-sm">${li('/about-us/', 'About us')}${li('/contact-us/', 'Contact us')}${li('/faqs/', 'FAQs')}${li('/privacy-policy/', 'Privacy policy')}${li('/terms-and-conditions/', 'Terms & conditions')}<li><a href="${esc(site.googleBusinessUrl)}" target="_blank" rel="noopener noreferrer" class="footer-link inline-flex items-center gap-1.5">Google Business Profile${icon('external', 'h-3.5 w-3.5')}<span class="sr-only"> (opens in a new tab)</span></a></li>${social.map(([n, u]) => `<li><a href="${esc(u)}" target="_blank" rel="noopener noreferrer" class="footer-link">${n}</a></li>`).join('')}</ul>${
    site.credentials.length ? `<ul class="mt-5 space-y-1 text-xs">${site.credentials.map((c) => `<li>${esc(c.label)}: ${esc(c.value)}</li>`).join('')}</ul>` : ''
  }</div></div>
<div class="mt-10 border-t border-white/10 pt-6 text-xs leading-relaxed text-navy-200"><p>Prices, availability, exchange rates and visa requirements change often and are confirmed on enquiry. Visa decisions rest solely with the issuing authority. Forms on this website prepare a WhatsApp message; nothing is booked or confirmed until we reply and you agree.</p><p class="mt-3">&copy; ${site.year} ${esc(site.name)}. All rights reserved.</p></div></div></footer>`;
}

function floatingWhatsApp(message: string): string {
  return `<a href="${esc(waUrl(message))}" target="_blank" rel="noopener noreferrer" class="wa-float" aria-label="Chat with ${esc(site.name)} on WhatsApp (opens WhatsApp)" data-wa-float><span class="wa-float-ring" aria-hidden="true"></span>${whatsappIcon('h-7 w-7')}<span class="wa-float-label">Chat with us</span></a>`;
}

export type PageMeta = {
  path: string;
  title: string;
  description: string;
  body: string;
  active?: NavKey;
  schema?: object[];
  waMessage?: string;
  noindex?: boolean;
};

const FONTS = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700&display=swap';

export function layout(p: PageMeta): string {
  const url = abs(p.path);
  const og = abs('/assets/og-default.png');
  const schema = [...(p.path === '/' ? [businessSchema(), websiteSchema()] : []), ...(p.schema ?? [])];
  return `<!doctype html>
<html lang="en-IN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(p.title)}</title>
<meta name="description" content="${esc(p.description)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="${p.noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large'}">
<meta name="theme-color" content="#0e1f3b">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:locale" content="en_IN">
<meta property="og:title" content="${esc(p.title)}">
<meta property="og:description" content="${esc(p.description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(p.title)}">
<meta name="twitter:description" content="${esc(p.description)}">
<meta name="twitter:image" content="${og}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="${FONTS}" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="${FONTS}"></noscript>
<link rel="stylesheet" href="%%CSS%%">
${schema.map((s) => jsonLd(s)).join('\n')}
</head>
<body>
<a href="#main" class="skip-link">Skip to main content</a>
${topbar()}
${header(p.active ?? '')}
<main id="main" tabindex="-1">
${p.body}
</main>
${footer()}
${floatingWhatsApp(p.waMessage ?? ctaMessage('I would like some help planning a trip or with forex and visa.'))}
<script src="%%JS%%" defer></script>
</body>
</html>`;
}

export function crumbsFor(...items: Crumb[]): Crumb[] {
  return [{ name: 'Home', path: '/' }, ...items];
}

export { breadcrumbSchema };
