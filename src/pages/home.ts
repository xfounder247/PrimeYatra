import { esc } from '../lib/html';
import { icon } from '../lib/icons';
import { ctaMessage } from '../lib/whatsapp';
import { section, sectionHead, serviceCard, destCard, waButton, callButtons, ctaBand, type PageMeta } from '../components';
import { breadcrumbSchema, webPageSchema, faqSchema, itemListSchema } from '../seo';
import { services } from '../data/services';
import { domestic, international, destinations } from '../data/destinations';
import { faqsFor } from '../data/faqs';
import { widgetCard, callbackSection, faqSection, howItWorks, whyUs, gbpBlock, GENERAL_MESSAGE } from './common';

export function homePage(): PageMeta {
  const path = '/';
  const title = 'Prime Enterprises | Tours, Forex, Money Transfer & Visa';
  const description =
    'Domestic and international tour packages, honeymoon holidays, forex, Western Union transfer assistance and visa support from Prime Enterprises. Enquire on WhatsApp.';
  const faqs = [...faqsFor('enquiries').slice(0, 3), ...faqsFor('forex').slice(0, 1), ...faqsFor('visa').slice(0, 1)];
  const honeymoon = destinations.filter((d) => d.themes.includes('honeymoon'));

  const hero = `<section class="hero-bg relative overflow-hidden text-white"><div class="container-x relative pb-28 pt-12 sm:pt-16 lg:pb-32 lg:pt-20"><div class="max-w-3xl"><p class="eyebrow text-teal-300">Tours · Forex · Visa assistance</p><h1 class="font-display text-4xl font-bold leading-tight sm:text-6xl">Your journey, planned end to end.</h1><p class="mt-5 max-w-2xl text-base leading-relaxed text-navy-50 sm:text-lg">Domestic and international holidays, honeymoon packages, foreign currency, Western Union transfer assistance and visa support, all from one team reachable on WhatsApp.</p><ul class="mt-6 flex flex-wrap gap-2">${['Domestic and international tours', 'Forex and money transfer help', 'Visa guidance', 'Reply on WhatsApp']
    .map((b) => `<li class="chip-dark">${esc(b)}</li>`)
    .join('')}</ul><div class="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">${waButton(GENERAL_MESSAGE, 'Chat on WhatsApp', { size: 'lg' })}${callButtons('ghost')}</div></div></div></section>
<div class="container-x relative z-10 -mt-20">${widgetCard('home')}</div>`;

  const body =
    hero +
    section({
      id: 'services',
      body:
        sectionHead({ eyebrow: 'What we do', title: 'Everything for your trip, in one place', lead: 'Pick a service to learn more, or message us directly. Each one opens a WhatsApp chat with your topic ready.' }) +
        `<div class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">${services.map((s) => serviceCard(s)).join('')}</div>`,
    }) +
    section({
      tone: 'sand',
      id: 'india',
      body: `<div class="flex flex-wrap items-end justify-between gap-4">${sectionHead({ eyebrow: 'Domestic', title: 'Popular destinations in India', lead: 'Hills, beaches, backwaters, forts and islands.' })}<a href="/domestic-tour-packages/" class="btn btn-outline">All domestic packages${icon('arrow', 'h-4 w-4')}</a></div><div class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">${domestic.slice(0, 4).map(destCard).join('')}</div><p class="mt-5 text-sm text-navy-700">Also: ${domestic
        .slice(4)
        .map((d) => `<a class="font-semibold text-teal-800 underline underline-offset-4" href="/destinations/${d.slug}/">${esc(d.name)}</a>`)
        .join(', ')}.</p>`,
    }) +
    section({
      id: 'abroad',
      body: `<div class="flex flex-wrap items-end justify-between gap-4">${sectionHead({ eyebrow: 'International', title: 'Popular destinations abroad', lead: 'We plan the trip and guide you on visa and forex.' })}<a href="/international-tour-packages/" class="btn btn-outline">All international packages${icon('arrow', 'h-4 w-4')}</a></div><div class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">${international.slice(0, 4).map(destCard).join('')}</div><p class="mt-5 text-sm text-navy-700">Also: ${international
        .slice(4)
        .map((d) => `<a class="font-semibold text-teal-800 underline underline-offset-4" href="/destinations/${d.slug}/">${esc(d.name)}</a>`)
        .join(', ')}.</p>`,
    }) +
    section({
      tone: 'navy',
      id: 'honeymoon',
      cls: 'dark-zone',
      body: `<div class="grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]"><div>${sectionHead({
        eyebrow: 'Honeymoon & custom holidays',
        title: 'A trip made for the two of you',
        lead: 'Quiet beaches, snowy hills or a city escape. Tell us your dates and budget and we will build the plan around you.',
        dark: true,
      })}<div class="mt-6 flex flex-col gap-3 sm:flex-row">${waButton(ctaMessage('I would like a customised holiday or honeymoon package. Please help me plan.'), 'Plan my honeymoon', { size: 'lg' })}<a href="/custom-holidays-honeymoon-packages/" class="btn btn-ghost btn-lg">See ideas${icon('arrow', 'h-4 w-4')}</a></div></div><ul class="grid grid-cols-2 gap-3">${honeymoon
        .map((d) => `<li><a href="/destinations/${d.slug}/" class="block rounded-2xl border border-white/15 bg-white/5 p-4 text-white hover:bg-white/10"><span class="font-display text-lg font-bold">${esc(d.name)}</span><span class="mt-0.5 block text-xs text-navy-100">${esc(d.tagline)}</span></a></li>`)
        .join('')}</ul></div>`,
    }) +
    whyUs() +
    howItWorks('white') +
    callbackSection('home-cb', undefined, 'sand') +
    gbpBlock() +
    faqSection(faqs, { tone: 'sand' }) +
    ctaBand({ title: 'Ready to plan your trip?', text: 'Message us your dates and budget and we will reply with options.', message: ctaMessage('I would like help planning a trip.') });

  return {
    path,
    title,
    description,
    body,
    active: 'home',
    waMessage: GENERAL_MESSAGE,
    schema: [
      breadcrumbSchema([{ name: 'Home', path }]),
      webPageSchema('Prime Enterprises', description, path),
      itemListSchema('Destinations', destinations.map((d) => ({ name: d.name, path: `/destinations/${d.slug}/` }))),
      faqSchema(faqs),
    ],
  };
}
