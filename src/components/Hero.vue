<template>
  <section class="hero" id="top">
    <div class="hero__shelf hero__shelf--left">
      <Bookshelf side="left" :width="180" :height="900" :shelves="8" />
      <div class="hero__shelf-fade hero__shelf-fade--bottom" />
    </div>

    <div class="hero__center">
      <h1 class="hero__title">
        Welcome <em>home,</em><br />
        reader.
      </h1>

      <p class="hero__sub">
        Bookmarko is the warm, well-lit shelf for everything you're reading —
        the novel by your bed, the longform you saved on the train, the chapter
        you keep meaning to finish. One place. No 47 open tabs.
      </p>

      <form class="hero__form" id="waitlist" @submit.prevent="submit" v-if="state !== 'success'">
        <div class="field">
          <input
            type="email"
            class="field__input"
            placeholder="you@quietreader.com"
            v-model="email"
            :disabled="state === 'submitting'"
            @input="state === 'error' && (state = 'idle')"
          />
          <button type="submit" class="field__btn" :disabled="state === 'submitting'">
            {{ state === 'submitting' ? 'Saving your seat…' : 'Pull up a chair' }}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>
        <div v-if="err" class="field__err" role="alert">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.4" />
            <path d="M7 4v3.5M7 9.5v.01" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
          </svg>
          <span>{{ err }}</span>
        </div>
        <div class="hero__form-meta">
          <span>No card · No spam · Just a quieter way to read</span>
        </div>
      </form>

      <div v-else class="hero__form field__success-wrap">
        <div class="field__success">
          <div class="field__success-icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 10.5l4 4 8-9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
          <div>
            <strong>{{ alreadyJoined ? "You're on the list." : 'Seat saved.' }}</strong>
            <span>We'll write when the doors open.</span>
          </div>
        </div>
      </div>

      <div class="hero__stats">
        <div class="stat">
          <span class="stat__num" :class="{ 'stat__num--bumped': bumped }">{{ formattedCount }}</span>
          <span class="stat__label">readers waiting</span>
        </div>
        <div class="stat__divider" />
        <div class="stat">
          <span class="stat__num">∞</span>
          <span class="stat__label">tabs you'll close</span>
        </div>
        <div class="stat__divider" />
        <div class="stat">
          <span class="stat__num">1</span>
          <span class="stat__label">quiet shelf</span>
        </div>
      </div>
    </div>

    <div class="hero__shelf hero__shelf--right">
      <Bookshelf side="right" :width="180" :height="900" :shelves="8" />
      <div class="hero__shelf-fade hero__shelf-fade--bottom" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import Bookshelf from './Bookshelf.vue'
import { useWaitlistStore } from '@/stores/waitlist'

const store = useWaitlistStore()
const { waitingCount } = storeToRefs(store)
const formattedCount = computed(() => waitingCount.value.toLocaleString('en-US'))

const email = ref('')
const state = ref<'idle' | 'submitting' | 'success' | 'error'>('idle')
const err = ref('')
const alreadyJoined = ref(false)
const bumped = ref(false)

async function submit() {
  err.value = ''
  if (!email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    err.value = 'A real email, please.'
    state.value = 'error'
    return
  }
  state.value = 'submitting'
  const res = await store.joinWaitlist(email.value.trim(), true)
  if (res.success) {
    alreadyJoined.value = res.alreadyJoined
    state.value = 'success'
    if (!res.alreadyJoined) {
      bumped.value = true
      window.setTimeout(() => (bumped.value = false), 1200)
    }
  } else {
    err.value = store.error || 'Something went wrong. Please try again.'
    state.value = 'error'
  }
}
</script>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  display: grid;
  grid-template-columns: 180px 1fr 180px;
  gap: 24px;
  align-items: stretch;
  padding: 0 0 64px;
}
.hero__center {
  max-width: 560px;
  justify-self: center;
  align-self: center;
  text-align: center;
  padding: 140px 24px 32px;
}
.hero__shelf {
  position: relative;
  height: 100%;
  min-height: 100vh;
  align-self: stretch;
  overflow: hidden;
}
.hero__shelf-fade {
  position: absolute; left: 0; right: 0;
  height: 120px;
  pointer-events: none;
}
.hero__shelf-fade--bottom {
  bottom: 0;
  background: linear-gradient(to top, var(--paper) 0%, rgba(247,249,252,.7) 50%, transparent 100%);
}

