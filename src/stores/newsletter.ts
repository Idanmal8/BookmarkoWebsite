import { defineStore } from 'pinia'

// The newsletter runs on the sandbox backend, apart from Bookmarko's production
// data, so it has its own base URL (set in .github/workflows/deploy.yml).
export const NEWSLETTER_API_BASE_URL = (
  import.meta.env.VITE_NEWSLETTER_API_BASE_URL ??
  import.meta.env.VITE_API_BASE_URL ??
  'http://localhost:3000'
).replace(/\/$/, '')

// Idan's personal newsletter (tasks/IDAN_NEWSLETTER.md). The API always answers
// { success: true } so the page never learns whether an address is already on
// the list; the confirm email is what actually adds someone.
export const useNewsletterStore = defineStore('newsletter', {
  actions: {
    async subscribe(params: { email: string; firstName: string; source: string; website: string }) {
      try {
        const res = await fetch(`${NEWSLETTER_API_BASE_URL}/newsletter/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
        })

        if (res.status === 429) {
          return { success: false as const, error: 'Too many attempts. Please wait a moment and try again.' }
        }
        if (!res.ok) {
          const data = await res.json().catch(() => null)
          const message = Array.isArray(data?.message) ? data.message[0] : data?.message
          return { success: false as const, error: message || 'Something went wrong. Please try again.' }
        }
        return { success: true as const }
      } catch {
        return {
          success: false as const,
          error: "Couldn't reach the server. An ad blocker or VPN can get in the way, so try turning it off.",
        }
      }
    },
  },
})
