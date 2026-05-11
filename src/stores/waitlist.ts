import { defineStore } from 'pinia'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '')

type JoinResponse = {
  success: true
  alreadyJoined: boolean
}

export const useWaitlistStore = defineStore('waitlist', {
  state: () => ({
    isSubmitting: false,
    alreadyJoined: false,
    error: null as string | null,
  }),
  actions: {
    async joinWaitlist(email: string, newsletter: boolean) {
      this.isSubmitting = true
      this.error = null
      this.alreadyJoined = false

      try {
        const res = await fetch(`${API_BASE_URL}/waitlist`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, newsletter, source: 'website' }),
        })

        if (res.status === 429) {
          this.error = 'Too many attempts. Please wait a moment and try again.'
          return { success: false as const }
        }

        if (!res.ok) {
          const data = await res.json().catch(() => null)
          this.error =
            (Array.isArray(data?.message) ? data.message[0] : data?.message) ||
            'Failed to join waitlist. Please try again.'
          return { success: false as const }
        }

        const data = (await res.json()) as JoinResponse
        this.alreadyJoined = data.alreadyJoined
        return { success: true as const, alreadyJoined: data.alreadyJoined }
      } catch {
        this.error = 'Network error. Please check your connection and try again.'
        return { success: false as const }
      } finally {
        this.isSubmitting = false
      }
    },
  },
})