.hero__eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 13px; font-weight: 600;
  color: var(--ink-soft);
  letter-spacing: .04em;
  text-transform: lowercase;
  padding: 6px 14px;
  background: var(--paper-deep);
  border: 1px solid var(--line);
  border-radius: 999px;
  margin-bottom: 32px;
  white-space: nowrap;
}
.hero__eyebrow-dot {
  width: 7px; height: 7px;
  background: var(--accent);
  border-radius: 50%;
  box-shadow: 0 0 0 4px rgba(81,112,255,.18);
}
.hero__title {
  font-family: 'EB Garamond', serif;
  font-weight: 500;
  font-size: clamp(38px, 4.6vw, 64px);
  line-height: 1.02;
  letter-spacing: -.02em;
  color: var(--ink);
  margin-bottom: 24px;
}
.hero__title em {
  font-style: italic;
  color: #fff;
  font-weight: 400;
}
.hero__sub {
  font-size: 16px;
  line-height: 1.6;
  color: var(--ink);
  font-weight: 500;
  max-width: 440px;
  margin: 0 auto 32px;
}

.hero__form { max-width: 460px; margin: 0 auto; }
.field {
  display: flex;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 6px;
  box-shadow: var(--shadow-soft);
}
.field__input {
  flex: 1;
  border: 0; background: transparent;
  padding: 10px 18px;
  font: inherit; font-size: 15px;
  color: var(--ink);
  outline: none;
}
.field__input::placeholder { color: var(--ink-mute); }
.field__btn {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--accent);
  color: #fff;
  border: 0;
  padding: 10px 18px;
  font: inherit; font-size: 14px; font-weight: 600;
  border-radius: 999px;
  cursor: pointer;
  transition: background .2s, transform .2s;
}
.field__btn:hover { background: var(--accent-deep); transform: translateX(2px); }
.field__btn:disabled { opacity: .6; cursor: wait; }
.field__err {
  display: inline-flex; align-items: center; gap: 8px;
  margin-top: 12px;
  padding: 8px 14px;
  background: #FDECE7;
  color: #B54A3A;
  border: 1px solid #F1C8BD;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  animation: errIn .3s cubic-bezier(.16,.84,.44,1) both;
}
@keyframes errIn {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}
.hero__form-meta {
  margin-top: 14px;
  font-size: 13px;
  color: var(--ink-mute);
  letter-spacing: .01em;
}
.field__success {
  display: flex; align-items: center; gap: 14px;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 22px;
  padding: 16px 20px;
  text-align: left;
  box-shadow: var(--shadow-soft);
  animation: fadeInUp .5s cubic-bezier(.16,.84,.44,1) both;
}
.field__success-icon {
  width: 36px; height: 36px;
  background: var(--accent);
  color: #fff;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.field__success strong {
  display: block; font-size: 15px; color: var(--ink); font-weight: 700;
}
.field__success span {
  display: block; font-size: 13px; color: var(--ink-soft);
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

.hero__stats {
  margin-top: 40px;
  display: flex; align-items: center; justify-content: center;
  gap: 24px;
}
.stat { display: flex; flex-direction: column; gap: 2px; }
.stat__num {
  font-family: 'EB Garamond', serif;
  font-size: 24px; font-weight: 600;
  color: var(--ink);
  line-height: 1;
  transition: color .3s;
  display: inline-block;
}
.stat__num--bumped {
  color: var(--accent-deep);
  animation: countBump .9s cubic-bezier(.16,.84,.44,1);
}
@keyframes countBump {
  0%   { transform: scale(1); }
  35%  { transform: scale(1.18); }
  100% { transform: scale(1); }
}
.stat__label {
  font-size: 12px;
  color: var(--ink-mute);
  letter-spacing: .04em;
}
.stat__divider { width: 1px; height: 32px; background: var(--line); }

@media (max-width: 1100px) {
  .hero { grid-template-columns: 1fr; padding-top: 80px; }
  .hero__shelf { display: none; }
}
</style>
