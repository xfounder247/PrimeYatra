import { site } from '../config';
import { esc } from '../lib/html';
import { icon } from '../lib/icons';
import { ctaMessage } from '../lib/whatsapp';
import { section, sectionHead, steps, faqList, waButton, callButtons, ctaBand } from '../components';
import { tripWidget, callbackForm } from '../forms';
import type { Faq } from '../data/faqs';

export const GENERAL_MESSAGE = ctaMessage('I would like some help planning a trip or with forex and visa.');

/** The enquiry widget in a card. uid must be unique on the page. */
export function widgetCard(uid: string, o: { title?: string; lead?: string; preselect?: string } = {}): string {
  return `<div class="widget"><h2 class="font-display text-2xl font-bold">${esc(o.title ?? 'Plan your trip')}</h2><p class="mb-4 mt-1 text-sm text-navy-700">${esc(
    o.lead ?? 'Tell us the basics. Your details open in WhatsApp for you to send.',
  )}</p>${tripWidget(uid, o.preselect)}</div>`;
}

export function widgetSection(uid: string, o: { title?: string; lead?: string; preselect?: string; tone?: 'white' | 'sand' } = {}): string {
  return section({ id: 'enquire', tone: o.tone ?? 'sand', body: widgetCard(uid, o) });
}

export function callbackSection(uid: string, topic?: string, tone: 'white' | 'sand' = 'sand'): string {
  return section({
    id: 'callback',
    tone,
    body: `<div class="grid items-start gap-8 lg:grid-cols-[1fr_1.25fr]"><div>${sectionHead({
      eyebrow: 'Callback',
      title: 'Prefer a call? Request one.',
      lead: 'Choose a day and a time of day that suits you. Your request opens in WhatsApp for you to send, and we call you back after that.',
    })}<div class="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-start">${callButtons('outline')}</div></div><div class="card p-5 sm:p-7">${callbackForm(uid, topic)}</div></div>`,
  });
}

export function faqSection(items: Faq[], o: { title?: string; tone?: 'white' | 'sand'; more?: boolean } = {}): string {
  return section({
    tone: o.tone ?? 'white',
    body: `<div class="mx-auto max-w-3xl">${sectionHead({ eyebrow: 'FAQs', title: o.title ?? 'Frequently asked questions', center: true })}<div class="mt-8">${faqList(items)}</div>${
      o.more === false ? '' : `<p class="mt-6 text-center"><a href="/faqs/" class="btn btn-outline">See all FAQs${icon('arrow', 'h-4 w-4')}</a></p>`
    }</div>`,
  });
}

export function howItWorks(tone: 'white' | 'sand' = 'white', dark = false): string {
  return section({
    tone: dark ? 'navy' : tone,
    body:
      sectionHead({ eyebrow: 'How it works', title: 'From first message to boarding pass', dark, lead: 'A simple, honest process. You stay in control at every step.' }) +
      `<div class="mt-8">${steps(
        [
          { title: 'Tell us what you need', text: 'Use the form or WhatsApp us your dates, travellers and budget. Rough ideas are fine.' },
          { title: 'We shape the plan', text: 'We reply with options and a quotation for your dates. Prices are shared on request because they change often.' },
          { title: 'You review and confirm', text: 'Nothing is booked until you agree to the itinerary and terms with us in writing.' },
          { title: 'We help you get ready', text: 'Visa guidance, forex and travel documents are sorted before you fly.' },
        ],
        dark,
      )}</div>`,
  });
}

export function whyUs(): string {
  const items = [
    { i: 'globe', t: 'One team for the whole trip', d: 'Tours, foreign currency, money transfer assistance and visa guidance, all in one place.' },
    { i: 'compass', t: 'Built around you', d: 'No fixed brochure. We shape the route, hotels and pace around your dates and budget.' },
    { i: 'shield', t: 'Straight answers', d: 'We do not promise visa approvals or publish prices and rates that go out of date.' },
    { i: 'phone', t: 'WhatsApp first', d: 'Send your details once. We reply with options, and you can also just call us.' },
  ];
  return section({
    tone: 'sand',
    body:
      sectionHead({ eyebrow: 'Why Prime Enterprises', title: 'Travel help that stays simple' }) +
      `<div class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">${items
        .map((x) => `<div class="card p-5"><span class="icon-badge">${icon(x.i, 'h-6 w-6')}</span><h3 class="mt-4 text-lg font-bold">${esc(x.t)}</h3><p class="mt-1.5 text-sm leading-relaxed text-navy-700">${esc(x.d)}</p></div>`)
        .join('')}</div>`,
  });
}

/** Link to the verified Google Business Profile. No invented ratings or reviews. */
export function gbpBlock(): string {
  return section({
    body: `<div class="card mx-auto max-w-4xl p-6 sm:p-9"><div class="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div><p class="eyebrow text-teal-700">Find us on Google</p><h2 class="font-display text-2xl font-bold sm:text-3xl">See us on Google Maps</h2><p class="mt-2 max-w-xl text-sm leading-relaxed text-navy-700">Our verified Google Business Profile has the map, directions and customer reviews.</p></div><a href="${esc(site.googleBusinessUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-navy shrink-0">${icon('pin', 'h-5 w-5')}<span>Open Google Business Profile</span><span class="sr-only"> (opens in a new tab)</span></a></div></div>`,
  });
}

export function callout(title: string, html: string, tone: 'info' | 'warn' = 'info'): string {
  const cls = tone === 'warn' ? 'border-amber-300 bg-amber-50' : 'border-teal-200 bg-teal-50';
  return `<div class="rounded-2xl border ${cls} p-5 text-navy-900" role="note"><p class="flex items-center gap-2 font-bold">${icon(tone === 'warn' ? 'shield' : 'info', 'h-5 w-5 shrink-0 text-navy-900')}<span>${esc(title)}</span></p><div class="mt-2 text-sm leading-relaxed text-navy-800">${html}</div></div>`;
}

/** Closing WhatsApp + call band for service pages. */
export function closingCta(message: string, title = 'Ready to talk?', text = 'Message us on WhatsApp or call. We reply with clear next steps.', label = 'Chat on WhatsApp'): string {
  return ctaBand({ title, text, message, label });
}

export { waButton };
