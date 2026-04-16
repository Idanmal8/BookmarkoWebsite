import { defineStore } from 'pinia'

export const useWaitlistStore = defineStore('waitlist', {
  state: () => ({
    emails: [] as string[],
    isSubmitting: false,
    error: null as string | null,
  }),
  actions: {
    async joinWaitlist(email: string, newsletter: boolean) {
      this.isSubmitting = true
      this.error = null
      
      try {
        // In a real app, this would be an API call
        console.log('Submitting waitlist request:', { email, newsletter })
        
        // Simulating network delay
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        this.emails.push(email)
        return { success: true }
      } catch (err) {
        this.error = 'Failed to join waitlist. Please try again.'
        return { success: false }
      } finally {
        this.isSubmitting = false
      }
    }
  }
})
