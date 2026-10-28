import { esc } from '../lib/html';
import { icon } from '../lib/icons';
import { ctaMessage } from '../lib/whatsapp';
import { section, sectionHead, waButton, callButtons, pageHero, crumbsFor, checkList, steps, type PageMeta } from '../components';
import { breadcrumbSchema, webPageSchema, serviceSchema, faqSchema } from '../seo';
import { international } from '../data/destinations';
import { faqsFor } from '../data/faqs';
import { forexForm, transferForm, visaForm, VISA_COUNTRIES } from '../forms';
import { faqSection, callbackSection, callout, closingCta } from './common';

const TRADEMARK = 'Western Union is a trademark of its owner. It is named here only to describe the transfer service we assist with.';

function formSection(id: string, eyebrow: string, title: string, lead: string, form: string, tone: 'white' | 'sand' = 'sand'): string {
  return section({
    id,
    tone,
    body: `<div class="grid items-start gap-8 lg:grid-cols-[1fr_1.4fr]"><div>${sectionHead({ eyebrow, title, lead })}</div><div class="card p-5 sm:p-7">${form}</div></div>`,
  });
}

function infoCards(items: { i: string; t: string; d: string; m: string; l: string }[]): string {
  return `<div class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-${Math.min(items.length, 3)}">${items
    .map(
      (x) =>
        `<article class="card flex flex-col p-5 sm:p-6"><span class="icon-badge">${icon(x.i, 'h-6 w-6')}</span><h3 class="mt-4 font-display text-xl font-bold">${esc(x.t)}</h3><p class="mt-2 text-sm leading-relaxed text-navy-700">${esc(x.d)}</p><div class="mt-auto pt-5">${waButton(x.m, x.l, { size: 'sm' })}</div></article>`,
    )
    .join('')}</div>`;
}

// ───────────── Forex ─────────────

