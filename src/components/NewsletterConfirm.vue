<template>
  <div class="confirm-page">
    <div class="card">
      <img class="avatar" src="/newsletter/idan.jpg" width="96" height="96" alt="Idan Malka" />

      <template v-if="state === 'done'">
        <h1 class="heading serif">You're in!</h1>
        <p class="sub">Thanks for joining the newsletter by Idan Malka. The next letter lands straight in your inbox.</p>
        <a href="/newsletter/" class="btn-primary action">Back to the newsletter</a>
      </template>

      <template v-else-if="state === 'invalid'">
        <h1 class="heading serif">This link doesn't work</h1>
        <p class="sub">It may have expired or been cut short. Sign up again and I'll send you a fresh one.</p>
        <a href="/newsletter/" class="btn-primary action">Sign up again</a>
      </template>

      <template v-else-if="state === 'error'">
        <h1 class="heading serif">Something went wrong</h1>
        <p class="sub">It's on my side. Please try the link again in a moment.</p>
        <button class="btn-primary action" @click="confirm">Try again</button>
      </template>

      <template v-else>
        <h1 class="heading serif">Confirming…</h1>
        <p class="sub">One second.</p>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { NEWSLETTER_API_BASE_URL } from '@/stores/newsletter'

const token = new URLSearchParams(window.location.search).get('t') ?? ''
const state = ref<'sending' | 'done' | 'invalid' | 'error'>(token ? 'sending' : 'invalid')

// Confirms on load: the API takes a POST, which link scanners that prefetch the
// email's GET link never send, so opening the page is what counts as the click.
async function confirm() {
  state.value = 'sending'
  try {
    const res = await fetch(`${NEWSLETTER_API_BASE_URL}/newsletter/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
    state.value = res.ok ? 'done' : res.status === 400 ? 'invalid' : 'error'
  } catch {
    state.value = 'error'
  }
}

onMounted(() => {
  if (token) confirm()
})
</script>

<style scoped>
.confirm-page {
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
  box-shadow: var(--shadow-warm);
}
.avatar {
  display: block;
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 auto 1.5rem;
}
.heading {
  font-size: 2.2rem;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 0.8rem;
  line-height: 1.15;
}
.sub {
  font-size: 1.05rem;
  color: var(--ink-soft);
  line-height: 1.65;
  margin-bottom: 2rem;
}
.action {
  display: inline-block;
  text-decoration: none;
  padding: 0.8rem 2rem;
}
@media (max-width: 520px) {
  .card { padding: 2rem 1.5rem 2.5rem; }
}
</style>
