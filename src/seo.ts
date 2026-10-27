import { site } from './config';
import type { Destination } from './data/destinations';
import type { Faq } from './data/faqs';

export const abs = (path: string) => `${site.url}${path}`;

const sameAs = () =>
  [site.googleBusinessUrl, site.social.instagram, site.social.facebook, site.social.youtube].filter(Boolean);

/** Business entity. Only verified details are included; nothing is invented. */
export function businessSchema() {
  const s: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    '@id': abs('/#business'),
    name: site.name,
    url: abs('/'),
    logo: abs('/assets/logo.png'),
    image: abs('/assets/og-default.png'),
    description:
      'Tour packages, honeymoon and custom holidays, foreign currency exchange, Western Union money transfer assistance and visa support.',
    telephone: site.phone.tel,
    areaServed: { '@type': 'Country', name: 'India' },
    hasMap: site.googleBusinessUrl,
    sameAs: sameAs(),
    contactPoint: [
      { '@type': 'ContactPoint', telephone: site.phone.tel, contactType: 'customer service', areaServed: 'IN' },
      { '@type': 'ContactPoint', telephone: site.altPhone.tel, contactType: 'customer service', areaServed: 'IN' },
    ],
  };
  if (site.email) s.email = site.email;
  if (site.address) s.address = { '@type': 'PostalAddress', streetAddress: site.address, addressCountry: 'IN' };
  return s;
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': abs('/#website'),
    url: abs('/'),
    name: site.name,
    publisher: { '@id': abs('/#business') },
    inLanguage: 'en-IN',
  };
}

export type Crumb = { name: string; path: string };

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: abs(c.path) })),
  };
}

export function faqSchema(items: Faq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}

export function serviceSchema(name: string, description: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: abs(path),
    provider: { '@id': abs('/#business') },
    areaServed: { '@type': 'Country', name: 'India' },
  };
}

export function destinationSchema(d: Destination, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: d.name,
    description: d.summary,
    url: abs(path),
    touristType: d.themes,
  };
}

export function itemListSchema(name: string, items: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    itemListElement: items.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, url: abs(c.path) })),
  };
}

export function webPageSchema(name: string, description: string, path: string, type: 'WebPage' | 'AboutPage' | 'ContactPage' | 'CollectionPage' = 'WebPage') {
  return {
    '@context': 'https://schema.org',
    '@type': type,
    name,
    description,
    url: abs(path),
    isPartOf: { '@id': abs('/#website') },
    about: { '@id': abs('/#business') },
  };
}
