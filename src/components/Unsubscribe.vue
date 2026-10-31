<template>
  <div class="unsub-page">
    <div class="card">
      <img v-if="kind === 'account'" class="boo" src="/email/email_goodbye@2x.png" width="320" height="200" alt="Boo waving goodbye" />

      <template v-if="state === 'done'">
        <h1 class="heading">You're unsubscribed</h1>
        <p class="sub">{{ copy.done }}</p>
        <a href="/" class="btn-primary action">Back to homepage</a>
      </template>

      <template v-else-if="state === 'invalid'">
        <h1 class="heading">This link doesn't work</h1>
        <p class="sub">It may be incomplete. Try the Unsubscribe link at the bottom of the email again.</p>
        <a href="/" class="btn-primary action">Back to homepage</a>
      </template>

      <template v-else>
        <h1 class="heading">{{ copy.ask }}</h1>
        <p class="sub">{{ copy.askSub }}</p>
        <p v-if="state === 'error'" class="error">Something went wrong on our side. Please try again in a moment.</p>
        <button class="btn-primary action" :disabled="state === 'sending'" @click="unsubscribe">
          {{ state === 'sending' ? 'Unsubscribing…' : 'Unsubscribe' }}
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NEWSLETTER_API_BASE_URL } from '@/stores/newsletter'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '')

// 'account' is Bookmarko's product email (`/unsubscribe`); 'newsletter' is
// Idan's personal newsletter (`/newsletter/unsubscribe`), served by the sandbox API.
const props = withDefaults(defineProps<{ kind?: 'account' | 'newsletter' }>(), { kind: 'account' })

const COPY = {
  account: {
    ask: 'Unsubscribe from Bookmarko emails?',
    askSub: "You'll stop getting emails like the welcome email. Account emails, like password resets, still reach you.",
    done: "You won't get emails like this from Bookmarko anymore. Account emails, like password resets, still reach you.",
  },
  newsletter: {
    ask: 'Unsubscribe from the newsletter?',
    askSub: "You'll stop getting the newsletter by Idan Malka.",
    done: "You won't get the newsletter by Idan Malka anymore. Sorry to see you go.",
  },
}
const copy = COPY[props.kind]
const idParam = props.kind === 'newsletter' ? 's' : 'u'
const endpoint =
  props.kind === 'newsletter' ? `${NEWSLETTER_API_BASE_URL}/newsletter/unsubscribe` : `${API_BASE_URL}/email/unsubscribe`

const params = new URLSearchParams(window.location.search)
const id = params.get(idParam) ?? ''
const token = params.get('t') ?? ''

// The link only carries an id and its signature; the API checks both.
const state = ref<'ready' | 'sending' | 'done' | 'invalid' | 'error'>(id && token ? 'ready' : 'invalid')

async function unsubscribe() {
  state.value = 'sending'
  try {
    const query = new URLSearchParams({ [idParam]: id, t: token })
    const res = await fetch(`${endpoint}?${query}`, { method: 'POST' })
    state.value = res.ok ? 'done' : res.status === 400 ? 'invalid' : 'error'
  } catch {
    state.value = 'error'
  }
}
</script>

<style scoped>
.unsub-page {
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6rem 1.5rem 3rem;
}
.card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 2.5rem 3rem 3rem;
  max-width: 480px;
  width: 100%;
  text-align: center;
  box-shadow: 0 4px 32px -4px rgba(81, 112, 255, 0.10), 0 1px 4px rgba(0,0,0,0.05);
}
.boo {
  display: block;
  width: 100%;
  max-width: 320px;
  height: auto;
  margin: 0 auto 1.75rem;
}
.heading {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--text);
  margin-bottom: 1rem;
  line-height: 1.15;
}
.sub {
  font-size: 1.05rem;
  color: var(--text-secondary);
  line-height: 1.65;
  margin-bottom: 2rem;
}
.error {
  color: #D2453C;
  font-size: 0.95rem;
  margin: -1rem 0 1.5rem;
}
.action {
  display: inline-block;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  padding: 0.8rem 2rem;
}
.action:disabled { opacity: 0.6; cursor: default; }
@media (max-width: 520px) {
  .card { padding: 2rem 1.5rem 2.5rem; }
  .heading { font-size: 1.65rem; }
}
</style>
