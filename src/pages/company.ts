import { site } from '../config';
import { esc } from '../lib/html';
import { icon } from '../lib/icons';
import { ctaMessage } from '../lib/whatsapp';
import { section, sectionHead, waButton, callLink, callButtons, pageHero, crumbsFor, faqList, mapSection, type PageMeta } from '../components';
import { breadcrumbSchema, webPageSchema, faqSchema } from '../seo';
import { faqGroups, allFaqs } from '../data/faqs';
import { services } from '../data/services';
import { destinations } from '../data/destinations';
import { contactForm } from '../forms';
import { callbackSection, closingCta, gbpBlock, GENERAL_MESSAGE } from './common';

// ───────────── About ─────────────

export function aboutPage(): PageMeta {
  const path = '/about-us/';
  const title = 'About Prime Enterprises | Travel, Forex & Visa';
  const description =
    'Prime Enterprises helps you with tour packages, honeymoon and custom holidays, foreign currency, Western Union transfer assistance and visa guidance.';
  const msg = ctaMessage('I would like to know more about Prime Enterprises and its services.');
  const principles = [
    { i: 'compass', t: 'Built around you', d: 'We start from your dates, budget and interests, not from a fixed brochure.' },
    { i: 'shield', t: 'Honest by default', d: 'No promised visa approvals, no stale prices or rates. We tell you what is confirmed and what is not.' },
    { i: 'clock', t: 'Clear next steps', d: 'You always know what we need from you and what happens next.' },
    { i: 'phone', t: 'Easy to reach', d: 'WhatsApp or call, whichever suits you. Two phone numbers are listed on every page.' },
  ];
  const body =
    pageHero({
      crumbs: crumbsFor({ name: 'About Us', path }),
      title: 'About Prime Enterprises',
      lead: 'One team for your holiday, your foreign currency, your money transfers and your visa paperwork.',
      actions: `${waButton(msg, 'Chat with us', { size: 'lg' })}${callButtons('ghost')}`,
    }) +
    section({
      body: `<div class="grid gap-10 lg:grid-cols-[1.3fr_1fr]"><div class="prose-lite max-w-none text-navy-800">${sectionHead({ eyebrow: 'Who we are', title: 'Travel and money services, handled together' })}<p class="mt-5 text-base leading-relaxed">Prime Enterprises helps travellers and families plan trips and take care of the practical side that comes with them. That includes domestic and international tour packages, customised and honeymoon holidays, foreign currency exchange, Western Union money transfer assistance and visa guidance.</p><p class="text-base leading-relaxed">Instead of juggling a travel agent, a currency dealer and a visa consultant, you can talk to one team. Send us your plan on WhatsApp or call, and we will tell you clearly what is possible, what it needs and what the next step is.</p><p class="text-base leading-relaxed">We do not publish prices, live exchange rates or visa timelines on this website, because they change often and an out-of-date number helps no one. We share current details when you ask.</p></div><div class="card self-start p-6"><h2 class="font-display text-xl font-bold">What we offer</h2><ul class="mt-4 space-y-3 text-sm">${services
        .map((s) => `<li class="flex gap-3"><span class="icon-badge !h-10 !w-10 shrink-0 !rounded-xl">${icon(s.icon, 'h-5 w-5')}</span><span><a href="${s.href}" class="font-semibold text-navy-900 hover:text-teal-800">${esc(s.title)}</a></span></li>`)
        .join('')}</ul></div></div>`,
    }) +
    section({
      tone: 'sand',
      body:
        sectionHead({ eyebrow: 'How we work', title: 'Principles we stick to' }) +
        `<div class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">${principles
          .map((x) => `<div class="card p-5"><span class="icon-badge">${icon(x.i, 'h-6 w-6')}</span><h3 class="mt-4 text-lg font-bold">${esc(x.t)}</h3><p class="mt-1.5 text-sm leading-relaxed text-navy-700">${esc(x.d)}</p></div>`)
          .join('')}</div>`,
    }) +
    section({
      body: `<div class="grid gap-5 sm:grid-cols-3 text-center"><div class="card p-6"><p class="font-display text-4xl font-bold text-teal-700">${services.length}</p><p class="mt-1 text-sm font-semibold text-navy-800">services under one roof</p></div><div class="card p-6"><p class="font-display text-4xl font-bold text-teal-700">${destinations.length}</p><p class="mt-1 text-sm font-semibold text-navy-800">destinations to start from</p></div><div class="card p-6"><p class="font-display text-4xl font-bold text-teal-700">2</p><p class="mt-1 text-sm font-semibold text-navy-800">phone numbers, plus WhatsApp</p></div></div>${
        site.credentials.length
          ? `<div class="card mx-auto mt-8 max-w-2xl p-6"><h2 class="font-display text-xl font-bold">Registrations and licences</h2><ul class="mt-3 space-y-1.5 text-sm text-navy-800">${site.credentials.map((c) => `<li><span class="font-semibold">${esc(c.label)}:</span> ${esc(c.value)}</li>`).join('')}</ul></div>`
          : ''
      }`,
    }) +
    gbpBlock() +
    closingCta(msg, 'Let us plan it together', 'Tell us what you have in mind and we will reply with clear next steps.');
  return {
    path,
    title,
    description,
    body,
    active: 'about',
    waMessage: msg,
    schema: [breadcrumbSchema(crumbsFor({ name: 'About Us', path })), webPageSchema('About Prime Enterprises', description, path, 'AboutPage')],
  };
}

