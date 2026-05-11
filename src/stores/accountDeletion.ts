import { defineStore } from 'pinia'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '')

type VerifyResponse = { valid: boolean; email?: string }

export const useAccountDeletionStore = defineStore('accountDeletion', {
  state: () => ({
    isSubmitting: false,
    requestSent: false,
    isVerifying: false,
    isConfirming: false,
    tokenValid: null as boolean | null,
    maskedEmail: null as string | null,
    confirmed: false,
    error: null as string | null,
  }),
  actions: {
    async requestDeletion(email: string) {
      this.isSubmitting = true
      this.error = null
      try {
        const res = await fetch(`${API_BASE_URL}/account-deletion/request`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        })
        if (res.status === 429) {
          this.error = 'Too many attempts. Please wait a moment and try again.'
          return false
        }
        if (!res.ok) {
          const data = await res.json().catch(() => null)
          this.error =
            (Array.isArray(data?.message) ? data.message[0] : data?.message) ||
            'Something went wrong. Please try again.'
          return false
        }
        // Backend always returns generic success regardless of email existence.
        this.requestSent = true
        return true
      } catch {
        this.error = 'Network error. Please check your connection and try again.'
        return false
      } finally {
        this.isSubmitting = false
      }
    },

    async verifyToken(token: string) {
      this.isVerifying = true
      this.error = null
      this.tokenValid = null
      this.maskedEmail = null
      try {
        const url = new URL(`${API_BASE_URL}/account-deletion/verify`)
        url.searchParams.set('token', token)
        const res = await fetch(url.toString())
        if (!res.ok) {
          this.tokenValid = false
          return
        }
        const data = (await res.json()) as VerifyResponse
        this.tokenValid = Boolean(data.valid)
        this.maskedEmail = data.email ?? null
      } catch {
        this.tokenValid = false
        this.error = 'Network error. Please check your connection and try again.'
      } finally {
        this.isVerifying = false
      }
    },

    async confirmDeletion(token: string) {
      this.isConfirming = true
      this.error = null
      try {
        const res = await fetch(`${API_BASE_URL}/account-deletion/confirm`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        })
        if (res.status === 429) {
          this.error = 'Too many attempts. Please wait a moment and try again.'
          return false
        }
        if (!res.ok) {
          const data = await res.json().catch(() => null)
          this.error =
            (Array.isArray(data?.message) ? data.message[0] : data?.message) ||
            'This confirmation link is invalid or has expired.'
          return false
        }
        this.confirmed = true
        return true
      } catch {
        this.error = 'Network error. Please check your connection and try again.'
        return false
      } finally {
        this.isConfirming = false
      }
    },
  },
})
