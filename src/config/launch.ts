/**
 * When the new landing page goes live: the reading path section, the game and
 * badges moved up, Google Drive and Dropbox in the import section, the
 * Google Play reviews, and Quests and badges without its "This month" card.
 *
 * Until then the homepage is the one that was live before (the owner,
 * 2026-11-19: "keep it for a week hidden"). The switch needs no deploy: a
 * visitor's browser compares its clock with this moment, and the nightly
 * build (07:30 UTC) writes the crawlable headings to match.
 *
 * It should be the day the reading game opens to everyone; if that moves,
 * move this. To see the new page before then, open the site with
 * `?preview=1`.
 *
 * Kept free of imports and of `window`: `scripts/seo.ts` reads it at build time.
 */
export const NEW_HOME_FROM = '2026-11-26T07:00:00Z'

/** Whether the new landing page is live at [now]. */
export function newHomeLive(now: Date = new Date()): boolean {
  return now.getTime() >= Date.parse(NEW_HOME_FROM)
}

/** The same in a browser, where `?preview=1` shows it early. */
export function newHomeShown(search: string, now: Date = new Date()): boolean {
  return newHomeLive(now) || new URLSearchParams(search).get('preview') === '1'
}
