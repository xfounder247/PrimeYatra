# Prime Enterprises website (primeyatra.co.in)

Static site generator in TypeScript + Tailwind CSS 4. Output is plain HTML/CSS/JS that runs on any host.

## STATUS: work in progress (not buildable yet)

Done:
- Config: `business.json` (fill in email, address, hours, social, credentials), `src/config.ts`
- Libraries: WhatsApp links/messages, form validation, icons, SEO/JSON-LD builders
- Content data: 14 destinations, 6 services, FAQs
- Generated destination artwork (`src/art.ts`) and photo override hook (`src/images.ts`)
- Form system (`src/forms.ts`), shared components (`src/components.ts`), styles (`src/styles.css`)
- Browser script (`src/client/app.ts`): menus, filters, date pickers, validation, WhatsApp hand-off

Still to write:
- `src/pages/*.ts` (home, domestic, international, custom/honeymoon, forex, transfer, visa, about, contact, faqs, destination detail, privacy, terms, 404)
- `src/build.ts` (renders pages, compiles Tailwind and the client script, writes sitemap.xml, robots.txt, OG image, favicon)
- `public/.htaccess`, `tests/unit.test.ts`, `tests/e2e.ts`, `tests/server.ts`
- `DEPLOYMENT.md` and launch checklist

## Setup

```
npm install
npm run build
```

Note: Next.js could not be installed in the build environment (npm registry blocked), so this uses a static generator instead.
