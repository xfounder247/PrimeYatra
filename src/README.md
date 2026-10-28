# Prime Enterprises website (primeyatra.co.in)

A fast, mobile-first website for Prime Enterprises: domestic and international tours, honeymoon and custom holidays, forex, Western Union transfer assistance and visa support.

It is built with TypeScript and Tailwind CSS 4 and produces plain HTML, CSS and JS in `dist/`, so it runs on any web server (Nginx on your VPS is covered in `DEPLOYMENT.md`).

> Why not Next.js? The build environment could not reach the npm registry to install it, and this site has no server-side needs. A static build is faster, cheaper to host and has nothing to hack. The code is organised in reusable components, so it could be moved to Next.js later.

## What is on the site (26 pages)

- Home, Domestic Tour Packages, International Tour Packages, Custom Holidays & Honeymoon, Forex & Currency Exchange, International Money Transfer, Visa Assistance, About Us, Contact Us, FAQs
- 14 destination pages (Kashmir, Manali, Goa, Kerala, Rajasthan, Uttarakhand, Andaman, Dubai, Thailand, Bali, Singapore, Maldives, Vietnam, Europe)
- Privacy Policy, Terms & Conditions, 404 page
- sitemap.xml, robots.txt, per-page titles and descriptions, JSON-LD structured data

## How the forms work

There is no backend. Every form (trip enquiry, callback with date picker, contact, custom holiday, forex, transfer, visa) is validated in the browser and then opens WhatsApp (+91 98992 90016) with the details already written. Nothing is stored and no booking is ever shown as confirmed.

## Commands

```
npm install        # once
npm run build      # builds the site into dist/
npm run preview    # serves dist/ at http://localhost:4173
npm test           # unit tests
npm run e2e        # browser tests (needs: npx playwright install chromium)
npm run check      # typecheck + tests + build + browser tests
```

## Where to change things

| What | File |
| --- | --- |
| Email, address, hours, social links, licences | `business.json` |
| Phone numbers, domain | `src/config.ts` |
| Destinations (text, best months, routes) | `src/data/destinations.ts` |
| Services and FAQs | `src/data/services.ts`, `src/data/faqs.ts` |
| Page content | `src/pages/*.ts` |
| Colours and styles | `src/styles.css` |
| Real photos | add `public/images/destinations/<slug>.jpg` (for example `goa.jpg`) |

Anything left empty in `business.json` is hidden on the site. See `DEPLOYMENT.md` for going live and for the list of information still needed before launch.
