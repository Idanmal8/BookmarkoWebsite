<template>
  <div class="nl-form-wrap" :class="`tone-${tone}`">
    <Transition name="swap" mode="out-in">
      <div v-if="state === 'done'" key="done" class="done">
        <span class="done-icon" aria-hidden="true">✉️</span>
        <div>
          <p class="done-title">Check your inbox!</p>
          <p class="done-sub">I just sent you a confirmation link. Click it and you're in.</p>
        </div>
      </div>

      <form v-else key="form" class="nl-form" @submit.prevent="onSubmit">
        <div class="pill">
          <input
            v-model="firstName"
            class="field name"
            type="text"
            name="firstName"
            autocomplete="given-name"
            maxlength="60"
            placeholder="First name"
            aria-label="First name"
          />
          <span class="divider" aria-hidden="true" />
          <input
            v-model="email"
            class="field email"
            type="email"
            name="email"
            autocomplete="email"
            maxlength="254"
            placeholder="you@email.com"
            aria-label="Email"
            required
          />
          <button class="submit" type="submit" :disabled="state === 'sending'">
            <span>{{ state === 'sending' ? 'Signing up…' : 'Sign me up' }}</span>
            <span v-if="state !== 'sending'" class="arrow" aria-hidden="true">→</span>
          </button>
        </div>
        <!-- Bots fill every field; people never see this one. -->
        <input v-model="website" class="honeypot" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" />
        <p v-if="error" class="error" role="alert">{{ error }}</p>
        <p class="fine">{{ finePrint }}</p>
      </form>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useNewsletterStore } from '@/stores/newsletter'

const props = withDefaults(defineProps<{ source: string; finePrint: string; tone?: 'light' | 'dark' }>(), {
  tone: 'light',
})

const store = useNewsletterStore()
const firstName = ref('')
const email = ref('')
const website = ref('')
const state = ref<'idle' | 'sending' | 'done'>('idle')
const error = ref<string | null>(null)

async function onSubmit() {
  state.value = 'sending'
  error.value = null
  const result = await store.subscribe({
    email: email.value.trim(),
    firstName: firstName.value.trim(),
    source: props.source,
    website: website.value,
  })
  if (result.success) {
    state.value = 'done'
  } else {
    state.value = 'idle'
    error.value = result.error
  }
}
</script>

<style scoped>
.nl-form {
  position: relative;
}
.pill {
  display: flex;
  align-items: center;
  background: #fff;
  border: 2px solid var(--nl-ink);
  border-radius: 999px;
  padding: 6px;
  box-shadow: 5px 5px 0 var(--nl-ink);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}
.pill:focus-within {
  transform: translate(-2px, -2px);
  box-shadow: 7px 7px 0 var(--nl-ink);
}
.field {
  min-width: 0;
  border: 0;
  background: transparent;
  font-family: inherit;
  font-size: 1rem;
  color: var(--nl-ink);
  padding: 0.75rem 1rem;
}
.field:focus {
  outline: none;
}
.field::placeholder {
  color: #8b8fa8;
}
.name {
  flex: 0 0 34%;
}
.email {
  flex: 1;
}
.divider {
  width: 1px;
  align-self: stretch;
  margin: 10px 0;
  background: rgba(20, 25, 58, 0.15);
}
.submit {
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--nl-ink);
  color: #fff;
  font-weight: 700;
  font-size: 1rem;
  padding: 0.85rem 1.4rem;
  border-radius: 999px;
}
.submit:hover:not(:disabled) {
  background: var(--nl-accent);
}
.submit:hover:not(:disabled) .arrow {
  transform: translateX(3px);
}
.arrow {
  transition: transform 0.2s ease;
}
.submit:disabled {
  opacity: 0.75;
  cursor: default;
}
.honeypot {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  opacity: 0;
}
.error {
  margin-top: 0.9rem;
  color: #c0392b;
  font-size: 0.9rem;
  font-weight: 600;
}
.fine {
  margin-top: 0.9rem;
  font-size: 0.85rem;
  color: var(--nl-mute);
}
.tone-dark .pill,
.tone-dark .done {
  border-color: #fff;
  box-shadow: 5px 5px 0 var(--nl-accent);
}
.tone-dark .fine {
  color: rgba(255, 255, 255, 0.8);
}
.tone-dark .error {
  color: #ffe0dc;
}

.done {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #fff;
  border: 2px solid var(--nl-ink);
  border-radius: 24px;
  padding: 1.1rem 1.4rem;
  box-shadow: 5px 5px 0 var(--nl-ink);
  text-align: left;
}
.done-icon {
  font-size: 2rem;
}
.done-title {
  font-family: var(--nl-display);
  font-size: 1.4rem;
  color: var(--nl-ink);
}
.done-sub {
  color: var(--ink-soft);
  font-size: 0.95rem;
  line-height: 1.5;
}

.swap-enter-active,
.swap-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.swap-enter-from,
.swap-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

@media (max-width: 600px) {
  .pill {
    flex-direction: column;
    align-items: stretch;
    border-radius: 24px;
    padding: 8px;
  }
  .name {
    flex: none;
  }
  .divider {
    width: auto;
    height: 1px;
    margin: 0 12px;
  }
  .submit {
    justify-content: center;
    margin-top: 6px;
  }
}
</style>