// ───────────── Contact ─────────────

export function contactPage(): PageMeta {
  const path = '/contact-us/';
  const title = 'Contact Prime Enterprises | Call or WhatsApp';
  const description =
    'Contact Prime Enterprises on +91 98992 90016 or +91 76694 26000. Call, WhatsApp, request a callback or send an enquiry about tours, forex, transfers and visas.';
  const msg = GENERAL_MESSAGE;
  const socials = (
    [
      ['Instagram', site.social.instagram],
      ['Facebook', site.social.facebook],
      ['YouTube', site.social.youtube],
    ] as [string, string][]
  ).filter(([, u]) => u);
  const card = (iconName: string, t: string, inner: string) =>
    `<div class="card p-5 sm:p-6"><span class="icon-badge">${icon(iconName, 'h-6 w-6')}</span><h2 class="mt-4 font-display text-xl font-bold">${esc(t)}</h2><div class="mt-3 space-y-3 text-sm text-navy-800">${inner}</div></div>`;
  const body =
    pageHero({
      crumbs: crumbsFor({ name: 'Contact Us', path }),
      title: 'Contact us',
      lead: 'The quickest way to reach us is WhatsApp or a phone call. You can also send an enquiry or ask for a callback below.',
      actions: `${waButton(msg, 'Chat on WhatsApp', { size: 'lg' })}${callButtons('ghost')}`,
    }) +
    section({
      body: `<div class="grid gap-5 md:grid-cols-3">${card(
        'phone',
        'Call us',
        `<p>${callLink(site.phone, 'btn btn-outline w-full', 'Call')}</p><p>${callLink(site.altPhone, 'btn btn-outline w-full', 'Call')}</p>`,
      )}${card('mail', 'WhatsApp', `<p>Message us for the fastest reply. Your enquiry details can be filled in for you.</p><p>${waButton(msg, 'Open WhatsApp', { cls: 'w-full' })}</p>`)}${card(
        'pin',
        'Visit and details',
        `${site.address ? `<p>${esc(site.address)}</p>` : '<p>Find our location, directions and reviews on Google Maps.</p>'}${site.hours ? `<p><span class="font-semibold">Hours:</span> ${esc(site.hours)}</p>` : ''}${
          site.email ? `<p><a class="font-semibold text-teal-800 underline underline-offset-4" href="mailto:${esc(site.email)}">${esc(site.email)}</a></p>` : ''
        }<p><a href="${esc(site.googleBusinessUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-outline w-full">${icon('pin', 'h-4 w-4')}<span>Google Business Profile</span><span class="sr-only"> (opens in a new tab)</span></a></p>${
          socials.length ? `<p class="flex flex-wrap gap-2">${socials.map(([n, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener noreferrer" class="chip">${n}<span class="sr-only"> (opens in a new tab)</span></a>`).join('')}</p>` : ''
        }`,
      )}</div>`,
    }) +
    section({
      tone: 'sand',
      id: 'message',
      body: `<div class="grid items-start gap-8 lg:grid-cols-[1fr_1.4fr]"><div>${sectionHead({
        eyebrow: 'Send an enquiry',
        title: 'Write to us',
        lead: 'Fill in the form and your message opens in WhatsApp, ready to send. We reply as soon as we can.',
      })}<p class="mt-5 text-sm text-navy-700">${icon('info', 'mr-1.5 inline h-4 w-4 align-[-3px] text-teal-700')}This form does not store or email your message. It prepares a WhatsApp message for you to send.</p></div><div class="card p-5 sm:p-7">${contactForm('contact')}</div></div>`,
    }) +
    section({ body: `${sectionHead({ eyebrow: 'Find us', title: 'Location' })}<div class="mt-6">${mapSection()}</div>` }) +
    callbackSection('contact-cb', undefined, 'sand');
  return {
    path,
    title,
    description,
    body,
    active: 'contact',
    waMessage: msg,
    schema: [breadcrumbSchema(crumbsFor({ name: 'Contact Us', path })), webPageSchema('Contact Prime Enterprises', description, path, 'ContactPage')],
  };
}

// ───────────── FAQs ─────────────

export function faqsPage(): PageMeta {
  const path = '/faqs/';
  const title = 'FAQs | Tours, Forex, Transfers & Visa';
  const description =
    'Answers to common questions about tour packages, forex, Western Union money transfer assistance and visa support at Prime Enterprises.';
  const msg = ctaMessage('I have a question. Please help me.');
  const topicMsg: Record<string, string> = {
    enquiries: 'I have a question about enquiries and bookings.',
    tours: 'I have a question about tour packages.',
    forex: 'I have a question about foreign currency exchange.',
    transfer: 'I have a question about international money transfer.',
    visa: 'I have a question about visa assistance.',
  };
  const body =
    pageHero({
      crumbs: crumbsFor({ name: 'FAQs', path }),
      title: 'Frequently asked questions',
      lead: 'Quick answers about tours, forex, money transfers and visas. Cannot find yours? Ask us on WhatsApp.',
      actions: `${waButton(msg, 'Ask on WhatsApp', { size: 'lg' })}${callButtons('ghost')}`,
    }) +
    section({
      body: `<div class="mx-auto max-w-3xl"><nav aria-label="FAQ topics" class="flex flex-wrap gap-2">${faqGroups.map((g) => `<a class="filter-btn" href="#${g.id}">${esc(g.title)}</a>`).join('')}</nav>${faqGroups
        .map(
          (g) =>
            `<section id="${g.id}" class="mt-10" aria-labelledby="h-${g.id}"><h2 id="h-${g.id}" class="font-display text-2xl font-bold">${esc(g.title)}</h2><div class="mt-4">${faqList(g.items)}</div><p class="mt-4">${waButton(ctaMessage(topicMsg[g.id] ?? 'I have a question.'), 'Still have a question? Ask on WhatsApp', { size: 'sm' })}</p></section>`,
        )
        .join('')}</div>`,
    }) +
    callbackSection('faq-cb', undefined, 'sand') +
    closingCta(msg, 'Still need help?', 'Message us your question and we will reply as soon as we can.');
  return {
    path,
    title,
    description,
    body,
    active: 'faqs',
    waMessage: msg,
    schema: [breadcrumbSchema(crumbsFor({ name: 'FAQs', path })), webPageSchema('FAQs', description, path), faqSchema(allFaqs)],
  };
}

// ───────────── Legal ─────────────

function legalPage(path: string, name: string, title: string, description: string, inner: string): PageMeta {
  const body =
    `<section class="hero-bg relative overflow-hidden text-white"><div class="container-x relative py-12 sm:py-14"><nav aria-label="Breadcrumb" class="mb-4 text-sm text-navy-100"><a href="/" class="hover:underline">Home</a> <span aria-hidden="true" class="mx-1 opacity-60">/</span> <span class="font-semibold text-white">${esc(name)}</span></nav><h1 class="font-display text-4xl font-bold">${esc(name)}</h1><p class="mt-2 text-sm text-navy-100">Last updated: ${esc(site.buildDate)}</p></div></section>` +
    section({ body: `<div class="prose-lite mx-auto max-w-3xl text-base leading-relaxed text-navy-800">${inner}</div>` }) +
    closingCta(GENERAL_MESSAGE, 'Questions about this page?', 'Message us on WhatsApp or call.');
  return {
    path,
    title,
    description,
    body,
    waMessage: GENERAL_MESSAGE,
    schema: [breadcrumbSchema(crumbsFor({ name, path })), webPageSchema(name, description, path)],
  };
}

export function privacyPage(): PageMeta {
  const inner = `<p>This policy explains how the website primeyatra.co.in, operated by ${esc(site.name)}, handles information.</p>
