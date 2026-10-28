import type { PageMeta } from '../components';
import { destinations } from '../data/destinations';
import { homePage } from './home';
import { domesticPage, internationalPage, customPage, destinationPage } from './tours';
import { forexPage, transferPage, visaPage } from './money';
import { aboutPage, contactPage, faqsPage, privacyPage, termsPage, notFoundPage } from './company';

/** Every indexable page, in sitemap order. */
export function allPages(): PageMeta[] {
  return [
    homePage(),
    domesticPage(),
    internationalPage(),
    customPage(),
    forexPage(),
    transferPage(),
    visaPage(),
    aboutPage(),
    contactPage(),
    faqsPage(),
    ...destinations.map(destinationPage),
    privacyPage(),
    termsPage(),
  ];
}

export { notFoundPage };
