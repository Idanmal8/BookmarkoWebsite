/**
 * AMP (Accelerated Mobile Pages) generator for blog posts.
 *
 * Per Google's AMP guidance, an AMP page is a *variant* of a normal page, not
 * a page in its own right: the two must carry the same content, the AMP copy
 * points at the canonical copy with `rel=canonical`, and the canonical copy
 * points back with `rel=amphtml`. Only the canonical URL is indexed and only
 * it goes in the sitemap.
 *
 * Only blog posts get an AMP variant. AMP forbids author JavaScript, so the
 * interactive routes (the landing page, /roadmap, /delete-account) can't have
 * a valid AMP variant that still does what they do — and a variant that drops
 * the interaction would break AMP's content-parity requirement.
 *
 * AMP validity is enforced at build time by `assertValidAmp()` below, so a
 * change to the markdown renderer that emits something AMP rejects fails the
 * build instead of shipping an invalid variant.
 */
import { renderMarkdown } from '../src/utils/markdown'
import { ORIGIN, OG_DEFAULT, urlFor, esc, clamp, type ApiPost } from './seo-shared'

/** The AMP variant of `/blog/:slug` lives at `/blog/:slug/amp`. */
export const ampRouteFor = (route: string) => `${route}/amp`

/**
 * The AMP boilerplate. Required verbatim in every AMP document: it hides the
 * body until the AMP runtime has booted, and un-hides it after 8s if the
 * runtime never arrives. The validator compares this byte-for-byte, so do not
 * reformat it.
 */
const BOILERPLATE =
  '<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;' +
  '-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;' +
  '-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;' +
  'animation:-amp-start 8s steps(1,end) 0s 1 normal both}' +
  '@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}' +
  '@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}' +
  '@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}' +
  '@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}' +
  '@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>' +
  '<noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;' +
  '-ms-animation:none;animation:none}</style></noscript>'

/**
 * The whole stylesheet, inlined — AMP allows exactly one `<style amp-custom>`
 * and no external stylesheets other than a handful of whitelisted font
 * providers (fonts.googleapis.com is one, which is why the site's two faces
 * survive the port). Budget is 75KB; this is ~2KB.
 *
 * `!important` is banned by the AMP validator, so every rule here has to win
 * on specificity alone. Colours mirror BlogPost.vue so the AMP copy reads as
 * the same page.
 */
const STYLES = `
:root{--accent:#6c4cf1;--ink:#1a1a2e;--ink-soft:#55556a;--ink-mute:#9a9ab0;--paper:#faf9fc;--line:#ececf3}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--paper);color:var(--ink);font-family:'Raleway',system-ui,-apple-system,sans-serif;line-height:1.6;-webkit-font-smoothing:antialiased}
main{max-width:44rem;margin:0 auto;padding:1.5rem 1.25rem 4rem}
header.site{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:1rem 1.25rem;border-bottom:1px solid var(--line)}
header.site a{color:var(--accent);font-weight:700;font-size:1.05rem;text-decoration:none}
header.site .back{color:var(--ink-soft);font-weight:500;font-size:.85rem}
h1{font-family:'EB Garamond',Georgia,serif;font-size:2.1rem;line-height:1.2;margin:1.5rem 0 .75rem;color:var(--ink)}
.meta{color:var(--ink-mute);font-size:.85rem;margin-bottom:1.5rem}
.meta .book{color:var(--ink-soft)}
.cover{margin:0 0 2rem;max-width:18rem}
article h1,article h2,article h3,article h4{font-family:'EB Garamond',Georgia,serif;color:var(--ink);line-height:1.25;margin:2rem 0 .75rem}
article h1{font-size:1.75rem}
article h2{font-size:1.45rem}
article h3{font-size:1.2rem}
article h4{font-size:1.05rem}
article p{margin:0 0 1.15rem;color:var(--ink-soft);font-size:1.05rem}
article ul{margin:0 0 1.15rem 1.25rem;color:var(--ink-soft)}
article li{margin:0 0 .4rem}
article blockquote{margin:0 0 1.15rem;padding:.75rem 1.1rem;border-left:3px solid var(--accent);background:#f6f4ff;color:var(--ink);font-family:'EB Garamond',Georgia,serif;font-size:1.15rem}
article a{color:var(--accent)}
article code{background:#f1f0fb;border-radius:.3rem;padding:.1rem .35rem;font-size:.9em}
article strong{color:var(--ink)}
.cta{margin-top:2.5rem;padding-top:1.5rem;border-top:1px solid var(--line)}
.cta p{color:var(--ink-soft);font-size:.95rem;margin-bottom:1rem}
.cta a{display:inline-block;background:var(--accent);color:#fff;text-decoration:none;font-weight:600;font-size:.9rem;padding:.65rem 1.1rem;border-radius:.65rem;margin:0 .5rem .5rem 0}
footer.site{border-top:1px solid var(--line);padding:1.5rem 1.25rem;color:var(--ink-mute);font-size:.8rem;text-align:center}
footer.site a{color:var(--ink-soft)}
`.trim()

