import { esc } from '../lib/html';
import { icon } from '../lib/icons';
import { ctaMessage, waUrl } from '../lib/whatsapp';
import { whatsappIcon } from '../lib/icons';
import {
  section,
  sectionHead,
  destCard,
  destMessage,
  waButton,
  callButtons,
  pageHero,
  crumbsFor,
  monthStrip,
  monthRange,
  checkList,
  steps,
  type PageMeta,
} from '../components';
import { breadcrumbSchema, webPageSchema, itemListSchema, destinationSchema, faqSchema } from '../seo';
import { destinations, domestic, international, THEME_LABEL, type Destination, type Theme } from '../data/destinations';
import { faqsFor } from '../data/faqs';
import { destImg } from '../images';
import { customHolidayForm } from '../forms';
import { widgetSection, callbackSection, faqSection, howItWorks, callout, closingCta } from './common';

// ───────────── Domestic and international listing pages ─────────────

function filterBar(list: Destination[]): string {
  const themes: Theme[] = [];
  list.forEach((d) => d.themes.forEach((t) => !themes.includes(t) && themes.push(t)));
  return `<div data-filter-group class="flex flex-wrap gap-2" role="group" aria-label="Filter destinations by trip type"><button type="button" class="filter-btn" data-filter="all" aria-pressed="true">All</button>${themes
    .map((t) => `<button type="button" class="filter-btn" data-filter="${t}" aria-pressed="false">${esc(THEME_LABEL[t])}</button>`)
    .join('')}</div><p class="sr-only" data-filter-status aria-live="polite"></p>`;
}

function listing(list: Destination[], eyebrow: string, title: string, lead: string): string {
  return section({
    id: 'destinations',
    body: `${sectionHead({ eyebrow, title, lead })}<div class="mt-6">${filterBar(list)}</div><div class="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">${list.map(destCard).join('')}</div><p class="mt-6 text-sm text-navy-700">${icon('info', 'mr-1.5 inline h-4 w-4 align-[-3px] text-teal-700')}Prices are not listed because they change with season, hotel, flights and group size. Message us for a quotation for your dates.</p>`,
  });
}

export function domesticPage(): PageMeta {
  const path = '/domestic-tour-packages/';
  const title = 'Domestic Tour Packages India | Prime Enterprises';
  const description =
    'Domestic tour packages to Kashmir, Manali, Goa, Kerala, Rajasthan, Uttarakhand and Andaman. Customised trips for families, couples and groups. Enquire on WhatsApp.';
  const msg = ctaMessage('I am interested in a domestic tour package in India. Please share options and a quotation.');
  const body =
    pageHero({
      crumbs: crumbsFor({ name: 'Domestic Tour Packages', path }),
      title: 'Domestic tour packages across India',
      lead: 'Hills, beaches, backwaters, forts and islands. Pick a destination below or tell us your dates and budget, and we will plan the rest.',
      badges: ['7 popular destinations', 'Families, couples and groups', 'Customised, not fixed'],
      actions: `${waButton(msg, 'Enquire on WhatsApp', { size: 'lg' })}${callButtons('ghost')}`,
    }) +
    listing(domestic, 'India', 'Popular Indian destinations', 'Every trip is a starting point. We adjust hotels, nights and activities to fit you.') +
    widgetSection('dom', { lead: 'Choose a destination and dates. Your details open in WhatsApp for you to send.' }) +
    howItWorks('white') +
    callbackSection('dom-cb', 'Domestic tour package', 'sand') +
    faqSection(faqsFor('tours'), { tone: 'white' }) +
    closingCta(msg, 'Tell us where you want to go', 'Send your dates and budget on WhatsApp and we will reply with options.');
  return {
    path,
    title,
    description,
    body,
    active: 'domestic',
    waMessage: msg,
    schema: [
      breadcrumbSchema(crumbsFor({ name: 'Domestic Tour Packages', path })),
      webPageSchema('Domestic Tour Packages', description, path, 'CollectionPage'),
      itemListSchema('Domestic destinations', domestic.map((d) => ({ name: d.name, path: `/destinations/${d.slug}/` }))),
      faqSchema(faqsFor('tours')),
    ],
  };
}

