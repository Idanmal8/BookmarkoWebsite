/**
 * Pieces shared by the static-page generator (`seo.ts`) and the AMP generator
 * (`amp.ts`). They live here rather than in `seo.ts` so `amp.ts` can use them
 * without the two modules importing each other in a cycle.
 */

export const ORIGIN = 'https://bookmark-o.com'
export const OG_DEFAULT = `${ORIGIN}/og-welcome.png`

/**
 * Absolute URL for a route, always trailing-slashed.
 *
 * GitHub Pages serves `/blog` as a 301 to `/blog/` (it's really
 * `/blog/index.html`). Declaring the un-slashed form as canonical points
 * Google at a URL that immediately redirects back to the page declaring it,
 * which shows up as "Page with redirect" and burns crawl budget. Every URL we
 * emit — canonical, og:url, breadcrumbs, sitemap, amphtml — uses the form
 * Pages actually serves.
 */
export const urlFor = (route: string) => `${ORIGIN}${route === '/' ? '/' : `${route}/`}`

export const esc = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

/** Collapse to a single line and cut on a word boundary near `max`. */
export function clamp(text: string, max = 158): string {
  const flat = text.replace(/\s+/g, ' ').trim()
  if (flat.length <= max) return flat
  const cut = flat.slice(0, max)
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`
}

export interface ApiPost {
  title: string | null
  slug: string | null
  excerpt: string | null
  body: string | null
  bookTitle: string
  bookAuthor: string | null
  coverImageUrl: string | null
  publishedAt: string | null
  /** Bookshop.org affiliate link, resolved server-side. Null when unpurchasable. */
  affiliateUrl: string | null
}