/**
 * Structural AMP validation.
 *
 * This is not the full `amphtml-validator` (that's a ~3MB dependency pulled
 * over the network at build time, and the deploy already refuses to fail on a
 * blog outage). It checks the rules we can actually break from this codebase:
 * a missing required tag, author JavaScript sneaking in, a raw `<img>`, or an
 * `!important` in the stylesheet. For the authoritative answer run
 * `npm run build && npm run validate:amp`, which pulls the real
 * `amphtml-validator` via npx and checks every generated page.
 */
export function assertValidAmp(html: string, where: string): void {
  const problems: string[] = []

  if (!/<html amp lang=/.test(html)) problems.push('missing the `amp` attribute on <html>')
  if (!html.includes('<meta charset="utf-8">')) problems.push('missing <meta charset="utf-8">')
  if (!html.includes('https://cdn.ampproject.org/v0.js')) problems.push('missing the AMP runtime script')
  if (!html.includes('<style amp-boilerplate>')) problems.push('missing the AMP boilerplate')
  if (!/<link rel="canonical" href="[^"]+"/.test(html)) problems.push('missing rel=canonical')
  if (!/<meta name="viewport" content="width=device-width/.test(html)) problems.push('missing the viewport meta')

  // Exactly one amp-custom stylesheet, under the 75KB cap, with no !important.
  const custom = /<style amp-custom>([\s\S]*?)<\/style>/.exec(html)
  if (!custom) problems.push('missing <style amp-custom>')
  else {
    if (Buffer.byteLength(custom[1], 'utf8') > 75_000) problems.push('amp-custom stylesheet exceeds 75KB')
    if (custom[1].includes('!important')) problems.push('amp-custom uses !important, which AMP forbids')
  }

  // Author JavaScript is banned. The only <script> tags allowed here are the
  // AMP runtime (async, from the AMP CDN) and JSON-LD.
  for (const [, attrs] of html.matchAll(/<script\b([^>]*)>/g)) {
    const isRuntime = attrs.includes('cdn.ampproject.org')
    const isJsonLd = attrs.includes('application/ld+json')
    if (!isRuntime && !isJsonLd) problems.push(`disallowed <script${attrs}>`)
  }

  // Raw <img>/<video>/<iframe> must be their amp-* equivalents.
  for (const tag of ['img', 'video', 'iframe', 'audio']) {
    if (new RegExp(`<${tag}\\b`).test(html)) problems.push(`raw <${tag}> must be <amp-${tag}>`)
  }

  if (problems.length) {
    throw new Error(`[amp] invalid AMP document for ${where}:\n  - ${problems.join('\n  - ')}`)
  }
}

/**
 * Convert rendered post markup into AMP-safe markup.
 *
 * `renderMarkdown` escapes its input and emits a fixed subset of tags (headings,
 * p, ul/li, blockquote, a, strong, em, code) — every one of which AMP allows —
 * so there is nothing to rewrite today. The guard stays because the renderer is
 * shared with the Vue app: if it ever learns image or embed syntax, this is
 * where that has to be translated, and `assertValidAmp` fails the build until
 * it is.
 */
function ampBody(html: string): string {
  return html.replace(/<img\b([^>]*?)\/?>/g, (_m, attrs) => `<amp-img${attrs} layout="responsive"></amp-img>`)
}

/** The full AMP document for one blog post. */
export function ampDocument(post: ApiPost): string {
  const slug = post.slug as string
  const route = `/blog/${slug}`
  const canonical = urlFor(route)
  const ampUrl = urlFor(ampRouteFor(route))
  const title = post.title || post.bookTitle
  const description = clamp(
    post.excerpt || `A review of ${post.bookTitle}${post.bookAuthor ? ` by ${post.bookAuthor}` : ''}.`,
  )
  const image = post.coverImageUrl || OG_DEFAULT

  // Same @graph as the canonical page, with mainEntityOfPage still pointing at
  // the canonical URL — the AMP copy is a rendition of that page, not a second
  // article.
  const graph = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', '@id': `${ORIGIN}/#org`, name: 'Bookmarko', url: `${ORIGIN}/`, logo: OG_DEFAULT },
      {
        '@type': 'BlogPosting',
        headline: title,
        description,
        image,
        datePublished: post.publishedAt ?? undefined,
        author: { '@id': `${ORIGIN}/#org` },
        publisher: { '@id': `${ORIGIN}/#org` },
        mainEntityOfPage: canonical,
        about: {
          '@type': 'Book',
          name: post.bookTitle,
          ...(post.bookAuthor ? { author: { '@type': 'Person', name: post.bookAuthor } } : {}),
        },
      },
    ],
  })

  const cover = post.coverImageUrl
    ? `<amp-img class="cover" src="${esc(post.coverImageUrl)}" alt="${esc(post.bookTitle)} cover" ` +
      'width="400" height="600" layout="responsive"></amp-img>'
    : ''

  const html = `<!doctype html>
<html amp lang="en">
<head>
<meta charset="utf-8">
<script async src="https://cdn.ampproject.org/v0.js"></script>
<title>${esc(title)} | Bookmarko</title>
<link rel="canonical" href="${canonical}">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="${esc(description)}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Bookmarko">
<meta property="og:locale" content="en_US">
<meta property="og:url" content="${canonical}">
<meta property="og:title" content="${esc(title)} | Bookmarko">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${esc(image)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:url" content="${canonical}">
<meta name="twitter:title" content="${esc(title)} | Bookmarko">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${esc(image)}">
<link rel="icon" href="${ORIGIN}/favicon.ico" sizes="any">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600&family=Raleway:wght@400;500;600;700&display=swap" rel="stylesheet">
<script type="application/ld+json">${graph}</script>
${BOILERPLATE}
<style amp-custom>${STYLES}</style>
</head>
<body>
<header class="site">
<a href="${ORIGIN}/">Bookmarko</a>
<a class="back" href="${canonical}">Read on bookmark-o.com →</a>
</header>
<main>
<article>
<h1>${esc(title)}</h1>
<p class="meta"><span class="book">${esc(post.bookTitle)}${post.bookAuthor ? ` · ${esc(post.bookAuthor)}` : ''}</span>${
    post.publishedAt ? ` · <time datetime="${post.publishedAt}">${post.publishedAt.slice(0, 10)}</time>` : ''
  }</p>
${cover}
${ampBody(post.body ? renderMarkdown(post.body) : '')}
</article>
<div class="cta">
<p>Bookmarko is a calm reading tracker for your books and saved articles.</p>
<a href="https://apps.apple.com/us/app/bookmarko/id6762641879">Download on the App Store</a>
<a href="https://play.google.com/store/apps/details?id=com.idanmal.bookmarko">Get it on Google Play</a>
</div>
</main>
<footer class="site">
<a href="${canonical}">View the full version of this page</a> · <a href="${ORIGIN}/blog/">More from the Bookmarko blog</a>
</footer>
</body>
</html>
`

  assertValidAmp(html, ampUrl)
  return html
}
