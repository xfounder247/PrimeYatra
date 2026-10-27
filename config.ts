import fs from 'node:fs';
import path from 'node:path';

type Business = {
  email?: string;
  address?: string;
  hours?: string;
  social?: { instagram?: string; facebook?: string; youtube?: string };
  credentials?: { label: string; value: string }[];
};

const root = path.resolve(import.meta.dirname, '..');
const local: Business = JSON.parse(fs.readFileSync(path.join(root, 'business.json'), 'utf8'));

/** Verified facts only. Optional fields come from business.json and stay hidden while empty. */
export const site = {
  name: 'Prime Enterprises',
  domain: 'primeyatra.co.in',
  url: 'https://primeyatra.co.in',
  tagline: 'Tours · Forex · Visa',
  locale: 'en-IN',
  phone: { display: '+91 98992 90016', tel: '+919899290016', wa: '919899290016' },
  altPhone: { display: '+91 76694 26000', tel: '+917669426000' },
  googleBusinessUrl: 'https://g.co/kgs/T5Ja58',
  email: (local.email ?? '').trim(),
  address: (local.address ?? '').trim(),
  hours: (local.hours ?? '').trim(),
  social: {
    instagram: (local.social?.instagram ?? '').trim(),
    facebook: (local.social?.facebook ?? '').trim(),
    youtube: (local.social?.youtube ?? '').trim(),
  },
  credentials: (local.credentials ?? []).filter((c) => c.label && c.value),
  buildDate: new Date().toISOString().slice(0, 10),
  year: new Date().getFullYear(),
};

/** Google Maps embed (no API key needed). Only produced once a verified address is supplied. */
export function mapsEmbedUrl(): string {
  if (!site.address) return '';
  return `https://www.google.com/maps?q=${encodeURIComponent(`${site.name} ${site.address}`)}&output=embed`;
}

export const SITE_DEFAULT_DESCRIPTION =
  'Prime Enterprises: domestic and international tour packages, honeymoon and custom holidays, foreign currency exchange, Western Union money transfer assistance and visa support. Enquire on WhatsApp.';
