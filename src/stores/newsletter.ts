import { defineStore } from 'pinia'

// The newsletter runs on the sandbox backend, apart from Bookmarko's production
// data, so it has its own base URL (set in .github/workflows/deploy.yml).
export const NEWSLETTER_API_BASE_URL = (
  import.meta.env.VITE_NEWSLETTER_API_BASE_URL ??
  import.meta.env.VITE_API_BASE_URL ??
  'http://localhost:3000'
).replace(/\/$/, '')

export type SubscribeResult =
  | { success: true }
  | { success: false; error: string; suggestion?: string }

// Idan's personal newsletter (tasks/IDAN_NEWSLETTER.md). Single opt in: a 200
// means the reader is on the list. The API never says whether they already
// were. A 422 is about the address itself: a likely typo (with a suggestion)
// or a domain that can't receive mail.
export const useNewsletterStore = defineStore('newsletter', {
  actions: {
    async subscribe(params: {
      email: string
      firstName: string
      source: string
      website: string
      keepEmail?: boolean
    }): Promise<SubscribeResult> {
      try {
        const res = await fetch(`${NEWSLETTER_API_BASE_URL}/newsletter/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
        })

        if (res.status === 429) {
          return { success: false, error: 'Too many attempts. Please wait a moment and try again.' }
        }
        if (!res.ok) {
          const data = await res.json().catch(() => null)
          const message = Array.isArray(data?.message) ? data.message[0] : data?.message
          return {
            success: false,
            error: message || 'Something went wrong. Please try again.',
            suggestion: typeof data?.suggestion === 'string' ? data.suggestion : undefined,
          }
        }
        return { success: true }
      } catch {
        return {
          success: false,
          error: "Couldn't reach the server. An ad blocker or VPN can get in the way, so try turning it off.",
        }
      }
    },
  },
})