export function internationalPage(): PageMeta {
  const path = '/international-tour-packages/';
  const title = 'International Tour Packages | Prime Enterprises';
  const description =
    'International tour packages to Dubai, Thailand, Bali, Singapore, Maldives, Vietnam and Europe, with visa and forex help. Customised trips. Enquire on WhatsApp.';
  const msg = ctaMessage('I am interested in an international tour package. Please share options and a quotation.');
  const extras = [
    { i: 'visa', t: 'Visa guidance', d: 'We check the current process for your destination and help prepare your documents. We cannot promise approval.', href: '/visa-assistance/', m: ctaMessage('I am planning an international trip and need visa assistance.'), l: 'Ask about visa' },
    { i: 'cash', t: 'Foreign currency', d: 'Ask for today\'s rate and the documents needed to buy currency for your trip.', href: '/forex-currency-exchange/', m: ctaMessage('I am planning an international trip and would like today\'s rate for foreign currency.'), l: 'Ask for today\'s rate' },
    { i: 'send', t: 'Money transfer help', d: 'Assistance with Western Union transfers for family, study or travel needs.', href: '/international-money-transfer/', m: ctaMessage('I need help with an international money transfer (Western Union).'), l: 'Get transfer help' },
  ];
  const body =
    pageHero({
      crumbs: crumbsFor({ name: 'International Tour Packages', path }),
      title: 'International tour packages',
      lead: 'From the skyline of Dubai to the islands of the Maldives and the Alps in Europe. We plan the trip and help with visa and forex alongside.',
      badges: ['7 popular destinations', 'Visa and forex help', 'First-time traveller friendly'],
      actions: `${waButton(msg, 'Enquire on WhatsApp', { size: 'lg' })}${callButtons('ghost')}`,
    }) +
    listing(international, 'Abroad', 'Popular international destinations', 'Tell us your dates and budget. We suggest routes, stays and activities, and handle the paperwork guidance.') +
    section({
      tone: 'sand',
      body:
        sectionHead({ eyebrow: 'Beyond the itinerary', title: 'Trip, visa and currency under one roof' }) +
        `<div class="mt-8 grid gap-5 md:grid-cols-3">${extras
          .map(
            (e) =>
              `<article class="card flex flex-col p-5 sm:p-6"><span class="icon-badge">${icon(e.i, 'h-6 w-6')}</span><h3 class="mt-4 font-display text-xl font-bold">${esc(e.t)}</h3><p class="mt-2 text-sm leading-relaxed text-navy-700">${esc(e.d)}</p><div class="mt-auto flex flex-col gap-2 pt-5 sm:flex-row"><a href="${e.href}" class="btn btn-outline btn-sm flex-1">Learn more${icon('arrow', 'h-4 w-4')}</a>${waButton(e.m, e.l, { size: 'sm', cls: 'flex-1' })}</div></article>`,
          )
          .join('')}</div>`,
    }) +
    widgetSection('intl', { tone: 'white', lead: 'Choose a destination and dates. Your details open in WhatsApp for you to send.' }) +
    howItWorks('sand') +
    callbackSection('intl-cb', 'International tour package', 'white') +
    faqSection(faqsFor('tours', 'visa').slice(0, 7), { tone: 'sand' }) +
    closingCta(msg, 'Planning a trip abroad?', 'Send your dates and budget on WhatsApp and we will reply with options.');
  return {
    path,
    title,
    description,
    body,
    active: 'international',
    waMessage: msg,
    schema: [
      breadcrumbSchema(crumbsFor({ name: 'International Tour Packages', path })),
      webPageSchema('International Tour Packages', description, path, 'CollectionPage'),
      itemListSchema('International destinations', international.map((d) => ({ name: d.name, path: `/destinations/${d.slug}/` }))),
      faqSchema(faqsFor('tours', 'visa').slice(0, 7)),
    ],
  };
}

// ───────────── Destination detail page ─────────────

