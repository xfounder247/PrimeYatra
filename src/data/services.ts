export type Service = {
  id: 'domestic' | 'international' | 'custom' | 'forex' | 'transfer' | 'visa';
  title: string;
  short: string;
  href: string;
  icon: string;
  /** Sentence after "Hello Prime Enterprises," in the prefilled WhatsApp message. */
  waTopic: string;
  waLabel: string;
  points: string[];
};

export const services: Service[] = [
  {
    id: 'domestic',
    title: 'Domestic Tour Packages',
    short: 'Kashmir, Manali, Goa, Kerala, Rajasthan, Uttarakhand and Andaman, planned around your dates.',
    href: '/domestic-tour-packages/',
    icon: 'mountain',
    waTopic: 'I am interested in a domestic tour package in India. Please share options and a quotation.',
    waLabel: 'Enquire on WhatsApp',
    points: ['Hotels, transfers and sightseeing', 'Family, friends and couples', 'Flexible dates and budgets'],
  },
  {
    id: 'international',
    title: 'International Tour Packages',
    short: 'Dubai, Thailand, Bali, Singapore, Maldives, Vietnam and Europe, with visa and forex support alongside.',
    href: '/international-tour-packages/',
    icon: 'globe',
    waTopic: 'I am interested in an international tour package. Please share options and a quotation.',
    waLabel: 'Enquire on WhatsApp',
    points: ['Flights, stays and activities', 'Visa and forex guidance', 'First-time traveller friendly'],
  },
  {
    id: 'custom',
    title: 'Customised Holidays & Honeymoon',
    short: 'A trip built around you: honeymoons, anniversaries, family reunions and group holidays.',
    href: '/custom-holidays-honeymoon-packages/',
    icon: 'heart',
    waTopic: 'I would like a customised holiday or honeymoon package. Please help me plan.',
    waLabel: 'Plan my trip on WhatsApp',
    points: ['Honeymoon and anniversary trips', 'Family and group holidays', 'Itinerary built around your interests'],
  },
  {
    id: 'forex',
    title: 'Forex & Currency Exchange',
    short: 'Foreign currency for your trip, with rules and documents explained before you proceed.',
    href: '/forex-currency-exchange/',
    icon: 'cash',
    waTopic: 'I would like to know today\'s rate and the process for foreign currency exchange.',
    waLabel: 'Ask for today\'s rate',
    points: ['Buy or sell foreign currency', 'Rates quoted on request', 'Documents explained upfront'],
  },
  {
    id: 'transfer',
    title: 'International Money Transfer',
    short: 'Assistance with Western Union money transfers for family, study and travel needs.',
    href: '/international-money-transfer/',
    icon: 'send',
    waTopic: 'I need help with an international money transfer (Western Union).',
    waLabel: 'Get transfer help',
    points: ['Western Union transfer assistance', 'Sending and receiving guidance', 'Clear steps and required documents'],
  },
  {
    id: 'visa',
    title: 'Visa Assistance',
    short: 'Documentation checks, form filling and appointment support for popular destinations.',
    href: '/visa-assistance/',
    icon: 'visa',
    waTopic: 'I need visa assistance. Please tell me the process and documents required.',
    waLabel: 'Check visa requirements',
    points: ['Document checklist and review', 'Application and appointment support', 'Honest guidance, no approval promises'],
  },
];

export function getService(id: Service['id']): Service {
  const s = services.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown service: ${id}`);
  return s;
}
