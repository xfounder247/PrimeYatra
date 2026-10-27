/**
 * Destination content. Evergreen travel facts only: no prices, no ratings, no availability claims.
 * Prices are always "on request" because they change with season, hotel and flights.
 */

export type Theme =
  | 'honeymoon'
  | 'family'
  | 'beach'
  | 'hills'
  | 'adventure'
  | 'culture'
  | 'city'
  | 'nature'
  | 'spiritual'
  | 'friends'
  | 'wellness';

export const THEME_LABEL: Record<Theme, string> = {
  honeymoon: 'Honeymoon',
  family: 'Family',
  beach: 'Beach & islands',
  hills: 'Hills & snow',
  adventure: 'Adventure',
  culture: 'Culture & heritage',
  city: 'City breaks',
  nature: 'Nature & wildlife',
  spiritual: 'Spiritual',
  friends: 'Friends & groups',
  wellness: 'Wellness',
};

export type Destination = {
  slug: string;
  name: string;
  kind: 'domestic' | 'international';
  place: string;
  tagline: string;
  summary: string;
  bestTime: string;
  bestMonths: number[];
  yearRound?: boolean;
  suggestedStay: string;
  themes: Theme[];
  highlights: string[];
  experiences: string[];
  routes: { title: string; stops: string }[];
  notes: string[];
  metaDescription: string;
  /** International only */
  currency?: string;
  visaNote?: string;
};

