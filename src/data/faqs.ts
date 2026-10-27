export type Faq = { q: string; a: string };
export type FaqGroup = { id: string; title: string; items: Faq[] };

export const faqGroups: FaqGroup[] = [
  {
    id: 'enquiries',
    title: 'Enquiries & bookings',
    items: [
      {
        q: 'How do I enquire or book a trip?',
        a: 'Fill in the enquiry form on any page or tap the WhatsApp button. Your details open in WhatsApp as a ready-to-send message. Nothing is booked or confirmed until our team replies and you agree to the plan in writing.',
      },
      {
        q: 'Does submitting the form confirm my booking?',
        a: 'No. The forms on this website prepare a WhatsApp message for you to send to us. A booking is confirmed only after we share the itinerary and terms, and you confirm them with us.',
      },
      {
        q: 'Do you share prices on the website?',
        a: 'No. Travel prices change with season, hotel, flights and group size, so we quote after understanding your dates, travellers and budget. Send an enquiry and we will reply with options.',
      },
      {
        q: 'Can I change a package you suggest?',
        a: 'Yes. Every package is a starting point. You can change hotels, number of nights, activities and the route.',
      },
      {
        q: 'What are the payment and cancellation terms?',
        a: 'These depend on the airline, hotel and service provider involved in your trip. Ask us for the specific terms that apply to your itinerary before you pay anything.',
      },
      {
        q: 'How can I reach you fastest?',
        a: 'WhatsApp or call +91 98992 90016. You can also call +91 76694 26000.',
      },
    ],
  },
  {
    id: 'tours',
    title: 'Tour packages',
    items: [
      {
        q: 'Which destinations do you cover?',
        a: 'In India: Kashmir, Manali, Goa, Kerala, Rajasthan, Uttarakhand and Andaman. Abroad: Dubai, Thailand, Bali, Singapore, Maldives, Vietnam and Europe. If you want somewhere else, ask us.',
      },
      {
        q: 'Can you plan a honeymoon or anniversary trip?',
        a: 'Yes. Tell us your dates, budget and the kind of experience you want, such as a quiet beach, a hill station or a city break, and we will suggest options.',
      },
      {
        q: 'What is usually included in a package?',
        a: 'It depends on the package, but commonly hotels, transfers, sightseeing and meals as listed. We write down exactly what is and is not included before you confirm.',
      },
      {
        q: 'When is the best time to travel?',
        a: 'Each destination page lists the best months. If your dates fall outside them, we will tell you what to expect and suggest alternatives.',
      },
      {
        q: 'Do you arrange flights and train tickets?',
        a: 'We can help with flights and rail options as part of your plan. Mention your departure city when you enquire.',
      },
    ],
  },
  {
    id: 'forex',
    title: 'Forex & currency exchange',
    items: [
      {
        q: 'Do you show live exchange rates?',
        a: 'No. Rates change through the day, so any number published on a website would soon be wrong. Message us the currency and amount and we will share the current rate.',
      },
      {
        q: 'Which documents are usually needed to buy foreign currency?',
        a: 'Commonly a valid passport, ID proof, PAN details and travel proof such as a visa or ticket. Exact requirements depend on the purpose of travel and current RBI rules, and we confirm them when you enquire.',
      },
      {
        q: 'Can I sell leftover foreign currency?',
        a: 'In many cases yes, subject to the currency, amount and the rules that apply. Message us to check.',
      },
      {
        q: 'Which currencies can I ask for?',
        a: 'Travellers commonly ask for US dollars, euros, pounds, UAE dirhams, Singapore dollars and Thai baht, among others. Availability is confirmed when you ask.',
      },
    ],
  },
  {
    id: 'transfer',
    title: 'International money transfer',
    items: [
      {
        q: 'What kind of transfers can you help with?',
        a: 'We assist with Western Union money transfers. Tell us whether you want to send money abroad or receive money, the country and the purpose, and we will explain what is possible and what is needed.',
      },
      {
        q: 'How much does a transfer cost?',
        a: 'Fees and exchange rates depend on the amount, the countries, the payment method and the purpose. Ask us for the current details before you proceed.',
      },
      {
        q: 'How can I stay safe from money-transfer scams?',
        a: 'Never send money to someone you have not met in person, to claim a prize or lottery, or because someone is pressuring you to act urgently. If anything feels wrong, stop and ask us.',
      },
      {
        q: 'What do I need to receive money?',
        a: 'Typically a valid photo ID and the transfer reference number (MTCN) that the sender shares with you, plus sender details. We confirm the exact requirements when you contact us.',
      },
    ],
  },
  {
    id: 'visa',
    title: 'Visa assistance',
    items: [
      {
        q: 'Can you guarantee my visa?',
        a: 'No. Visa decisions are made only by the embassy, consulate or immigration authority. We help you prepare accurate documents and apply correctly. No agent can promise approval.',
      },
      {
        q: 'Which visas can you help with?',
        a: 'We assist with tourist visa applications for popular destinations such as the UAE, Thailand, Indonesia (Bali), Singapore, Maldives, Vietnam and Schengen countries. Ask us if your destination is not listed.',
      },
      {
        q: 'How long does a visa take?',
        a: 'Processing times are set by each country and change often, especially in peak season. We share the latest official timeline for your destination and recommend applying early.',
      },
      {
        q: 'What if my visa was refused before?',
        a: 'Tell us when you enquire. We will review what happened and advise honestly whether and how to apply again.',
      },
      {
        q: 'Do I need to travel to an office for the visa?',
        a: 'Some countries require a biometric or in-person appointment. We tell you upfront what applies to your destination.',
      },
    ],
  },
];

/** Short subsets reused on service pages. */
export function faqsFor(...groupIds: string[]): Faq[] {
  return faqGroups.filter((g) => groupIds.includes(g.id)).flatMap((g) => g.items);
}

export const allFaqs: Faq[] = faqGroups.flatMap((g) => g.items);