export function destinationPage(d: Destination): PageMeta {
  const path = `/destinations/${d.slug}/`;
  const listPath = d.kind === 'domestic' ? '/domestic-tour-packages/' : '/international-tour-packages/';
  const listName = d.kind === 'domestic' ? 'Domestic Tour Packages' : 'International Tour Packages';
  const crumbs = crumbsFor({ name: listName, path: listPath }, { name: d.name, path });
  const title = `${d.name} Tour Packages | Prime Enterprises`;
  const msg = destMessage(d);
  const honeymoonMsg = destMessage(d, 'honeymoon');
  const related = destinations.filter((x) => x.kind === d.kind && x.slug !== d.slug).slice(0, 3);

  const facts = `<div class="card p-5 sm:p-6"><h2 class="font-display text-xl font-bold">At a glance</h2><dl class="mt-4 space-y-3 text-sm"><div><dt class="font-semibold text-navy-600">Place</dt><dd>${esc(d.place)}</dd></div><div><dt class="font-semibold text-navy-600">Best time</dt><dd>${esc(d.bestTime)}</dd></div><div><dt class="font-semibold text-navy-600">Suggested stay</dt><dd>${esc(d.suggestedStay)}</dd></div>${
    d.currency ? `<div><dt class="font-semibold text-navy-600">Currency</dt><dd>${esc(d.currency)}</dd></div>` : ''
  }<div><dt class="font-semibold text-navy-600">Good for</dt><dd class="mt-1 flex flex-wrap gap-1.5">${d.themes.map((t) => `<span class="chip">${esc(THEME_LABEL[t])}</span>`).join('')}</dd></div><div><dt class="font-semibold text-navy-600">Price</dt><dd>On request, quoted for your dates</dd></div></dl><div class="mt-5 grid gap-2">${waButton(msg, 'Get a quotation on WhatsApp')}<a href="${esc(waUrl(honeymoonMsg))}" target="_blank" rel="noopener noreferrer" class="btn btn-outline" data-wa-cta>${whatsappIcon('h-5 w-5 shrink-0 text-wa')}<span>Ask for a honeymoon plan</span><span class="sr-only"> (opens WhatsApp)</span></a></div></div>`;

  const routes = d.routes
    .map(
      (r) =>
        `<article class="card flex flex-col p-5"><h3 class="text-lg font-bold">${esc(r.title)}</h3><p class="mt-1.5 flex items-start gap-2 text-sm text-navy-700">${icon('pin', 'mt-0.5 h-4 w-4 shrink-0 text-teal-700')}<span>${esc(r.stops)}</span></p><div class="mt-auto pt-4">${waButton(
          ctaMessage(`I am interested in the "${r.title}" route in ${d.name} (${r.stops}). Please share details and a quotation.`),
          'Ask about this route',
          { size: 'sm' },
        )}</div></article>`,
    )
    .join('');

  const intlBlock =
    d.kind === 'international'
      ? section({
          tone: 'sand',
          body:
            sectionHead({ eyebrow: 'Before you go', title: `Visa and money for ${d.name}` }) +
            `<div class="mt-6 grid gap-5 md:grid-cols-2"><div class="card p-5 sm:p-6"><span class="icon-badge">${icon('visa', 'h-6 w-6')}</span><h3 class="mt-4 text-lg font-bold">Visa</h3><p class="mt-1.5 text-sm leading-relaxed text-navy-700">${esc(d.visaNote ?? '')} Approval is decided only by the issuing authority.</p><div class="mt-4">${waButton(ctaMessage(`I am planning a trip to ${d.name} and need visa assistance. Please tell me the process and documents.`), 'Check visa requirements', { size: 'sm' })}</div></div><div class="card p-5 sm:p-6"><span class="icon-badge">${icon('cash', 'h-6 w-6')}</span><h3 class="mt-4 text-lg font-bold">Currency</h3><p class="mt-1.5 text-sm leading-relaxed text-navy-700">Local currency: ${esc(d.currency ?? '')}. Rates change through the day, so we share the current rate when you ask.</p><div class="mt-4">${waButton(ctaMessage(`I am travelling to ${d.name} and would like today's rate for foreign currency.`), 'Ask for today\'s rate', { size: 'sm' })}</div></div></div>`,
        })
      : '';

  const body =
    pageHero({
      crumbs,
      title: `${d.name} tour packages`,
      lead: d.summary,
      badges: [d.place, `Best: ${monthRange(d.bestMonths, d.yearRound)}`, d.suggestedStay],
      actions: `${waButton(msg, 'Enquire on WhatsApp', { size: 'lg' })}${callButtons('ghost')}`,
      media: `<div class="aspect-[4/3]">${destImg(d.slug, `${d.name}, ${d.place}`, { priority: true, sizes: '(min-width: 1024px) 40vw, 100vw' })}</div>`,
    }) +
    section({
      body: `<div class="grid gap-8 lg:grid-cols-[1.6fr_1fr]"><div>${sectionHead({ eyebrow: 'Highlights', title: `What to see and do in ${d.name}` })}<div class="mt-6 grid gap-6 sm:grid-cols-2"><div><h3 class="font-bold">Highlights</h3>${checkList(d.highlights, 'mt-3 text-sm text-navy-800')}</div><div><h3 class="font-bold">Experiences</h3>${checkList(d.experiences, 'mt-3 text-sm text-navy-800')}</div></div><h3 class="mt-8 font-bold">Best months to visit</h3><div class="mt-3">${monthStrip(d)}</div><p class="mt-2 text-xs text-navy-600">Highlighted months are generally the most comfortable. ${esc(d.bestTime)}.</p></div><aside>${facts}</aside></div>`,
    }) +
    section({
      tone: 'sand',
      body: `${sectionHead({ eyebrow: 'Route ideas', title: 'Sample ways to plan it', lead: 'These are starting points. We adjust nights, hotels and pace to suit you.' })}<div class="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-${Math.min(Math.max(d.routes.length, 1), 3)}">${routes}</div><div class="mt-6">${callout('Good to know', `<ul class="list-disc space-y-1 pl-5">${d.notes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>`)}</div>`,
    }) +
    intlBlock +
    widgetSection(`d-${d.slug}`, { tone: 'white', title: `Plan your ${d.name} trip`, lead: 'Add your dates and travellers. Your details open in WhatsApp for you to send.', preselect: d.name }) +
    section({
      tone: 'sand',
      body: `${sectionHead({ eyebrow: 'More ideas', title: d.kind === 'domestic' ? 'Other places in India' : 'Other places abroad' })}<div class="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">${related.map(destCard).join('')}</div>`,
    }) +
    closingCta(msg, `Ready to plan ${d.name}?`, 'Send your dates and budget on WhatsApp and we will reply with options.');

  return {
    path,
    title,
    description: d.metaDescription,
    body,
    active: d.kind === 'domestic' ? 'domestic' : 'international',
    waMessage: msg,
    schema: [breadcrumbSchema(crumbs), webPageSchema(title, d.metaDescription, path), destinationSchema(d, path)],
  };
}

// ───────────── Customised holidays and honeymoon ─────────────

export function customPage(): PageMeta {
  const path = '/custom-holidays-honeymoon-packages/';
  const title = 'Custom Holidays & Honeymoon Packages | Prime Enterprises';
  const description =
    'Customised holiday and honeymoon packages built around your dates, budget and interests. Maldives, Bali, Kashmir, Andaman and more. Plan it with us on WhatsApp.';
  const msg = ctaMessage('I would like a customised holiday or honeymoon package. Please help me plan.');
  const occasions = [
    { t: 'Honeymoon', d: 'Quiet beaches, private-pool villas or snowy hills. We choose stays and pace for two.', i: 'heart', m: 'I would like a honeymoon package. Please help me plan.' },
    { t: 'Anniversary', d: 'A short escape or a bigger milestone trip, with special touches arranged where the hotel allows.', i: 'sparkle', m: 'I would like an anniversary trip. Please help me plan.' },
    { t: 'Family holiday', d: 'Kid-friendly stays, relaxed schedules and activities the whole family enjoys.', i: 'users', m: 'I would like a family holiday package. Please help me plan.' },
    { t: 'Friends and groups', d: 'Group-friendly stays, shared transfers and activities for everyone.', i: 'compass', m: 'I would like a package for a group of friends. Please help me plan.' },
    { t: 'Senior citizens', d: 'Gentler pacing, fewer long drives and comfortable hotels.', i: 'sun', m: 'I would like a comfortable trip for senior citizens. Please help me plan.' },
    { t: 'Something else', d: 'Birthdays, reunions or a trip you have been dreaming of. Tell us the idea.', i: 'plane', m: 'I have a special trip in mind. Please help me plan.' },
  ];
  const honeymoon = destinations.filter((d) => d.themes.includes('honeymoon'));
  const body =
    pageHero({
      crumbs: crumbsFor({ name: 'Custom Holidays & Honeymoon', path }),
      title: 'Customised holidays and honeymoon packages',
      lead: 'Tell us who is travelling, when and what you love. We build the trip around you, from the first idea to the last transfer.',
      badges: ['Honeymoon and anniversary', 'Family and group trips', 'Built around your budget'],
      actions: `${waButton(msg, 'Plan my trip on WhatsApp', { size: 'lg' })}${callButtons('ghost')}`,
    }) +
    section({
      body:
        sectionHead({ eyebrow: 'Occasions', title: 'What are you planning?' }) +
        `<div class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">${occasions
          .map(
            (o) =>
              `<article class="card flex flex-col p-5 sm:p-6"><span class="icon-badge">${icon(o.i, 'h-6 w-6')}</span><h3 class="mt-4 font-display text-xl font-bold">${esc(o.t)}</h3><p class="mt-2 text-sm leading-relaxed text-navy-700">${esc(o.d)}</p><div class="mt-auto pt-5">${waButton(ctaMessage(o.m), 'Plan it on WhatsApp', { size: 'sm' })}</div></article>`,
          )
          .join('')}</div>`,
    }) +
    section({
      tone: 'sand',
      id: 'honeymoon',
      body: `${sectionHead({ eyebrow: 'Honeymoon ideas', title: 'Popular honeymoon destinations', lead: 'A few places couples often ask about. We can plan any of them as a honeymoon, or suggest something different.' })}<div class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">${honeymoon.map(destCard).join('')}</div>`,
    }) +
    section({
      id: 'plan',
      body: `<div class="grid items-start gap-8 lg:grid-cols-[1fr_1.4fr]"><div>${sectionHead({ eyebrow: 'Tell us your idea', title: 'Send us your trip brief', lead: 'The more you share, the better the plan. Your brief opens in WhatsApp for you to send. We do not take bookings through this form.' })}<ul class="mt-5 space-y-2 text-sm text-navy-800">${['Type of trip and who is travelling', 'Approximate dates and number of nights', 'Budget range', 'Places or experiences you like'].map((x) => `<li class="flex gap-2.5">${icon('check', 'mt-0.5 h-5 w-5 shrink-0 text-teal-700')}<span>${esc(x)}</span></li>`).join('')}</ul></div><div class="card p-5 sm:p-7">${customHolidayForm('custom')}</div></div>`,
    }) +
    section({
      tone: 'sand',
      body:
        sectionHead({ eyebrow: 'How we plan', title: 'A plan you can change until you are happy' }) +
        `<div class="mt-8">${steps([
          { title: 'You share the idea', text: 'Occasion, dates, budget and anything you must have.' },
          { title: 'We draft options', text: 'One or two routes with stays and activities, quoted for your dates.' },
          { title: 'You tweak it', text: 'Swap hotels, add nights, remove activities. As many changes as needed.' },
          { title: 'You confirm in writing', text: 'We lock the plan only after you approve the final itinerary and terms.' },
        ])}</div>`,
    }) +
    callbackSection('custom-cb', 'Customised holiday or honeymoon', 'white') +
    faqSection(faqsFor('tours', 'enquiries').slice(0, 6), { tone: 'sand' }) +
    closingCta(msg, 'Let us plan something special', 'Share your idea on WhatsApp and we will come back with options.');
  return {
    path,
    title,
    description,
    body,
    active: 'custom',
    waMessage: msg,
    schema: [
      breadcrumbSchema(crumbsFor({ name: 'Custom Holidays & Honeymoon', path })),
      webPageSchema('Customised Holidays & Honeymoon Packages', description, path),
      faqSchema(faqsFor('tours', 'enquiries').slice(0, 6)),
    ],
  };
}

