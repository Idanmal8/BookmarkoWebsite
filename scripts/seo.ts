/**
 * Build-time static page generator.
 *
 * GitHub Pages has no SPA rewrite, so every path except `/` used to fall
 * through to `404.html` — which answers with a real HTTP 404. Browsers
 * survived that (404.html re-encodes the path and bounces to `/`), but a
 * crawler reads the status code and drops the URL, so none of /blog,
 * /blog/:slug, /changelog or /roadmap could ever be indexed.
 *
 * The fix is to emit a real `dist/<route>/index.html` for every known route.
 * Pages then serves them with a 200, and each copy carries its own title,
 * description, canonical, social tags and JSON-LD. Blog posts additionally
 * ship their rendered body in the HTML, so the content is crawlable without
 * JavaScript. Vue discards that markup when it mounts over `#app`.
 *
 * `404.html` stays as the fallback for paths we don't know about.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import type { Plugin } from 'vite'
import { renderMarkdown } from '../src/utils/markdown'

const ORIGIN = 'https://bookmark-o.com'
const OG_DEFAULT = `${ORIGIN}/og-welcome.png`

/**
 * Absolute URL for a route, always trailing-slashed.
 *
 * GitHub Pages serves `/blog` as a 301 to `/blog/` (it's really
 * `/blog/index.html`). Declaring the un-slashed form as canonical points
 * Google at a URL that immediately redirects back to the page declaring it,
 * which shows up as "Page with redirect" and burns crawl budget. Every URL we
 * emit — canonical, og:url, breadcrumbs, sitemap — uses the form Pages
 * actually serves.
 */
const urlFor = (route: string) => `${ORIGIN}${route === '/' ? '/' : `${route}/`}`

interface ApiPost {
  title: string | null
  slug: string | null
  excerpt: string | null
  body: string | null
  bookTitle: string
  bookAuthor: string | null
  coverImageUrl: string | null
  publishedAt: string | null
}

interface Page {
  /** Route path, always leading-slash and never trailing-slash (except '/'). */
  route: string
  title: string
  description: string
  /** Absolute URL of the social image. */
  image: string
  /** 'website' | 'article' */
  ogType: string
  /** Extra schema.org nodes merged into the page's @graph. */
  jsonLd: unknown[]
  /** Server-rendered markup placed inside #app for crawlers. */
  body?: string
  /** Keep the page out of the index (and out of the sitemap). */
  noindex?: boolean
  /** Last modification date for the sitemap, ISO-8601. */
  lastmod?: string
}

const esc = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

/** Collapse to a single line and cut on a word boundary near `max`. */
function clamp(text: string, max = 158): string {
  const flat = text.replace(/\s+/g, ' ').trim()
  if (flat.length <= max) return flat
  const cut = flat.slice(0, max)
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`
}

function breadcrumb(trail: { name: string; route: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: urlFor(t.route),
    })),
  }
}

async function fetchPosts(apiBase: string | undefined): Promise<ApiPost[]> {
  if (!apiBase) return []
  try {
    const res = await fetch(`${apiBase.replace(/\/$/, '')}/blog?limit=200`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = (await res.json()) as { posts: ApiPost[] }
    return data.posts.filter((p) => p.slug)
  } catch (err) {
    // A blog outage must not fail the deploy — we just ship without post pages
    // this time and pick them up on the next build.
    console.warn(`[seo] could not fetch blog posts, skipping post pages: ${err}`)
    return []
  }
}

function postPage(post: ApiPost): Page {
  const slug = post.slug as string
  const route = `/blog/${slug}`
  const title = post.title || post.bookTitle
  const description = clamp(
    post.excerpt || `A review of ${post.bookTitle}${post.bookAuthor ? ` by ${post.bookAuthor}` : ''}.`,
  )
  const image = post.coverImageUrl || OG_DEFAULT
  const bodyHtml = post.body ? renderMarkdown(post.body) : ''

  return {
    route,
    title: `${title} | Bookmarko`,
    description,
    image,
    ogType: 'article',
    lastmod: post.publishedAt ?? undefined,
    jsonLd: [
      {
        '@type': 'BlogPosting',
        headline: title,
        description,
        image,
        datePublished: post.publishedAt ?? undefined,
        author: { '@id': `${ORIGIN}/#org` },
        publisher: { '@id': `${ORIGIN}/#org` },
        mainEntityOfPage: urlFor(route),
        about: {
          '@type': 'Book',
          name: post.bookTitle,
          ...(post.bookAuthor ? { author: { '@type': 'Person', name: post.bookAuthor } } : {}),
        },
      },
      breadcrumb([
        { name: 'Home', route: '/' },
        { name: 'Blog', route: '/blog' },
        { name: title, route },
      ]),
    ],
    body: [
      '<article>',
      `<h1>${esc(title)}</h1>`,
      `<p>${esc(post.bookTitle)}${post.bookAuthor ? ` · ${esc(post.bookAuthor)}` : ''}</p>`,
      post.publishedAt ? `<time datetime="${post.publishedAt}">${post.publishedAt.slice(0, 10)}</time>` : '',
      post.coverImageUrl
        ? `<img src="${esc(post.coverImageUrl)}" alt="${esc(post.bookTitle)} cover" width="400" height="600" />`
        : '',
      bodyHtml,
      '</article>',
    ].join(''),
  }
}