export const destinations: Destination[] = [
  // ───────────── Domestic ─────────────
  {
    slug: 'kashmir',
    name: 'Kashmir',
    kind: 'domestic',
    place: 'Jammu & Kashmir, India',
    tagline: 'Lakes, meadows and snow-capped valleys',
    summary:
      'Shikara rides on Dal Lake, Mughal gardens in Srinagar, the meadows of Pahalgam and the snow slopes of Gulmarg: Kashmir suits couples, families and photographers alike. We plan the route around the season you travel in.',
    bestTime: 'April to October for green valleys; December to February for snow',
    bestMonths: [4, 5, 6, 7, 8, 9, 10],
    suggestedStay: '5 to 7 nights',
    themes: ['hills', 'honeymoon', 'family', 'nature'],
    highlights: ['Dal Lake shikara ride', 'Houseboat stay in Srinagar', 'Mughal gardens', 'Gulmarg gondola and snow slopes', 'Pahalgam valleys', 'Sonamarg meadows'],
    experiences: ['Sunrise or sunset shikara ride', 'Day trip to Gulmarg', 'Pony ride or walk in Pahalgam', 'Local Kashmiri food and kahwa tea'],
    routes: [
      { title: 'Classic circuit', stops: 'Srinagar, Gulmarg, Pahalgam, Srinagar' },
      { title: 'Add Sonamarg', stops: 'Srinagar, Sonamarg day trip, Gulmarg, Pahalgam' },
    ],
    notes: [
      'We check current travel advisories, road and weather conditions before finalising any Kashmir itinerary.',
      'Carry original government photo ID for every traveller.',
      'Snow-season trips need warm clothing and some flexibility in the schedule.',
    ],
    metaDescription:
      'Kashmir tour packages from Prime Enterprises: Srinagar, Gulmarg, Pahalgam and Sonamarg. Customised for families and honeymoon couples. Ask for a quote on WhatsApp.',
  },
  {
    slug: 'manali',
    name: 'Manali',
    kind: 'domestic',
    place: 'Himachal Pradesh, India',
    tagline: 'Pine forests, snow and mountain adventure',
    summary:
      'Manali combines easy sightseeing with adventure: Solang Valley, the Atal Tunnel, Old Manali cafés and the Beas river. It works as a family holiday, a friends trip or a honeymoon, and pairs well with Shimla or Chandigarh.',
    bestTime: 'March to June and October to February; avoid peak monsoon (July and August)',
    bestMonths: [1, 2, 3, 4, 5, 6, 9, 10, 11, 12],
    suggestedStay: '4 to 6 nights',
    themes: ['hills', 'adventure', 'honeymoon', 'family', 'friends'],
    highlights: ['Solang Valley activities', 'Atal Tunnel', 'Hadimba Devi Temple', 'Old Manali cafés', 'Naggar Castle area', 'Beas river rafting (seasonal)'],
    experiences: ['Snow activities in winter', 'Paragliding in season', 'River rafting in season', 'Cafe-hopping in Old Manali'],
    routes: [
      { title: 'Manali focus', stops: 'Manali with Solang Valley and Atal Tunnel day trips' },
      { title: 'Himachal combo', stops: 'Chandigarh, Shimla, Manali' },
    ],
    notes: [
      'High-altitude roads such as Rohtang Pass are seasonal and permit-regulated, so access depends on the day.',
      'Monsoon months can bring landslides and road closures; we advise on timing.',
    ],
    metaDescription:
      'Manali tour packages with Solang Valley, Atal Tunnel and Himachal combos. Family, friends and honeymoon trips planned by Prime Enterprises. Enquire on WhatsApp.',
  },
  {
    slug: 'goa',
    name: 'Goa',
    kind: 'domestic',
    place: 'Goa, India',
    tagline: 'Beaches, heritage churches and easy-going evenings',
    summary:
      'North Goa for energy and nightlife, South Goa for quiet beaches, and Old Goa for heritage. We match the stay to the mood of your trip, whether that is a friends getaway, a family break or a relaxed honeymoon.',
    bestTime: 'November to March; the monsoon (June to September) is the quiet, green season',
    bestMonths: [11, 12, 1, 2, 3],
    suggestedStay: '3 to 5 nights',
    themes: ['beach', 'friends', 'family', 'honeymoon'],
    highlights: ['Baga, Calangute and Anjuna beaches', 'Palolem and Agonda in the south', 'Old Goa churches', 'Fort Aguada', 'Fontainhas in Panaji', 'Water sports'],
    experiences: ['River or sunset cruise', 'Heritage walk in Panaji', 'Beach-shack dinners', 'Spice plantation visit'],
    routes: [
      { title: 'North Goa', stops: 'Calangute, Baga, Anjuna, Fort Aguada, Old Goa' },
      { title: 'North and South', stops: 'North Goa beaches, Old Goa, Palolem or Agonda' },
    ],
    notes: ['Sea conditions limit water sports during the monsoon.', 'Peak weeks around Christmas and New Year need very early booking.'],
    metaDescription:
      'Goa tour packages for friends, families and couples: North and South Goa beaches, Old Goa heritage and more. Prime Enterprises plans it, you enquire on WhatsApp.',
  },
  {
    slug: 'kerala',
    name: 'Kerala',
    kind: 'domestic',
    place: 'Kerala, India',
    tagline: 'Backwaters, tea hills and slow, green days',
    summary:
      'Tea plantations in Munnar, wildlife at Thekkady, a houseboat on the Alleppey backwaters and beaches at Kovalam or Varkala. Kerala is one of the easiest holidays to tailor for couples, families and senior travellers.',
    bestTime: 'September to March, with the cooler months of October to February most popular',
    bestMonths: [9, 10, 11, 12, 1, 2, 3],
    suggestedStay: '5 to 7 nights',
    themes: ['nature', 'honeymoon', 'family', 'wellness'],
    highlights: ['Alleppey houseboat', 'Munnar tea gardens', 'Periyar Wildlife Sanctuary, Thekkady', 'Fort Kochi', 'Kovalam and Varkala beaches', 'Ayurveda and wellness stays'],
    experiences: ['Overnight houseboat cruise', 'Spice and tea plantation walk', 'Kathakali performance in Kochi', 'Ayurvedic massage'],
    routes: [
      { title: 'Hills and backwaters', stops: 'Kochi, Munnar, Thekkady, Alleppey' },
      { title: 'Add the beach', stops: 'Kochi, Munnar, Alleppey, Kovalam or Varkala' },
    ],
    notes: ['Monsoon is lush and good for wellness stays but not ideal for sightseeing.', 'Houseboat availability is limited in peak season, so enquire early.'],
    metaDescription:
      'Kerala tour packages: Munnar, Thekkady, Alleppey houseboat and beaches. Customised family and honeymoon trips by Prime Enterprises. Get details on WhatsApp.',
  },
  {
    slug: 'rajasthan',
    name: 'Rajasthan',
    kind: 'domestic',
    place: 'Rajasthan, India',
    tagline: 'Forts, palaces and the golden Thar desert',
    summary:
      'Jaipur, Udaipur, Jodhpur and Jaisalmer make a classic royal circuit with forts, palaces, bazaars and a night under desert skies. We can shorten or stretch the route to fit your time and comfort level.',
    bestTime: 'October to March, when days are pleasant and nights are cool',
    bestMonths: [10, 11, 12, 1, 2, 3],
    suggestedStay: '6 to 8 nights',
    themes: ['culture', 'family', 'honeymoon'],
    highlights: ['Amber Fort and City Palace, Jaipur', 'Lake Pichola, Udaipur', 'Mehrangarh Fort, Jodhpur', 'Jaisalmer Fort', 'Sam sand dunes', 'Ranthambore tiger reserve (optional)'],
    experiences: ['Desert camp with folk music', 'Heritage hotel stay', 'Bazaar walk in Jaipur', 'Sunset boat ride in Udaipur'],
    routes: [
      { title: 'Golden Triangle plus', stops: 'Delhi, Jaipur, Pushkar, Udaipur' },
      { title: 'Royal Rajasthan', stops: 'Jaipur, Jodhpur, Jaisalmer, Udaipur' },
    ],
    notes: ['Summers (April to June) are very hot, so we suggest shorter sightseeing hours if you travel then.', 'Long drives between cities; we plan rest stops and realistic timings.'],
    metaDescription:
      'Rajasthan tour packages covering Jaipur, Udaipur, Jodhpur and Jaisalmer. Palace stays, desert camps and family itineraries by Prime Enterprises. Ask on WhatsApp.',
  },
  {
    slug: 'uttarakhand',
    name: 'Uttarakhand',
    kind: 'domestic',
    place: 'Uttarakhand, India',
    tagline: 'Himalayan hill stations, the Ganga and wild forests',
    summary:
      'From the Ganga aarti at Haridwar and rafting in Rishikesh to the lakes of Nainital, the views of Mussoorie and tigers of Jim Corbett: Uttarakhand has something for every kind of traveller, including pilgrims.',
    bestTime: 'March to June and September to November; the Char Dham yatra runs in a seasonal window',
    bestMonths: [3, 4, 5, 6, 9, 10, 11],
    suggestedStay: '4 to 7 nights',
    themes: ['hills', 'spiritual', 'adventure', 'family', 'nature'],
    highlights: ['Haridwar Ganga aarti', 'Rishikesh rafting and yoga', 'Mussoorie viewpoints', 'Nainital lake', 'Jim Corbett National Park', 'Auli (winter skiing)'],
    experiences: ['Evening Ganga aarti', 'White-water rafting in season', 'Jungle safari at Corbett', 'Yoga and meditation retreat'],
    routes: [
      { title: 'Hills and rivers', stops: 'Haridwar, Rishikesh, Mussoorie' },
      { title: 'Lakes and wildlife', stops: 'Nainital, Jim Corbett, Ranikhet or Almora' },
    ],
    notes: ['Mountain roads can be affected by rain and landslides in the monsoon.', 'Pilgrimage and high-altitude routes need extra planning; we advise on registration and timing.'],
    metaDescription:
      'Uttarakhand tour packages: Rishikesh, Haridwar, Mussoorie, Nainital and Jim Corbett. Family, adventure and spiritual trips from Prime Enterprises. Enquire on WhatsApp.',
  },
  {
    slug: 'andaman',
    name: 'Andaman',
    kind: 'domestic',
    place: 'Andaman and Nicobar Islands, India',
    tagline: 'Clear water, white sand and coral reefs',
    summary:
      'Port Blair for history, Havelock for Radhanagar Beach and diving, Neil Island for quiet coastlines. Ideal for honeymooners and families who want beach time with light adventure, and a first taste of scuba or snorkelling.',
    bestTime: 'October to May, with the calmest seas from November to April',
    bestMonths: [10, 11, 12, 1, 2, 3, 4, 5],
    suggestedStay: '5 to 6 nights',
    themes: ['beach', 'honeymoon', 'adventure', 'family'],
    highlights: ['Radhanagar Beach, Havelock (Swaraj Dweep)', 'Neil Island (Shaheed Dweep)', 'Cellular Jail light and sound show', 'Snorkelling and scuba diving', 'Glass-bottom boat rides', 'Chidiya Tapu sunset'],
    experiences: ['Introductory scuba dive', 'Snorkelling over coral', 'Sunset at Chidiya Tapu', 'Island-hopping by ferry'],
    routes: [
      { title: 'Port Blair and Havelock', stops: 'Port Blair, Havelock' },
      { title: 'Three-island trip', stops: 'Port Blair, Havelock, Neil Island' },
    ],
    notes: ['Flights and inter-island ferries depend on weather, so we build in buffer time.', 'Book diving and ferry slots early in peak season.'],
    metaDescription:
      'Andaman tour packages: Port Blair, Havelock and Neil Island with beaches, diving and snorkelling. Honeymoon and family trips by Prime Enterprises. Ask on WhatsApp.',
  },

  // ───────────── International ─────────────
  {
    slug: 'dubai',
    name: 'Dubai',
    kind: 'international',
    place: 'United Arab Emirates',
    tagline: 'Skyline, desert and world-class shopping',
    summary:
      'Dubai packs a lot into a short trip: the Burj Khalifa, a desert safari, the Marina, souks and malls, plus an easy day trip to Abu Dhabi. It is one of the simplest international holidays for first-time travellers and families.',
    bestTime: 'November to March, when the weather is pleasant',
    bestMonths: [11, 12, 1, 2, 3],
    suggestedStay: '4 to 6 nights',
    themes: ['city', 'family', 'friends'],
    highlights: ['Burj Khalifa observation deck', 'Desert safari', 'Dubai Mall and fountain show', 'Palm Jumeirah and Marina', 'Gold and Spice souks', 'Abu Dhabi day trip with Sheikh Zayed Grand Mosque'],
    experiences: ['Dune drive with dinner in the desert', 'Dhow cruise', 'Museum of the Future', 'Old Dubai walk'],
    routes: [
      { title: 'Dubai essentials', stops: 'Dubai city, desert safari, Marina cruise' },
      { title: 'Dubai plus Abu Dhabi', stops: 'Dubai, Abu Dhabi day trip' },
    ],
    notes: ['Summer months are very hot; indoor-focused itineraries work best.', 'Modest dress is expected at mosques and some public places.'],
    currency: 'UAE dirham (AED)',
    visaNote: 'UAE visa rules depend on your passport and the purpose of travel. We confirm the current requirement before you book.',
    metaDescription:
      'Dubai tour packages from Prime Enterprises: Burj Khalifa, desert safari, Abu Dhabi day trip and more. Visa and forex help available. Enquire on WhatsApp.',
  },
  {
    slug: 'thailand',
    name: 'Thailand',
    kind: 'international',
    place: 'Thailand',
    tagline: 'Island beaches, street food and temples',
    summary:
      'Bangkok for temples and markets, Pattaya for easy entertainment, Phuket and Krabi for beaches and island trips. Thailand works well for friends, families and couples who want variety on a single itinerary.',
    bestTime: 'November to February for cooler, drier weather; May to October is the rainy season',
    bestMonths: [11, 12, 1, 2, 3],
    suggestedStay: '5 to 7 nights',
    themes: ['beach', 'friends', 'family', 'honeymoon'],
    highlights: ['Grand Palace and temples, Bangkok', 'Floating market visit', 'Phi Phi Islands boat trip', 'Phuket Old Town and beaches', 'Krabi island hopping', 'Pattaya coral island trip'],
    experiences: ['Longtail boat island tour', 'Thai cooking class', 'Chao Phraya river dinner cruise', 'Night market food walk'],
    routes: [
      { title: 'Bangkok and Pattaya', stops: 'Bangkok, Pattaya' },
      { title: 'Beach-focused', stops: 'Phuket, Phi Phi, Krabi' },
    ],
    notes: ['Island boat trips depend on sea conditions.', 'Dress modestly when visiting temples and palaces.'],
    currency: 'Thai baht (THB)',
    visaNote: 'Entry rules for Indian passport holders can change. We confirm the current requirement before you book.',
    metaDescription:
      'Thailand tour packages: Bangkok, Pattaya, Phuket and Krabi for families, friends and couples. Visa and forex assistance too. Prime Enterprises, enquire on WhatsApp.',
  },
  {
    slug: 'bali',
    name: 'Bali',
    kind: 'international',
    place: 'Indonesia',
    tagline: 'Rice terraces, temples and private-pool villas',
    summary:
      'Ubud for culture and rice terraces, Seminyak and Canggu for beach clubs and cafés, Uluwatu for cliffside temples and sunsets, plus Nusa Penida for dramatic coastlines. Bali is a favourite honeymoon pick.',
    bestTime: 'April to October, the drier months',
    bestMonths: [4, 5, 6, 7, 8, 9, 10],
    suggestedStay: '5 to 7 nights',
    themes: ['beach', 'honeymoon', 'wellness', 'culture'],
    highlights: ['Ubud rice terraces and Monkey Forest', 'Uluwatu temple and Kecak dance', 'Tanah Lot sunset', 'Nusa Penida day trip', 'Mount Batur sunrise trek', 'Private pool villa stays'],
    experiences: ['Sunrise trek at Mount Batur', 'Balinese spa session', 'Waterfall visits', 'Sunset dinner by the sea'],
    routes: [
      { title: 'Culture and coast', stops: 'Ubud, Uluwatu, Seminyak' },
      { title: 'Add an island', stops: 'Ubud, Seminyak, Nusa Penida day trip' },
    ],
    notes: ['Traffic can be slow, so we avoid over-packed days.', 'Sea crossings to Nusa Penida depend on conditions.'],
    currency: 'Indonesian rupiah (IDR)',
    visaNote: 'Indonesia entry requirements can change. We confirm the current process and fees before you book.',
    metaDescription:
      'Bali tour and honeymoon packages: Ubud, Seminyak, Uluwatu and Nusa Penida with villa stays. Prime Enterprises customises it for you. Enquire on WhatsApp.',
  },
  {
    slug: 'singapore',
    name: 'Singapore',
    kind: 'international',
    place: 'Singapore',
    tagline: 'Gardens, skyline and family-friendly fun',
    summary:
      'Clean, compact and easy to get around: Gardens by the Bay, Sentosa, the Night Safari and food from every culture. It is a strong first international trip, especially for families with children.',
    bestTime: 'Year-round; February to April tends to be drier',
    bestMonths: [2, 3, 4],
    yearRound: true,
    suggestedStay: '3 to 5 nights',
    themes: ['city', 'family'],
    highlights: ['Gardens by the Bay', 'Marina Bay skyline', 'Sentosa Island', 'Universal Studios Singapore', 'Night Safari and Zoo', 'Chinatown, Little India and Kampong Glam'],
    experiences: ['Evening light show at Gardens by the Bay', 'Hawker-centre food tour', 'River cruise', 'Jewel Changi visit'],
    routes: [
      { title: 'City highlights', stops: 'Marina Bay, Gardens by the Bay, Chinatown, Little India' },
      { title: 'Family fun', stops: 'Sentosa, Universal Studios, Zoo or Night Safari' },
    ],
    notes: ['Sudden short rain showers are common; plan indoor backups.', 'Singapore is often combined with Malaysia or Bali.'],
    currency: 'Singapore dollar (SGD)',
    visaNote: 'Singapore entry requirements depend on your passport and purpose. We confirm the current rule before you book.',
    metaDescription:
      'Singapore tour packages: Gardens by the Bay, Sentosa, Universal Studios and Night Safari. Family-friendly trips from Prime Enterprises. Enquire on WhatsApp.',
  },
  {
    slug: 'maldives',
    name: 'Maldives',
    kind: 'international',
    place: 'Maldives',
    tagline: 'Overwater villas and turquoise lagoons',
    summary:
      'Private-island resorts with overwater villas, house reefs for snorkelling, sandbank picnics and sunset cruises. Guesthouses on local islands offer a more modest way to experience the Maldives. We help you compare both options.',
    bestTime: 'November to April, the dry season',
    bestMonths: [11, 12, 1, 2, 3, 4],
    suggestedStay: '4 to 6 nights',
    themes: ['beach', 'honeymoon'],
    highlights: ['Overwater and beach villas', 'House-reef snorkelling', 'Sandbank picnics', 'Dolphin and sunset cruises', 'Diving and water sports', 'Spa and wellness'],
    experiences: ['Sunset dolphin cruise', 'Snorkel with reef fish', 'Private beach dinner', 'Scuba introductory dive'],
    routes: [
      { title: 'Resort stay', stops: 'Resort island with seaplane or speedboat transfer' },
      { title: 'Local island stay', stops: 'Guesthouse on a local island with excursions' },
    ],
    notes: ['Resort transfers (seaplane or speedboat) depend on the resort location and timing.', 'Resort prices are commonly quoted in US dollars.'],
    currency: 'Maldivian rufiyaa (MVR); US dollars are widely used at resorts',
    visaNote: 'Entry rules can change. We confirm the current requirement and resort booking proof you need.',
    metaDescription:
      'Maldives honeymoon and holiday packages: overwater villas, resorts and local-island stays. Prime Enterprises customises your trip. Ask for a quote on WhatsApp.',
  },
  {
    slug: 'vietnam',
    name: 'Vietnam',
    kind: 'international',
    place: 'Vietnam',
    tagline: 'Bays, old towns and some of the best street food',
    summary:
      'Hanoi for the Old Quarter, Ha Long Bay for limestone seascapes, Da Nang and Hoi An for beaches and lantern-lit streets, and Ho Chi Minh City for history and the Mekong Delta. A fresh option beyond the usual beach list.',
    bestTime: 'Varies by region; spring (February to April) and autumn (September to November) are popular',
    bestMonths: [2, 3, 4, 9, 10, 11],
    suggestedStay: '6 to 8 nights',
    themes: ['culture', 'nature', 'friends', 'family'],
    highlights: ['Ha Long Bay cruise', 'Hanoi Old Quarter', 'Ninh Binh landscapes', 'Da Nang and Ba Na Hills', 'Hoi An ancient town', 'Ho Chi Minh City and Mekong Delta'],
    experiences: ['Overnight or day cruise in Ha Long Bay', 'Lantern-lit evening in Hoi An', 'Street-food tour in Hanoi', 'Cu Chi tunnels visit'],
    routes: [
      { title: 'North to central', stops: 'Hanoi, Ha Long Bay, Da Nang, Hoi An' },
      { title: 'Central to south', stops: 'Da Nang, Hoi An, Ho Chi Minh City' },
    ],
    notes: ['The weather differs across the north, centre and south, so timing matters for each leg.', 'Domestic flights between cities save a lot of travel time.'],
    currency: 'Vietnamese dong (VND)',
    visaNote: 'Vietnam entry requirements can change. We confirm the current process before you book.',
    metaDescription:
      'Vietnam tour packages: Hanoi, Ha Long Bay, Da Nang, Hoi An and Ho Chi Minh City. Customised itineraries from Prime Enterprises. Enquire on WhatsApp.',
  },
  {
    slug: 'europe',
    name: 'Europe',
    kind: 'international',
    place: 'Europe (Schengen and beyond)',
    tagline: 'Alpine peaks, historic capitals and scenic rail',
    summary:
      'Switzerland, Paris, Italy, Amsterdam and beyond: classic multi-country circuits or a deeper stay in one or two places. Europe needs the most planning, which is exactly where we help, from route and hotels to visa paperwork and forex.',
    bestTime: 'April to October; May to September has the longest days',
    bestMonths: [4, 5, 6, 7, 8, 9, 10],
    suggestedStay: '8 to 12 nights',
    themes: ['culture', 'honeymoon', 'family', 'city'],
    highlights: ['Swiss Alps and lakes', 'Paris and the Seine', 'Rome, Florence and Venice', 'Amsterdam canals', 'Prague, Vienna and Budapest', 'Scenic train journeys'],
    experiences: ['Mountain excursion in Switzerland', 'Seine river cruise', 'Gondola ride in Venice', 'Canal tour in Amsterdam'],
    routes: [
      { title: 'Western Europe classic', stops: 'Paris, Switzerland, Italy' },
      { title: 'Central Europe', stops: 'Prague, Vienna, Budapest' },
    ],
    notes: ['Many European itineraries need a Schengen visa; the UK and Ireland have separate processes.', 'Visa appointment slots can be limited in peak months, so start early.'],
    currency: 'Euro (EUR), Swiss franc (CHF), British pound (GBP) depending on route',
    visaNote: 'Most Schengen-country trips need a visa. Documents, insurance and appointments vary by country. We guide you step by step.',
    metaDescription:
      'Europe tour packages: Switzerland, Paris, Italy and more, with Schengen visa and forex help. Honeymoon and family itineraries by Prime Enterprises. Ask on WhatsApp.',
  },
];

export const domestic = destinations.filter((d) => d.kind === 'domestic');
export const international = destinations.filter((d) => d.kind === 'international');

export function getDestination(slug: string): Destination {
  const d = destinations.find((x) => x.slug === slug);
  if (!d) throw new Error(`Unknown destination: ${slug}`);
  return d;
}

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
