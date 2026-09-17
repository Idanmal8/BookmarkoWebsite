# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

BookmarkoWebsite is the marketing/landing site for Bookmarko (bookmark-o.com). It is a single-page Vue 3 + Vite + TypeScript app using Pinia for state. No vue-router — routing is done manually via `window.location.pathname` / `window.location.search`. It also hosts the account-deletion and email-confirmation flows required by the Apple App Store and Google Play.

## Commands

```bash
npm run dev       # Vite dev server (http://localhost:5173)
npm run build     # vue-tsc type-check + vite build → dist/
npm run preview   # serve the production build locally
```

There are no test or lint scripts configured. `vue-tsc` is the only check — the build fails on type errors. Run `npm run build` before pushing.

## Architecture & Routing

No vue-router. `App.vue` resolves a `Route` at mount time from `window.location` and renders the correct component with `v-if / v-else-if`:

| URL / condition | Route value | Component rendered |
|---|---|---|
| `?confirmed` or `#confirmed` in URL | `email-confirmed` | `EmailConfirmed.vue` |
| `/delete-account/confirm` | `delete-confirm` | `DeleteAccountConfirm.vue` |
| `/delete-account` | `delete-request` | `DeleteAccountRequest.vue` |
| `/changelog` | `changelog` | `Changelog.vue` |
| `/newdesign` (case-insensitive) | `new-design` | `NewDesign.vue` |
| anything else | `home` | Full landing page sequence |

The `home` route renders the landing page as a sequence of sections: `Hero → BookSectionHero → GoodreadsImport → Leaderboard → GinieSection → Quote → Finale`. `Navbar` and `Footer` are shown on all routes except `email-confirmed` and `new-design`.

**Components (`src/components/`):**
- `Navbar.vue` — two variants: `home` (transparent/scroll) and `plain`
- Landing sections: `Hero`, `BookSectionHero`, `GoodreadsImport`, `Leaderboard`, `GinieSection`, `Quote`, `Finale`, `Footer`
- `Bookshelf.vue`, `Changelog.vue` — secondary content components
- `EmailConfirmed.vue` — landing target for backend email confirmation links
- `DeleteAccountRequest.vue` / `DeleteAccountConfirm.vue` — store-compliance account deletion flow
- `NewDesign.vue` — staging area for new design iterations (hidden route)

**State (Pinia stores, `src/stores/`):**
- `waitlist.ts` — waitlist signup; fakes a `BASE_COUNT = 3123` offset on the displayed count; reads `VITE_API_BASE_URL`.
- `accountDeletion.ts` — drives the two-step account deletion request/confirm flow.

**`src/composables/useReveal.ts`** — IntersectionObserver-based scroll-reveal helper used across sections.

**`src/data/changelog.ts`** — hand-maintained changelog entries array rendered by `Changelog.vue`. Update this file when releasing new app features.

**Path alias:** `@` resolves to `src/` (configured in `vite.config.ts`).

## SEO / static page generation

GitHub Pages has no SPA rewrite, so before this every path except `/` answered with a real HTTP **404** (`404.html` bounced browsers to `/`, but crawlers read the status and dropped the URL — nothing but the homepage could be indexed).

`scripts/seo.ts` is a build-only Vite plugin (`closeBundle`) that fixes this. For every known route it writes `dist/<route>/index.html`, so Pages serves a 200:

- Static routes: `/blog`, `/changelog`, `/roadmap`, `/delete-account`, `/delete-account/confirm`, `/newdesign`
- One page per blog post, from `GET {VITE_API_BASE_URL}/blog?limit=200` at build time

Each copy is the built `index.html` with two substitutions:

1. The `<!--seo-->…<!--/seo-->` block in `index.html` is swapped for that route's title, description, canonical, OG/Twitter tags and JSON-LD. **Keep those markers** — the build throws without them.
2. `<div id="app"></div>` is filled with crawlable markup (blog posts ship their full rendered body). Vue discards it when it mounts.

`/delete-account*` and `/newdesign` get `robots: noindex` and stay out of the sitemap. `dist/sitemap.xml` is written in the same hook; `public/robots.txt` points at it — that file must exist at the origin or Cloudflare serves its own managed robots.txt, which advertises no sitemap.

