/**
 * Content for Idan's link-in-bio page at `/idan` (`LinkPage.vue`).
 *
 * This is the whole "admin panel": edit this file and push to `main`.
 * Links render top-to-bottom as a stack of books; each gets its own spine colour.
 */

export interface LinkItem {
  /** Stable id, sent to analytics as `link_id`. */
  id: string
  title: string
  /** Short line under the title. */
  subtitle?: string
  url: string
  /** Emoji shown on the spine. */
  icon: string
  /** Spine colour. Pick from `SPINES` or any CSS colour. */
  spine: string
  /** Optional little sticker, e.g. "new". */
  tag?: string
}

export interface SocialItem {
  id: 'instagram' | 'tiktok' | 'youtube' | 'x' | 'linkedin' | 'github' | 'threads' | 'email'
  url: string
  label: string
}

export const SPINES = {
  blue: '#5170ff',
  pink: '#FF4F8B',
  ink: '#14193A',
  sky: '#A5C2F4',
  mint: '#3FBF9B',
  sun: '#F5B83D',
} as const

export const profile = {
  name: 'Idan Malka',
  bio: 'Mobile engineer, book lover, building Bookmarko in public.',
  avatar: '/links/avatar.jpg', // 336px = 3x the 112px display size, pre-sharpened
  /** Little "currently reading" card. Set to `null` to hide it. */
  currentlyReading: null as null | { title: string; author: string; url?: string },
}

export const links: LinkItem[] = [
  {
    id: 'bookmarko-app',
    title: 'Get Bookmarko',
    subtitle: 'The reading tracker I built. iOS & Android',
    url: '/get?ref=idan',
    icon: '📚',
    spine: SPINES.blue,
    tag: 'my app',
  },
  {
    id: 'patreon-mobile-guide',
    title: 'Build your own mobile app',
    subtitle: 'My step-by-step guide, on Patreon',
    url: 'https://www.patreon.com/IdanMalka/posts/build-your-own-174505343',
    icon: '🛠️',
    spine: SPINES.mint,
    tag: 'guide',
  },
  {
    id: 'amazon-picks',
    title: 'My Amazon picks',
    subtitle: 'The books I keep recommending',
    url: '/idan/picks',
    icon: '📖',
    spine: '#FF8A5B',
    tag: 'new',
  },
  {
    id: 'newsletter',
    title: 'My newsletter',
    subtitle: 'Building an audience from zero, in the open',
    url: '/newsletter',
    icon: '✉️',
    spine: SPINES.pink,
  },
  {
    id: 'bookshop',
    title: 'My bookshop',
    subtitle: 'Books I recommend, supporting indie stores',
    url: 'https://bookshop.org/shop/Bookmarko',
    icon: '🛍️',
    spine: SPINES.sun,
  },
]

/**
 * Social icons row. Empty entries are not rendered, so fill in the ones you use.
 * TODO(Idan): add your real profile URLs.
 */
export const socials: SocialItem[] = [
  // { id: 'instagram', label: 'Instagram', url: 'https://instagram.com/…' },
  // { id: 'tiktok', label: 'TikTok', url: 'https://tiktok.com/@…' },
  // { id: 'youtube', label: 'YouTube', url: 'https://youtube.com/@…' },
  // { id: 'x', label: 'X', url: 'https://x.com/…' },
  // { id: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com/in/…' },
  // { id: 'github', label: 'GitHub', url: 'https://github.com/Idanmal8' },
]