function staticPages(posts: ApiPost[]): Page[] {
  const blogList = posts
    .map((p) => `<li><a href="/blog/${encodeURIComponent(p.slug as string)}/">${esc(p.title || p.bookTitle)}</a></li>`)
    .join('')

  return [
    {
      route: '/blog',
      title: 'Book Reviews & Reading Notes | Bookmarko Blog',
      description:
        'Honest reviews and reading notes from the Bookmarko shelf: fiction, sci-fi, thrillers and the occasional business book worth finishing.',
      image: OG_DEFAULT,
      ogType: 'website',
      jsonLd: [
        {
          '@type': 'Blog',
          name: 'Bookmarko Blog',
          url: urlFor('/blog'),
          publisher: { '@id': `${ORIGIN}/#org` },
        },
        breadcrumb([
          { name: 'Home', route: '/' },
          { name: 'Blog', route: '/blog' },
        ]),
      ],
      body: `<h1>Bookmarko Blog</h1><ul>${blogList}</ul>`,
    },
    {
      route: '/changelog',
      title: "What's New in Bookmarko | Changelog",
      description:
        'Every Bookmarko release, in plain language: new shelves, Goodreads import improvements, Ginie recommendations and the fixes in between.',
      image: OG_DEFAULT,
      ogType: 'website',
      jsonLd: [
        breadcrumb([
          { name: 'Home', route: '/' },
          { name: 'Changelog', route: '/changelog' },
        ]),
      ],
      body: '<h1>Bookmarko Changelog</h1><p>Every Bookmarko release, in plain language.</p>',
    },
    {
      route: '/roadmap',
      title: 'Feature Requests & Roadmap | Bookmarko',
      description:
        "See what readers have asked for and what's being built next in Bookmarko. Vote on a request or add your own. No account needed.",
      image: OG_DEFAULT,
      ogType: 'website',
      jsonLd: [
        breadcrumb([
          { name: 'Home', route: '/' },
          { name: 'Roadmap', route: '/roadmap' },
        ]),
      ],
      body: '<h1>Bookmarko Roadmap</h1><p>What readers have asked for, and what is being built next.</p>',
    },
    // Store-compliance flows. They must answer 200 (Apple and Google check the
    // link), but they are dead ends for a searcher — hence noindex.
    {
      route: '/delete-account',
      title: 'Delete Your Bookmarko Account',
      description: 'Request deletion of your Bookmarko account and all associated reading data.',
      image: OG_DEFAULT,
      ogType: 'website',
      jsonLd: [],
      noindex: true,
    },
    {
      route: '/delete-account/confirm',
      title: 'Confirm Account Deletion | Bookmarko',
      description: 'Confirm deletion of your Bookmarko account.',
      image: OG_DEFAULT,
      ogType: 'website',
      jsonLd: [],
      noindex: true,
    },
    {
      route: '/newdesign',
      title: 'Bookmarko',
      description: 'Design staging area.',
      image: OG_DEFAULT,
      ogType: 'website',
      jsonLd: [],
      noindex: true,
    },
  ]
}

/**
 * Crawlable markup for the homepage.
 *
 * The other routes get their body from `staticPages()`, but `/` is the built
 * `index.html` itself, so it shipped an empty `#app` — no <h1>, no copy, on
 * the one page that matters most. Google does render JavaScript, but that is
 * a queued second pass, so the landing page was the weakest-indexed thing on
 * the site.
 *
 * This mirrors what Hero and the section headings actually render. Keep it
 * faithful to the components: prerendered markup that disagrees with the
 * mounted app reads as cloaking.
 */