<h2>What this website does with your details</h2>
<p>The enquiry, callback and contact forms on this website do not send your details to our servers. When you press the button, your browser builds a WhatsApp message from what you typed and opens WhatsApp so you can send it. We receive your details only if you press Send in WhatsApp.</p>
<h2>What we receive when you message us</h2>
<p>If you message or call us, we see your phone number and the details you share. We use them only to reply to you and to help with your request. We do not sell your details.</p>
<h2>Third-party services</h2>
<ul><li><strong>WhatsApp:</strong> once you send a message, it is handled under WhatsApp's own terms and privacy policy.</li><li><strong>Google Fonts:</strong> this website loads fonts from Google, which may receive your IP address and browser details when the page loads.</li><li><strong>Google Maps:</strong> links to our Google Business Profile open on Google's website, which has its own policy.</li></ul>
<h2>Cookies and analytics</h2>
<p>This website does not set cookies of its own and does not currently use analytics or advertising trackers. If that changes, this page will be updated.</p>
<h2>Sensitive documents</h2>
<p>Please do not post passport numbers, bank details, card numbers or OTPs in the website forms. If we need documents for a visa, forex or transfer request, we will tell you how to share them securely.</p>
<h2>Your choices</h2>
<p>You can ask us to stop contacting you or to delete the details you shared with us in a chat, by messaging us on WhatsApp or calling <a href="tel:${site.phone.tel}">${esc(site.phone.display)}</a>.</p>
<h2>Changes</h2>
<p>We may update this policy from time to time. The date at the top shows when it was last changed.</p>`;
  return legalPage('/privacy-policy/', 'Privacy Policy', 'Privacy Policy | Prime Enterprises', 'How primeyatra.co.in and Prime Enterprises handle your information, including WhatsApp enquiries and third-party services.', inner);
}

export function termsPage(): PageMeta {
  const inner = `<p>These terms apply to your use of primeyatra.co.in, operated by ${esc(site.name)}.</p>