If the blog API is unreachable the build warns and ships without post pages rather than failing the deploy.

### AMP

`scripts/amp.ts` emits an AMP variant of every blog post at `/blog/:slug/amp`, written by the same `closeBundle` hook. Blog posts only: AMP forbids author JavaScript, so the interactive routes (`/`, `/roadmap`, `/delete-account`) cannot have a valid AMP variant that still works, and one that dropped the interaction would violate AMP's content-parity rule.

The pairing Google asks for is bidirectional and both halves are generated:

- the canonical post carries `<link rel="amphtml" href=".../amp/">` (via the `ampRoute` field on `Page` in `seo.ts`)
- the AMP copy carries `<link rel="canonical">` back at the post

AMP pages stay **out of `sitemap.xml`** — they declare the canonical post as canonical, so that is the URL Google should index.

`assertValidAmp()` runs on every generated document and **throws**, failing the build, if the required tags are missing or something AMP bans slips in (author `<script>`, raw `<img>`, `!important` in `<style amp-custom>`, a stylesheet over 75KB). It is a structural check, not the full spec. For the authoritative answer:

```bash
npm run build && npm run validate:amp   # pulls the official amphtml-validator via npx
```

**Content parity is a hard AMP rule**, so the AMP copy mirrors `BlogPost.vue`: title, book/author, date, cover, rendered body, and the Bookshop.org affiliate CTA. If you add something readers can see or do on `BlogPost.vue`, add it to `ampDocument()` too. (`rating` is on the post but rendered by neither, so it is correctly absent from both.)

The affiliate CTA's click tracking does **not** come along — `BlogPost.vue` fires `trackAffiliateClick` on click, and AMP allows no author JavaScript. Clicks from AMP still earn the commission (Bookshop sets the cookie, we don't), but they are invisible to `/affiliate/click`. Closing that gap needs `amp-analytics` pointed at an endpoint that accepts a beacon.

`/blog/:slug/amp` is also handled in `App.vue`: it redirects to the canonical post. Pages serves the static AMP file so the SPA normally never sees that path, but it does under `npm run dev` and when a build shipped without post pages (blog API down) leaves an indexed AMP URL falling through to `404.html`. Without the redirect it resolves to a `blog-post` whose slug is `<slug>/amp`.

`src/utils/markdown.ts` is shared with the Vue app and currently emits only AMP-safe tags. If it ever learns image or embed syntax, `ampBody()` in `amp.ts` is where that has to be translated to `<amp-img>` / `<amp-iframe>` — the build will fail until it is.

Note that AMP is optional for Google Search: it is not required for Top Stories or any other Search feature, and Google indexes AMP and non-AMP pages by the same standard. This exists as a performance variant, not a ranking one.

## API Integration

All stores and components that call the backend read `import.meta.env.VITE_API_BASE_URL` — never hardcode the URL. Trailing slashes are stripped in the store. No auth — the website calls only public/unauthenticated endpoints (`/waitlist`, `/delete-account/*`).

## Deployment (CI/CD)

`.github/workflows/deploy.yml` deploys to **GitHub Pages** on every push to `main` (plus manual `workflow_dispatch`):

1. `npm ci && npm run build` with `VITE_API_BASE_URL` set to the production Cloud Run URL (`https://bookmarko-backend-production-587868624215.europe-west1.run.app`) — baked into the JS bundle at build time.
2. `actions/upload-pages-artifact` (path: `dist/`) → `actions/deploy-pages`, protected by `concurrency: group: pages, cancel-in-progress: true`.

A `schedule:` cron also rebuilds nightly (07:30 UTC). This is not cosmetic: `scripts/seo.ts` bakes a static page + sitemap entry per blog post **at build time**, so a post published by the daily blog routine is invisible to crawlers until the next build.

**Merging to `main` is the release.** There is no staging environment. The custom domain (`bookmark-o.com`, `www.bookmark-o.com`) is configured in GitHub Pages settings — not in this codebase. `permissions: pages: write, id-token: write` are required for the deploy step.