export function forexPage(): PageMeta {
  const path = '/forex-currency-exchange/';
  const title = 'Forex & Currency Exchange | Prime Enterprises';
  const description =
    'Foreign currency exchange for travel: ask for today\'s rate, learn which documents are needed and get help on WhatsApp. Prime Enterprises forex assistance.';
  const msg = ctaMessage('I would like to know today\'s rate and the process for foreign currency exchange.');
  const faqs = faqsFor('forex');
  const body =
    pageHero({
      crumbs: crumbsFor({ name: 'Forex & Currency Exchange', path }),
      title: 'Forex and currency exchange',
      lead: 'Foreign currency for your trip, explained clearly. Message us the currency and amount and we will share today\'s rate and what you need to bring.',
      badges: ['Buy or sell foreign currency', 'Rates shared on request', 'Documents explained upfront'],
      actions: `${waButton(msg, 'Ask for today\'s rate', { size: 'lg' })}${callButtons('ghost')}`,
    }) +
    section({
      body:
        sectionHead({ eyebrow: 'What we help with', title: 'Currency for travel, simply' }) +
        infoCards([
          { i: 'cash', t: 'Buy foreign currency', d: 'For holidays, business trips, study or medical travel. Tell us the currency, amount and travel date.', m: ctaMessage('I want to buy foreign currency. Please share today\'s rate and the documents needed.'), l: 'Ask to buy currency' },
          { i: 'send', t: 'Sell leftover currency', d: 'Back home with currency you did not spend? Ask us whether and how it can be exchanged.', m: ctaMessage('I want to sell leftover foreign currency. Please tell me the process and today\'s rate.'), l: 'Ask to sell currency' },
          { i: 'compass', t: 'Which currency do I need?', d: 'Not sure what to carry for your destination? We will suggest a sensible mix of cash and card.', m: ctaMessage('Please advise which currency I should carry for my trip.'), l: 'Ask for advice' },
        ]),
    }) +
    section({
      tone: 'sand',
      body:
        sectionHead({ eyebrow: 'By destination', title: 'Local currency for popular trips', lead: 'We do not publish rates because they change through the day. Tap the button to ask for the current rate.' }) +
        `<div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">${international
          .map(
            (d) =>
              `<article class="card flex flex-col p-5"><h3 class="text-lg font-bold">${esc(d.name)}</h3><p class="mt-1 text-sm text-navy-700">${esc(d.currency ?? '')}</p><div class="mt-auto pt-4">${waButton(ctaMessage(`I am travelling to ${d.name} and would like today's rate for ${d.currency ?? 'the local currency'}.`), 'Ask for today\'s rate', { size: 'sm' })}</div></article>`,
          )
          .join('')}</div>`,
    }) +
    section({
      body:
        sectionHead({ eyebrow: 'How it works', title: 'Four simple steps' }) +
        `<div class="mt-8">${steps([
          { title: 'Message us', text: 'Share the currency, approximate amount and your travel date.' },
          { title: 'We share the rate', text: 'We reply with the current rate and anything extra you need to know.' },
          { title: 'Check the documents', text: 'We tell you which documents to bring for your purpose of travel.' },
          { title: 'Confirm and complete', text: 'You confirm, and we explain how and when the exchange will be completed.' },
        ])}</div>`,
    }) +
    section({
      tone: 'sand',
      body: `<div class="grid gap-8 lg:grid-cols-2"><div>${sectionHead({ eyebrow: 'Documents', title: 'What you will usually need' })}${checkList(
        ['Valid passport', 'Photo ID proof', 'PAN details', 'Travel proof such as a visa or flight ticket'],
        'mt-5 text-navy-800',
      )}<p class="mt-4 text-sm text-navy-700">Exact requirements depend on the purpose of travel and the rules in force at the time. We confirm them when you enquire.</p></div><div>${callout(
        'Good to know',
        `<ul class="list-disc space-y-1.5 pl-5"><li>Carry a mix of cash and a travel-ready card rather than all cash.</li><li>Keep your exchange receipts until your trip is over.</li><li>Rules on carrying cash differ by country. Check before you fly.</li><li>Use only authorised, transparent channels for exchanging currency.</li></ul>`,
      )}</div></div>`,
    }) +
    formSection('rate-form', 'Ask for a rate', 'Get today\'s rate on WhatsApp', 'Fill in the basics. Your details open in WhatsApp for you to send, and we reply with the current rate. No exchange is made through this form.', forexForm('forex'), 'white') +
    faqSection(faqs, { tone: 'sand', title: 'Forex questions answered' }) +
    callbackSection('forex-cb', 'Forex or currency exchange', 'white') +
    closingCta(msg, 'Need foreign currency?', 'Message us the currency and amount. We reply with the current rate.', 'Ask for today\'s rate');
  return {
    path,
    title,
    description,
    body,
    active: 'forex',
    waMessage: msg,
    schema: [
      breadcrumbSchema(crumbsFor({ name: 'Forex & Currency Exchange', path })),
      webPageSchema('Forex & Currency Exchange', description, path),
      serviceSchema('Foreign currency exchange assistance', description, path),
      faqSchema(faqs),
    ],
  };
}

// ───────────── International money transfer ─────────────