const HOME_BODY = [
  '<h1>Welcome home, reader.</h1>',
  "<p>Bookmarko is the warm, well-lit shelf for everything you're reading. The novel by your bed, the longform you saved on the train, the chapter you keep meaning to finish. One place.</p>",
  '<h2>An endless shelf of every book you\u2019ve ever loved.</h2>',
  '<h2>Pour your Goodreads library straight onto your Bookmarko shelf.</h2>',
  '<h2>A librarian who lives in the lamp on your shelf.</h2>',
  '<p><a href="https://apps.apple.com/us/app/bookmarko/id6762641879">Download Bookmarko on the App Store</a>',
  ' · <a href="https://play.google.com/store/apps/details?id=com.idanmal.bookmarko">Get Bookmarko on Google Play</a></p>',
].join('')

function headFor(page: Page): string {
  const url = urlFor(page.route)
  const title = esc(page.title)
  const description = esc(page.description)
  const image = esc(page.image)
  const graph = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', '@id': `${ORIGIN}/#org`, name: 'Bookmarko', url: `${ORIGIN}/`, logo: OG_DEFAULT },
      ...page.jsonLd,
    ],
  })

  return [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    page.noindex ? '<meta name="robots" content="noindex, follow" />' : '',
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="${page.ogType}" />`,
    '<meta property="og:site_name" content="Bookmarko" />',
    '<meta property="og:locale" content="en_US" />',
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:image" content="${image}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:url" content="${url}" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    page.jsonLd.length ? `<script type="application/ld+json">${graph}</script>` : '',
  ]
    .filter(Boolean)
    .map((line) => `    ${line}`)
    .join('\n')
}

function sitemap(posts: ApiPost[]): string {
  const urls: { loc: string; lastmod?: string; priority: string }[] = [
    { loc: urlFor('/'), priority: '1.0' },
    { loc: urlFor('/blog'), priority: '0.8' },
    { loc: urlFor('/roadmap'), priority: '0.6' },
    { loc: urlFor('/changelog'), priority: '0.5' },
    { loc: `${ORIGIN}/privacy.html`, priority: '0.3' },
    { loc: `${ORIGIN}/terms.html`, priority: '0.3' },
    ...posts.map((p) => ({
      loc: urlFor(`/blog/${encodeURIComponent(p.slug as string)}`),
      lastmod: p.publishedAt ?? undefined,
      priority: '0.7',
    })),
  ]
  const body = urls
    .map(
      (u) =>
        `  <url>\n    <loc>${u.loc}</loc>\n` +
        (u.lastmod ? `    <lastmod>${u.lastmod.slice(0, 10)}</lastmod>\n` : '') +
        `    <priority>${u.priority}</priority>\n  </url>`,
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
}

export function seoPlugin(): Plugin {
  let outDir = 'dist'

  return {
    name: 'bookmarko-seo',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    async closeBundle() {
      const shell = await readFile(path.join(outDir, 'index.html'), 'utf8')
      if (!shell.includes('<!--seo-->')) {
        throw new Error('[seo] index.html is missing the <!--seo--> marker block')
      }

      const posts = await fetchPosts(process.env.VITE_API_BASE_URL)
      const pages = [...staticPages(posts), ...posts.map(postPage)]

      for (const page of pages) {
        const html = shell
          .replace(/<!--seo-->[\s\S]*?<!--\/seo-->/, `<!--seo-->\n${headFor(page)}\n    <!--/seo-->`)
          .replace('<div id="app"></div>', `<div id="app">${page.body ?? ''}</div>`)

        const dir = path.join(outDir, page.route)
        await mkdir(dir, { recursive: true })
        await writeFile(path.join(dir, 'index.html'), html)
      }

      // The homepage keeps the head block written by hand in index.html; only
      // its empty #app needs filling.
      const homePath = path.join(outDir, 'index.html')
      await writeFile(homePath, shell.replace('<div id="app"></div>', `<div id="app">${HOME_BODY}</div>`))

      await writeFile(path.join(outDir, 'sitemap.xml'), sitemap(posts))
      console.log(`[seo] wrote ${pages.length} static pages + sitemap.xml (${posts.length} blog posts)`)
    },
  }
}
