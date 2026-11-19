/**
 * Whether the new landing page is live: the reading path section, the game
 * and badges moved up, Google Drive and Dropbox in the import section, the
 * Google Play reviews, and Quests and badges without its "This month" card.
 *
 * While it is `false` the homepage is the one that was live before. Change it
 * to `true` and push to `main` to launch: the deploy that follows shows the new
 * page to everyone and writes the crawlable headings to match
 * (`scripts/seo.ts`). A switch and not a date, at the owner's ask
 * (2026-11-19), so a delay to the reading game's release needs no edit here.
 *
 * To see the new page before then, open the site with `?preview=1`.
 *
 * Kept free of imports and of `window`: `scripts/seo.ts` reads it at build time.
 */
export const NEW_HOME_LIVE: boolean = false

/** In a browser: live, or shown early by `?preview=1`. */
export function newHomeShown(search: string): boolean {
  return NEW_HOME_LIVE || new URLSearchParams(search).get('preview') === '1'
}