export function transferPage(): PageMeta {
  const path = '/international-money-transfer/';
  const title = 'International Money Transfer | Prime Enterprises';
  const description =
    'Assistance with Western Union international money transfers: sending money abroad or receiving money in India. Clear steps and documents. Ask on WhatsApp.';
  const msg = ctaMessage('I need help with an international money transfer (Western Union).');
  const faqs = faqsFor('transfer');
  const body =
    pageHero({
      crumbs: crumbsFor({ name: 'International Money Transfer', path }),
      title: 'International money transfer assistance',
      lead: 'Need to send money abroad or receive money in India? We help you with Western Union transfers and explain the steps and documents before you start.',
      badges: ['Send or receive', 'Clear steps and documents', 'Scam-safety guidance'],
      actions: `${waButton(msg, 'Get transfer help', { size: 'lg' })}${callButtons('ghost')}`,
    }) +
    section({
      body:
        sectionHead({ eyebrow: 'What we help with', title: 'Money transfers, explained clearly' }) +
        infoCards([
          { i: 'send', t: 'Send money abroad', d: 'Family support, education costs, travel or medical needs. Rules such as the Liberalised Remittance Scheme may apply, and we explain what applies to you.', m: ctaMessage('I want to send money abroad. Please explain the process and documents.'), l: 'Ask about sending' },
          { i: 'cash', t: 'Receive money in India', d: 'Expecting money from abroad? We explain what ID and reference details you need to collect it.', m: ctaMessage('I am expecting to receive money from abroad. Please explain what I need.'), l: 'Ask about receiving' },
          { i: 'visa', t: 'Documents and rules', d: 'Not sure what is needed for your purpose and amount? Ask us before you go ahead.', m: ctaMessage('Please tell me which documents I need for an international money transfer.'), l: 'Ask about documents' },
        ]),
    }) +
    section({
      tone: 'sand',
      body:
        sectionHead({ eyebrow: 'How it works', title: 'Four simple steps' }) +
        `<div class="mt-8">${steps([
          { title: 'Tell us your need', text: 'Send or receive, the country, approximate amount and purpose.' },
          { title: 'We explain the process', text: 'Steps, documents and timing for your case. Fees and rates are shared on request.' },
          { title: 'You confirm the details', text: 'Check every detail with us before anything is sent.' },
          { title: 'Keep your records', text: 'Keep the receipt and reference number safe until the money is collected.' },
        ])}</div>`,
    }) +
    section({
      body: `<div class="grid gap-8 lg:grid-cols-2"><div>${sectionHead({ eyebrow: 'Typically needed', title: 'Documents and details' })}${checkList(
        ['Valid photo ID', 'Receiver or sender details as shown on their ID', 'Purpose of the transfer', 'Transfer reference number (MTCN) when receiving'],
        'mt-5 text-navy-800',
      )}<p class="mt-4 text-sm text-navy-700">Fees, exchange rates and limits depend on the amount, countries, payment method and purpose. We share current details when you ask.</p></div><div>${callout(
        'Stay safe from scams',
        `<ul class="list-disc space-y-1.5 pl-5"><li>Never send money to someone you have not met in person.</li><li>Be careful with prizes, lotteries, job fees or urgent requests for money.</li><li>Do not share your MTCN or ID with strangers.</li><li>If anything feels wrong, stop and ask us first.</li></ul>`,
        'warn',
      )}</div></div>`,
    }) +
    formSection('transfer-form', 'Start here', 'Get transfer help on WhatsApp', 'Fill in the basics. Your details open in WhatsApp for you to send. No money is sent through this form.', transferForm('transfer'), 'sand') +
    faqSection(faqs, { tone: 'white', title: 'Money transfer questions answered' }) +
    callbackSection('transfer-cb', 'International money transfer', 'sand') +
    section({ body: `<p class="mx-auto max-w-3xl text-center text-xs leading-relaxed text-navy-600">${esc(TRADEMARK)}</p>` }) +
    closingCta(msg, 'Need help with a transfer?', 'Message us before you send or collect money. We explain the steps first.', 'Get transfer help');
  return {
    path,
    title,
    description,
    body,
    active: 'transfer',
    waMessage: msg,
    schema: [
      breadcrumbSchema(crumbsFor({ name: 'International Money Transfer', path })),
      webPageSchema('International Money Transfer', description, path),
      serviceSchema('International money transfer assistance', description, path),
      faqSchema(faqs),
    ],
  };
}

// ───────────── Visa ─────────────

const VISA_NOTES: Record<string, string> = {
  'UAE (Dubai, Abu Dhabi)': 'Rules depend on your passport and the type of visa. We confirm the current process.',
  Thailand: 'Entry rules for Indian passport holders can change, so we check the latest before you book.',
  'Indonesia (Bali)': 'The entry process and fees can change. We confirm the current one.',
  Singapore: 'Requirements depend on your passport and the purpose of travel.',
  Maldives: 'Booking proof for your stay is commonly asked for. We tell you what applies.',
  Vietnam: 'We check whether you need an e-visa and the current process.',
  'Schengen (Europe)': 'Appointments, biometrics and insurance are often needed. Start early.',
  'United Kingdom': 'Applications are often made online, with a biometric appointment. We guide you.',
  'Another country': 'Tell us the country and purpose. We will say what we can help with.',
};

