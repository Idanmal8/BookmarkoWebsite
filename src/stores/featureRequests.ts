import { defineStore } from 'pinia'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '')

export type FeatureRequestStatus = 'pending' | 'todo' | 'in_progress' | 'done' | 'aired'

export interface FeatureRequest {
  id: string
  title: string
  body: string
  status: FeatureRequestStatus
  upvotes: number
  createdAt: string
}

/** Public board shape: only the four public columns, never `pending`. */
export interface Board {
  todo: FeatureRequest[]
  in_progress: FeatureRequest[]
  done: FeatureRequest[]
  aired: FeatureRequest[]
}

const emptyBoard = (): Board => ({ todo: [], in_progress: [], done: [], aired: [] })

// Remember which requests this browser has already upvoted so the UI can show
// the button as "voted" and avoid a pointless round-trip. The server's
// (request, ip) unique constraint is the real enforcement.
const VOTED_STORAGE = 'bookmarko_voted_requests'
const loadVoted = (): Set<string> => {
  try {
    return new Set(JSON.parse(localStorage.getItem(VOTED_STORAGE) ?? '[]'))
  } catch {
    return new Set()
  }
}

export const useFeatureRequestStore = defineStore('featureRequests', {
  state: () => ({
    board: emptyBoard(),
    loading: false,
    error: null as string | null,

    // Submit form
    submitting: false,
    submitError: null as string | null,
    submitted: false,

    // Local vote memory
    voted: loadVoted(),
  }),

  getters: {
    hasVoted: (state) => (id: string) => state.voted.has(id),
  },

  actions: {
    // ── Public ────────────────────────────────────────────────────────────────

    async fetchBoard() {
      this.loading = true
      this.error = null
      try {
        const res = await fetch(`${API_BASE_URL}/feature-requests`)
        if (!res.ok) throw new Error(`Request failed (${res.status})`)
        this.board = { ...emptyBoard(), ...((await res.json()) as Partial<Board>) }
      } catch {
        this.error = 'Could not load the board. Please try again later.'
      } finally {
        this.loading = false
      }
    },

    async submit(title: string, body: string, honeypot: string) {
      this.submitting = true
      this.submitError = null
      this.submitted = false
      try {
        const res = await fetch(`${API_BASE_URL}/feature-requests`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // `website` is the honeypot — always sent, empty for real users.
          body: JSON.stringify({ title, body, website: honeypot }),
        })
        if (res.status === 429) {
          this.submitError = 'You have sent a few requests already — try again tomorrow.'
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

    async upvote(id: string) {
      if (this.voted.has(id)) return
      // Optimistic: bump locally, remember the vote, roll back on failure.
      this.voted.add(id)
      localStorage.setItem(VOTED_STORAGE, JSON.stringify([...this.voted]))
      const item = this.findInBoard(id)
      if (item) item.upvotes += 1

      try {
        const res = await fetch(`${API_BASE_URL}/feature-requests/${id}/upvote`, {
          method: 'POST',
        })
        if (!res.ok) throw new Error(`Request failed (${res.status})`)
        const data = (await res.json()) as { upvotes: number }
        if (item) item.upvotes = data.upvotes
      } catch {
        // Roll back the optimistic bump.
        if (item) item.upvotes = Math.max(0, item.upvotes - 1)
        this.voted.delete(id)
        localStorage.setItem(VOTED_STORAGE, JSON.stringify([...this.voted]))
      }
    },

    findInBoard(id: string): FeatureRequest | undefined {
      for (const col of Object.values(this.board)) {
        const found = col.find((r) => r.id === id)
        if (found) return found
      }
      return undefined
    },
  },
})
