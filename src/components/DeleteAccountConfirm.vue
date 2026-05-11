<template>
  <section class="delete-section">
    <div class="container delete-container">
      <div v-if="store.isVerifying" class="state-card">
        <p>Verifying your link…</p>
      </div>

      <div v-else-if="store.tokenValid === false && !store.confirmed" class="state-card error-card">
        <h1>This link is invalid or expired</h1>
        <p>
          Confirmation links expire 30 minutes after they're sent and can only be used once.
        </p>
        <a href="/delete-account" class="btn-link">Request a new link</a>
      </div>

      <div v-else-if="store.confirmed" class="state-card success-card">
        <h1>Your account has been deleted</h1>
        <p>
          Your Bookmarko account and all associated data have been permanently removed. We're sorry
          to see you go.
        </p>
      </div>

      <div v-else-if="store.tokenValid === true" class="state-card">
        <h1>Confirm account deletion</h1>
        <p class="lead">
          You're about to permanently delete the Bookmarko account associated with
          <strong v-if="store.maskedEmail">{{ store.maskedEmail }}</strong>.
        </p>
        <p class="lead muted">
          This will erase your library, lists, reviews, posts, and reading history. This cannot be
          undone.
        </p>
        <div class="action-row">
          <button class="btn-secondary" @click="cancel" :disabled="store.isConfirming">
            Cancel
          </button>
          <button class="btn-danger" @click="confirm" :disabled="store.isConfirming">
            {{ store.isConfirming ? 'Deleting…' : 'Yes, delete my account' }}
          </button>
        </div>
        <p v-if="store.error" class="error-msg">{{ store.error }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAccountDeletionStore } from '../stores/accountDeletion'

const store = useAccountDeletionStore()

const params = new URLSearchParams(window.location.search)
const token = params.get('token') ?? ''

onMounted(async () => {
  if (!token) {
    store.tokenValid = false
    return
  }
  await store.verifyToken(token)
})

async function confirm() {
  if (!token || store.isConfirming) return
  await store.confirmDeletion(token)
}

function cancel() {
  window.location.href = '/'
}
</script>

<style scoped>
.delete-section {
  padding: 4rem 0 6rem;
}

.delete-container {
  max-width: 640px;
}

.state-card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 2rem;
}

h1 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: var(--text);
}

.lead {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
  line-height: 1.65;
}

.lead.muted {
  color: #c0392b;
  font-weight: 600;
  margin-bottom: 1.75rem;
}

.action-row {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.btn-danger {
  background: #c0392b;
  color: var(--white);
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 0.95rem;
}

.btn-danger:hover:not(:disabled) {
  background: #a93226;
}

.btn-danger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: var(--bg);
  color: var(--text);
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 0.95rem;
  border: 1px solid var(--border);
}

.btn-secondary:hover:not(:disabled) {
  background: #f0f1f4;
}

.btn-link {
  display: inline-block;
  margin-top: 1rem;
  color: var(--primary);
  text-decoration: none;
  font-weight: 600;
}

.btn-link:hover {
  text-decoration: underline;
}

.error-card h1 {
  color: #c0392b;
}

.success-card h1 {
  color: #1f8b4c;
}

.error-msg {
  margin-top: 0.75rem;
  color: #c0392b;
  font-size: 0.9rem;
}
</style>