export function visaPage(): PageMeta {
  const path = '/visa-assistance/';
  const title = 'Visa Assistance | Prime Enterprises';
  const description =
    'Visa assistance for popular destinations: document checklists, form support and appointment guidance. Honest advice, no approval guarantees. Ask on WhatsApp.';
  const msg = ctaMessage('I need visa assistance. Please tell me the process and documents required.');
  const faqs = faqsFor('visa');
  const body =
    pageHero({
      crumbs: crumbsFor({ name: 'Visa Assistance', path }),
      title: 'Visa assistance',
      lead: 'We help you understand the process, prepare accurate documents and apply correctly for popular destinations. The decision always rests with the embassy or immigration authority.',
      badges: ['Document checklist', 'Application support', 'No approval promises'],
      actions: `${waButton(msg, 'Check visa requirements', { size: 'lg' })}${callButtons('ghost')}`,
    }) +
    section({
      body: callout(
        'Please read this first',
        'Visa approval is decided only by the issuing authority. No agent, including us, can guarantee a visa, a timeline or a particular outcome. Requirements and processing times change often, so we always confirm the current rules for your passport and purpose before you apply.',
        'warn',
      ),
      cls: '!pb-0 sm:!pb-0',
    }) +
    section({
      body:
        sectionHead({ eyebrow: 'Destinations', title: 'Where we can help', lead: 'Tap a country to ask about the current process and documents on WhatsApp.' }) +
        `<div class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">${VISA_COUNTRIES.map(
          (c) =>
            `<article class="card flex flex-col p-5"><h3 class="text-lg font-bold">${esc(c)}</h3><p class="mt-1.5 text-sm leading-relaxed text-navy-700">${esc(VISA_NOTES[c] ?? '')}</p><div class="mt-auto pt-4">${waButton(ctaMessage(`I need visa assistance for ${c}. Please tell me the process and documents required.`), 'Ask on WhatsApp', { size: 'sm' })}</div></article>`,
        ).join('')}</div>`,
    }) +
    section({
      tone: 'sand',
      body:
        sectionHead({ eyebrow: 'Process', title: 'How visa assistance works' }) +
        `<div class="mt-8">${steps([
          { title: 'Tell us your plan', text: 'Destination, purpose, dates and any earlier visa history.' },
          { title: 'We confirm the rules', text: 'The current process, fees, timeline and documents for your passport.' },
          { title: 'Prepare documents', text: 'We review your documents for gaps and help fill in forms accurately.' },
          { title: 'Apply and follow up', text: 'We guide you through submission and any appointment.' },
        ])}</div>`,
    }) +
    section({
      body: `<div class="grid gap-8 lg:grid-cols-2"><div>${sectionHead({ eyebrow: 'Typical documents', title: 'What is usually asked for' })}${checkList(
        ['Passport with enough validity and blank pages', 'Recent photographs as per the specification', 'Travel itinerary or flight bookings', 'Hotel bookings or stay details', 'Bank statements and proof of funds', 'Employment, business or study proof', 'Travel insurance where required'],
        'mt-5 text-navy-800',
      )}<p class="mt-4 text-sm text-navy-700">This is a general list. Each country asks for its own set, which we confirm for you.</p></div><div>${callout(
        'How we work',
        `<ul class="list-disc space-y-1.5 pl-5"><li>We help you present true and accurate information.</li><li>We do not use false or edited documents, and you should not either.</li><li>If a previous visa was refused, tell us. We will review it and advise honestly.</li></ul>`,
      )}</div></div>`,
    }) +
    formSection('visa-form', 'Start here', 'Check visa requirements on WhatsApp', 'Fill in the basics. Your details open in WhatsApp for you to send. No application is filed through this form.', visaForm('visa'), 'sand') +
    faqSection(faqs, { tone: 'white', title: 'Visa questions answered' }) +
    callbackSection('visa-cb', 'Visa assistance', 'sand') +
    closingCta(msg, 'Planning to travel abroad?', 'Message us your destination and dates. We confirm the current visa process.', 'Check visa requirements');
  return {
    path,
    title,
    description,
    body,
    active: 'visa',
    waMessage: msg,
    schema: [
      breadcrumbSchema(crumbsFor({ name: 'Visa Assistance', path })),
      webPageSchema('Visa Assistance', description, path),
      serviceSchema('Visa assistance and documentation support', description, path),
      faqSchema(faqs),
    ],
  };
}

