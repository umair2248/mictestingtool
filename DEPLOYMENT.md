# Build and deploy to Hostinger

The site uses React, Vite, local Markdown articles and build-time HTML prerendering. Hostinger serves the generated static files; Node.js is not required on the host.

## Build and upload

1. Use Node.js 22.12+ or 24. Run `npm ci` when installing dependencies.
2. Run `npm run build` yourself. It builds the app, prerenders public routes, generates the sitemap and verifies the output.
3. Back up the live deployment. Upload the **contents of `dist`** to Hostinger's `public_html`, including the hidden `.htaccess`. Upload assets first and HTML last. Preserve unrelated server files and API endpoints.
4. Do not upload `src`, `node_modules`, `dist-ssr`, tests or environment files. `dist-ssr` is a build intermediate, not the website to upload.
5. Clear Hostinger/CDN cache. Check direct page loads, refreshes, redirects and missing URLs. Remove obsolete generated article directories carefully after backing them up.

The `.htaccess` assumes deployment at the domain root on Apache/LiteSpeed. It selects HTTPS/non-www URLs, redirects legacy URLs, serves extensionless prerendered pages, sets caching rules and returns real 404s. Keep the permanent redirect from `/blog/sample-post` to `/blog/how-to-test-your-microphone`.

## Main pages

- `/`: microphone recording, playback and download.
- `/speaker-test`: left/right/both-channel playback and stereo sequence; microphone testing is linked separately.
- `/blog`: local article archive and search.
- `/blog/how-to-test-your-microphone`: general testing guide.
- `/blog/how-to-connect-set-up-microphone`: connection and setup guide.
- `/features`, `/faq`, `/contact`, `/privacy`, `/terms`, `/security`: support and information.

Microphone translations are registered in `src/data/locales.js`: Indonesian, Polish, Czech, French, German, Turkish, Spanish and Simplified Chinese. The registry drives routes, reciprocal hreflang, language links and sitemap inclusion. Speaker and article pages are English; do not annotate nonexistent translations.

## Publish an article

Create `src/content/blog/your-article-slug.md`:

```md
---
title: "Your article title"
seoTitle: "Optional search title"
excerpt: "A useful, unique description."
date: "YYYY-MM-DD"
author: "Real author or publisher name"
tags: ["Microphones", "Setup"]
---

## First section

Write the article here. [Test your microphone](/#microphone-test).
```

Use the actual publication date. Add `modified: "YYYY-MM-DD"` for a substantive revision; do not change it automatically on every build. Reading time is estimated from content unless supplied explicitly. Start sections with `##` because the template provides the H1. Metadata, schema, archive links, heading anchors and sitemap entries follow the source automatically. Rebuild and upload to publish changes.

## Development and checks

- `npm run dev`: development server.
- `npm run lint`: source linting.
- `npm run test:localized`, `npm run test:article`, `npm run test:speaker`: source rendering/SEO and audio-signal checks without producing a deployment build.
- `npm run test:localized:browser`: combined development-browser suite for translations, articles and speaker playback. Install Chromium once with `npx playwright install chromium`.
- `npm run test:article:browser` or `npm run test:speaker:browser`: focused browser checks.
- `npm run test:seo` and `npm run test:browser`: check a freshly generated production build.

Browser tests use synthetic microphone input. They do not certify physical headphone output, hearing, calibrated loudness, latency or hardware quality. Listen using the intended device after deployment.

## Live SEO verification

- Confirm `/robots.txt` is text and `/sitemap.xml` is XML.
- Confirm each public route returns 200 with its unique title, description, canonical, useful HTML and schema in View Source with JavaScript disabled.
- Verify document languages and reciprocal hreflang for the translated microphone pages. Unknown URLs must return 404.
- Submit `https://mictestingtool.com/sitemap.xml` in Search Console and inspect newly deployed URLs. Validate structured data with Rich Results Test.
- Measure real mobile LCP, INP and CLS after deployment. Source tests do not establish field Core Web Vitals, indexing or rankings.

## Optional services

Articles publish from local Markdown. `/admin/editor` provides publishing instructions, not database publishing. Accounts remain optional and disabled until public Supabase settings from `.env.example` are configured. Never place a service-role key in client configuration.

The contact form uses the existing Formspree endpoint; test real delivery separately. Review legal pages against the services actually enabled. The local `public_html/api` directory is separate server material and must be preserved unless you explicitly intend to replace it.
