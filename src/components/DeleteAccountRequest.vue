<template>
  <section class="delete-section">
    <div class="container delete-container">
      <h1>Delete your Bookmarko account</h1>
      <p class="lead">
        Enter the email address associated with your Bookmarko account. We'll send you a confirmation
        link. Clicking that link will <strong>permanently delete</strong> your account and all your
        data — including your library, lists, reviews, posts, and reading history.
      </p>

      <p class="lead muted">
        This action is irreversible. There is no recovery period.
      </p>

      <div v-if="!store.requestSent" class="delete-form">
        <div class="input-group">
          <input
            v-model="email"
            type="email"
            placeholder="Your account email"
            class="input-field"
            :disabled="store.isSubmitting"
            @keyup.enter="submit"
          />
          <button
            class="btn-danger"
            @click="submit"
            :disabled="store.isSubmitting || !isValidEmail"
          >
            {{ store.isSubmitting ? 'Sending...' : 'Send confirmation email' }}
          </button>
        </div>
        <p v-if="store.error" class="error-msg">{{ store.error }}</p>
        <p class="fine-print">
          For your security, we never confirm whether an email is registered. If an account with
          this address exists, you'll receive an email within a few minutes.
        </p>
      </div>

      <div v-else class="success-card">
        <h2>Check your inbox</h2>
        <p>
          If an account exists for that address, we've sent a confirmation link. It will expire in
          30 minutes. Please also check your spam folder.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAccountDeletionStore } from '../stores/accountDeletion'

const email = ref('')
const store = useAccountDeletionStore()

const isValidEmail = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()))

async function submit() {
  if (!isValidEmail.value || store.isSubmitting) return
  await store.requestDeletion(email.value.trim().toLowerCase())
}
</script>

<style scoped>
.delete-section {
  padding: 4rem 0 6rem;
}

.delete-container {
  max-width: 640px;
}

h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--text);
}

.lead {
  font-size: 1.05rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
  line-height: 1.65;
}

.lead.muted {
  font-size: 0.95rem;
  color: #c0392b;
  font-weight: 600;
  margin-bottom: 2rem;
}

.delete-form {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 1.75rem;
}

.input-group {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.input-field {
  flex: 1 1 220px;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-family: inherit;
  background: var(--bg);
}

.input-field:focus {
  outline: none;
  border-color: var(--primary);
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

.fine-print {
  margin-top: 1rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.error-msg {
  margin-top: 0.75rem;
  color: #c0392b;
  font-size: 0.9rem;
}

.success-card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 2rem;
}

.success-card h2 {
  margin-bottom: 0.75rem;
  font-size: 1.4rem;
}

.success-card p {
  color: var(--text-secondary);
  line-height: 1.65;
}
</style>
