import { defineStore } from 'pinia'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '')

export interface BlogPost {
  id: string
  title: string | null
  slug: string | null
  excerpt: string | null
  body: string | null
  bookTitle: string
  bookAuthor: string | null
  bookId: string | null
  coverImageUrl: string | null
  rating: number | null
  publishedAt: string | null
  // Bookshop.org affiliate link, resolved server-side. Null when the book
  // isn't offerable (non-English — Bookshop's catalog is English-only).
  affiliateUrl: string | null
  // 'A' | 'B' | 'C' | 'D' — see tasks/AFFILIATE_STRATEGY.md. 'D' means the
  // link is a search rather than an exact title match.
  affiliateTier: string | null
  affiliateIsbn13: string | null
}

interface ListResponse {
  posts: BlogPost[]
  total: number
  page: number
  limit: number
}

export const useBlogStore = defineStore('blog', {
  state: () => ({
    posts: [] as BlogPost[],
    current: null as BlogPost | null,
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchList() {
      this.loading = true
      this.error = null
      try {
        const res = await fetch(`${API_BASE_URL}/blog?limit=50`)
        if (!res.ok) throw new Error(`Request failed (${res.status})`)
        const data = (await res.json()) as ListResponse
        this.posts = data.posts
      } catch {
        this.error = 'Could not load posts. Please try again later.'
      } finally {
        this.loading = false
      }
    },

    /**
     * Log an outbound affiliate click. Fire-and-forget: we never await it
     * before navigating, and a failure is swallowed — losing an analytics row
     * is far cheaper than delaying or blocking a sale.
     */
    trackAffiliateClick(post: BlogPost) {
      void fetch(`${API_BASE_URL}/affiliate/click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isbn13: post.affiliateIsbn13 ?? undefined,
          tier: post.affiliateTier ?? 'D',
          surface: 'BLOG_POST',
        }),
        keepalive: true,
      }).catch(() => {})
    },

    async fetchPost(slug: string) {
      this.loading = true
      this.error = null
      this.current = null
      try {
        const res = await fetch(`${API_BASE_URL}/blog/${encodeURIComponent(slug)}`)
        if (res.status === 404) {
          this.error = 'This post could not be found.'
          return
        }
        if (!res.ok) throw new Error(`Request failed (${res.status})`)
        this.current = (await res.json()) as BlogPost
      } catch {
        this.error = 'Could not load this post. Please try again later.'
      } finally {
        this.loading = false
      }
    },
  },
})
