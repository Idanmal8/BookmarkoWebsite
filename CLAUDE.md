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

## API Integration

All stores and components that call the backend read `import.meta.env.VITE_API_BASE_URL` — never hardcode the URL. Trailing slashes are stripped in the store. No auth — the website calls only public/unauthenticated endpoints (`/waitlist`, `/delete-account/*`).

## Deployment (CI/CD)

`.github/workflows/deploy.yml` deploys to **GitHub Pages** on every push to `main` (plus manual `workflow_dispatch`):

1. `npm ci && npm run build` with `VITE_API_BASE_URL` set to the production Cloud Run URL (`https://bookmarko-backend-production-587868624215.europe-west1.run.app`) — baked into the JS bundle at build time.
2. `actions/upload-pages-artifact` (path: `dist/`) → `actions/deploy-pages`, protected by `concurrency: group: pages, cancel-in-progress: true`.

**Merging to `main` is the release.** There is no staging environment. The custom domain (`bookmark-o.com`, `www.bookmark-o.com`) is configured in GitHub Pages settings — not in this codebase. `permissions: pages: write, id-token: write` are required for the deploy step.
