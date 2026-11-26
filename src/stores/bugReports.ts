import { defineStore } from 'pinia'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '')

/** Write only: bug reports are private and never read back on the website. */
export const useBugReportStore = defineStore('bugReports', {
  state: () => ({
    submitting: false,
    submitError: null as string | null,
    submitted: false,
  }),

  actions: {
    async submit(title: string, body: string, email: string, honeypot: string) {
      this.submitting = true
      this.submitError = null
      this.submitted = false
      try {
        const res = await fetch(`${API_BASE_URL}/bug-reports`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, body, email, website: honeypot }),
        })
        if (res.status === 429) {
          this.submitError = 'You have sent a few reports already. Try again tomorrow.'
          return false
        }
        if (res.status === 400) {
          this.submitError = 'Please check the email address, or leave it empty.'
          return false
        }
        if (!res.ok) throw new Error(`Request failed (${res.status})`)
        this.submitted = true
        return true
      } catch {
        this.submitError = 'Something went wrong. Please try again.'
        return false
      } finally {
        this.submitting = false
      }
    },

    reset() {
      this.submitted = false
      this.submitError = null
    },
  },
})
