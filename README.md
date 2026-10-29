# Mic Testing Tool

[![CI](../../actions/workflows/ci.yml/badge.svg)](../../actions/workflows/ci.yml)

**Live site: [mictestingtool.com](https://mictestingtool.com)**

A free, private, browser-based toolkit for checking audio and video devices. Record and play back your microphone, watch the live input level, test your webcam and mic together, and check left/right speaker output. Everything runs in the browser and nothing is uploaded.

## Features

- **Microphone test** (`/`): choose an input, record, play back and download a clip. It shows live frequency bars, a level meter and browser audio details.
- **Webcam and microphone test** (`/webcam-test`): live camera preview, resolution and frame rate, a mic level meter, snapshots and a 10-second recorded clip.
- **Speaker and headphone test** (`/speaker-test`): left, right and both-channel playback, plus a stereo sequence.
- **Guides**: Markdown troubleshooting articles in `src/content/blog`, such as how to test a microphone and how to fix a microphone that isn't working.
- **Translations**: the microphone test is available in 8 languages, with reciprocal `hreflang` tags.

## Tech stack

- **React 19**, **React Router 7** and **Vite 8**.
- **Build-time prerendering**: every public route is shipped as static HTML, so pages can be indexed without JavaScript.
- **Web Audio API**, **MediaRecorder** and **getUserMedia** for device capture, all on the client.
- **SEO**:
  - per-route titles, descriptions and canonical URLs
  - JSON-LD (WebSite, Organization, WebApplication, BlogPosting, BreadcrumbList)
  - a generated sitemap
  - a build-output verifier
- **Testing**: Playwright browser tests use synthetic media devices. Node scripts check the source and the build.
- **Hosting**: static files on Hostinger (LiteSpeed). `.htaccess` handles redirects, caching and real 404s.

## Getting started

Requires Node.js 22.12+ or 24.

```bash
npm ci
npm run dev        # development server
npm run lint       # lint
npm run build      # build, prerender, sitemap and SEO verification
```

## Tests

```bash
npx playwright install chromium   # once
npm run test:browser              # production build (run after npm run build)
npm run test:localized:browser    # translations, articles and the speaker test (dev server)
npm run test:article              # article source checks
```

CI runs lint, the build and both browser suites on every push and pull request.

## Project structure

```
src/
  components/     UI, layout and the SEO head
  content/blog/   Markdown articles (frontmatter: title, seoTitle, excerpt, date, tags)
  data/           page metadata (site.js), navigation, locales
  hooks/          microphone and webcam capture logic
  pages/          route components
  styles/         design tokens and page styles
scripts/          prerender, sitemap, build verification, test server
tests/            Playwright tests for the production build
tests-localized/  Playwright tests on the dev server
```

## Deployment

Run `npm run build`, then upload the **contents of `dist`** (including `.htaccess`) to Hostinger's `public_html`. See [DEPLOYMENT.md](./DEPLOYMENT.md) for the full checklist, how to publish an article and how to verify SEO on the live site.