<h2>Information only</h2>
<p>The content on this website is general information about our services and destinations. It is not an offer, a quotation or a confirmation of any booking, rate or visa outcome.</p>
<h2>Enquiries and bookings</h2>
<p>The forms on this website prepare a WhatsApp message. Nothing is booked, reserved or confirmed until we reply and you agree to the itinerary, price and terms with us in writing.</p>
<h2>Prices, availability and rates</h2>
<p>Prices, hotel and flight availability and exchange rates change often. We share current figures when you ask, and they apply only for the time and conditions stated in our reply.</p>
<h2>Third-party suppliers</h2>
<p>Trips usually involve airlines, hotels, transport and activity providers. Their own terms, including payment and cancellation rules, apply. We will share the terms that apply to your itinerary before you pay.</p>
<h2>Visa services</h2>
<p>Visa decisions are made only by the embassy, consulate or immigration authority. We help with information and documents, but we do not guarantee approval, processing time or any particular outcome.</p>
<h2>Forex and money transfers</h2>
<p>Foreign currency exchange and money transfers are subject to applicable law, regulatory rules and the policies of the providers involved. You may be asked for identity and purpose documents. Western Union is a trademark of its owner.</p>
<h2>Your responsibilities</h2>
<p>Please give accurate information and genuine documents, and check your passport validity, visa needs and health requirements before you travel.</p>
<h2>Limitation</h2>
<p>We take care to keep this website accurate, but we cannot promise that it is always complete or up to date. Please confirm important details with us before you rely on them.</p>
<h2>Contact</h2>
<p>For questions about these terms, message us on WhatsApp or call <a href="tel:${site.phone.tel}">${esc(site.phone.display)}</a>.</p>`;
  return legalPage('/terms-and-conditions/', 'Terms & Conditions', 'Terms & Conditions | Prime Enterprises', 'Terms for using primeyatra.co.in: enquiries are not bookings, prices and rates are confirmed on request, and visa outcomes are not guaranteed.', inner);
}

// ───────────── 404 ─────────────

export function notFoundPage(): PageMeta {
  const body = section({
    body: `<div class="mx-auto max-w-2xl py-8 text-center"><p class="eyebrow text-teal-700">Error 404</p><h1 class="section-title">We could not find that page</h1><p class="mt-3 text-navy-700">The link may be old or mistyped. Try one of these, or message us and we will help.</p><div class="mt-7 flex flex-col items-stretch justify-center gap-3 sm:flex-row"><a href="/" class="btn btn-navy">Go to home page</a>${waButton(GENERAL_MESSAGE, 'Chat on WhatsApp')}</div><ul class="mt-8 flex flex-wrap justify-center gap-2">${services.map((s) => `<li><a class="chip" href="${s.href}">${esc(s.title)}</a></li>`).join('')}</ul></div>`,
  });
  return {
    path: '/404.html',
    title: 'Page not found | Prime Enterprises',
    description: 'This page could not be found. Visit the Prime Enterprises home page or message us on WhatsApp.',
    body,
    noindex: true,
  };
}

