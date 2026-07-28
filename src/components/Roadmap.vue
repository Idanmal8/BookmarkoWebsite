<template>
  <section class="roadmap-page">
    <header class="page-head">
      <p class="eyebrow">Roadmap</p>
      <h1 class="title">What we're building</h1>
      <p class="lede">
        Shape Bookmarko with us. Suggest a feature, upvote what you want most, and watch
        it move from idea to shipped.
      </p>
    </header>

    <!-- Submit form -->
    <div class="submit-card" :class="{ done: submitted }">
      <Transition name="swap" mode="out-in">
        <form v-if="!submitted" key="form" class="submit-form" @submit.prevent="onSubmit">
          <h2 class="submit-title">Request a feature</h2>
          <input
            v-model="form.title"
            class="field"
            type="text"
            maxlength="100"
            placeholder="A short title — e.g. “Dark mode for the reader”"
            required
          />
          <textarea
            v-model="form.body"
            class="field area"
            maxlength="1000"
            rows="4"
            placeholder="Tell us what you'd love and why it matters to you…"
            required
          />
          <!-- Honeypot: hidden from humans, catches bots. Never remove. -->
          <input
            v-model="form.website"
            class="honeypot"
            type="text"
            tabindex="-1"
            autocomplete="off"
            aria-hidden="true"
          />
          <div class="submit-row">
            <span v-if="submitError" class="submit-error">{{ submitError }}</span>
            <button class="btn" type="submit" :disabled="submitting">
              <span v-if="!submitting">Send request →</span>
              <span v-else class="spinner" />
            </button>
          </div>
        </form>
        <div v-else key="thanks" class="thanks">
          <div class="thanks-check">
            <svg viewBox="0 0 52 52"><path d="M14 27l8 8 16-18" /></svg>
          </div>
          <h2 class="submit-title">Thank you!</h2>
          <p class="thanks-note">
            We review every request by hand. If it fits the vision, it'll appear on the board.
          </p>
          <button class="btn ghost" type="button" @click="resetForm">Send another</button>
        </div>
      </Transition>
    </div>

    <p v-if="store.error" class="board-error">{{ store.error }}</p>

    <!-- Read-only public board -->
    <div class="board">
      <div v-for="col in columns" :key="col.key" class="column">
        <div class="col-head" :data-status="col.key">
          <span class="col-dot" />
          <h3 class="col-title">{{ col.label }}</h3>
          <span class="col-count">{{ publicColumn(col.key).length }}</span>
        </div>

        <TransitionGroup tag="div" name="cards" class="col-body">
          <article v-for="item in publicColumn(col.key)" :key="item.id" class="card">
            <h4 class="card-title">{{ item.title }}</h4>
            <p class="card-body">{{ item.body }}</p>
            <div class="card-foot">
              <button
                class="vote-btn"
                :class="{ voted: store.hasVoted(item.id) }"
                :disabled="store.hasVoted(item.id)"
                @click="store.upvote(item.id)"
              >
                <span class="chev">▲</span>
                <span class="vote-count">{{ item.upvotes }}</span>
              </button>
            </div>
          </article>
          <p v-if="publicColumn(col.key).length === 0" key="empty" class="col-empty">
            Nothing here yet
          </p>
        </TransitionGroup>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'
import {
  useFeatureRequestStore,
  type FeatureRequest,
  type FeatureRequestStatus,
} from '../stores/featureRequests'

const store = useFeatureRequestStore()

// The board is read-only here — moderation and column moves happen only in the
// BookmarkoDesktop admin console. The website can display, submit, and upvote.
const columns = [
  { key: 'todo' as const, label: 'Todo' },
  { key: 'in_progress' as const, label: 'In Progress' },
  { key: 'done' as const, label: 'Done' },
  { key: 'aired' as const, label: 'Aired' },
]

// ── Submit form ───────────────────────────────────────────────────────────────
const form = reactive({ title: '', body: '', website: '' })
const submitting = computed(() => store.submitting)
const submitError = computed(() => store.submitError)
const submitted = computed(() => store.submitted)

async function onSubmit() {
  await store.submit(form.title.trim(), form.body.trim(), form.website)
}
function resetForm() {
  form.title = ''
  form.body = ''
  form.website = ''
  store.submitted = false
  store.submitError = null
}

// ── Board access ──────────────────────────────────────────────────────────────
function publicColumn(key: FeatureRequestStatus): FeatureRequest[] {
  if (key === 'pending') return []
  return store.board[key] ?? []
}

onMounted(() => store.fetchBoard())
</script>

<style scoped>
.roadmap-page {
  max-width: 1180px;
  margin: 0 auto;
  padding: 7rem 1.5rem 6rem;
}

/* ── Header ─────────────────────────────────────────────── */
.page-head {
  text-align: center;
  max-width: 620px;
  margin: 0 auto 2.5rem;
}
.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--accent);
  margin: 0 0 0.6rem;
}
.title {
  font-family: 'EB Garamond', serif;
  font-size: clamp(2.4rem, 4vw, 3.4rem);
  font-weight: 600;
  color: var(--ink);
  margin: 0 0 0.8rem;
}
.lede {
  color: var(--ink-mute);
  font-size: 1.05rem;
  line-height: 1.6;
  margin: 0;
}

/* ── Submit card ────────────────────────────────────────── */
.submit-card {
  max-width: 620px;
  margin: 0 auto 3.5rem;
  background: var(--white);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft);
  padding: 1.8rem;
  transition: box-shadow 0.4s ease;
}
.submit-card.done {
  box-shadow: var(--shadow-warm);
}
.submit-title {
  font-family: 'EB Garamond', serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--ink);
  margin: 0 0 1rem;
}
.submit-form { display: flex; flex-direction: column; gap: 0.8rem; }
.field {
  width: 100%;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  padding: 0.8rem 0.95rem;
  font-family: inherit;
  font-size: 0.95rem;
  color: var(--ink);
  background: var(--paper);
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
}
.field:focus {
  outline: none;
  border-color: var(--accent);
  background: var(--white);
  box-shadow: 0 0 0 4px var(--accent-tint);
}
.area { resize: vertical; min-height: 96px; line-height: 1.5; }
.honeypot {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}
.submit-row {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 0.3rem;
}
.submit-error { color: #d64550; font-size: 0.85rem; margin-right: auto; }

/* Thank-you state */
.thanks { text-align: center; padding: 1rem 0 0.5rem; }
.thanks-note { color: var(--ink-mute); font-size: 0.95rem; line-height: 1.6; margin: 0 0 1.4rem; }
.thanks-check {
  width: 66px; height: 66px; margin: 0 auto 1rem;
  border-radius: 50%;
  background: var(--accent-tint);
  display: grid; place-items: center;
  animation: pop 0.5s cubic-bezier(0.2, 1.4, 0.4, 1) both;
}
.thanks-check svg { width: 34px; height: 34px; fill: none; stroke: var(--accent); stroke-width: 4; stroke-linecap: round; stroke-linejoin: round; }
.thanks-check path { stroke-dasharray: 60; stroke-dashoffset: 60; animation: draw 0.5s 0.2s ease forwards; }
@keyframes draw { to { stroke-dashoffset: 0; } }
@keyframes pop { 0% { transform: scale(0); } 100% { transform: scale(1); } }

/* ── Buttons ────────────────────────────────────────────── */
.btn {
  border: none;
  background: var(--accent);
  color: #fff;
  font-family: inherit;
  font-weight: 600;
  font-size: 0.92rem;
  padding: 0.72rem 1.3rem;
  border-radius: 999px;
  cursor: pointer;
  transition: transform 0.15s ease, background 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 8px 18px -8px rgba(81, 112, 255, 0.7);
}
.btn:hover:not(:disabled) { background: var(--accent-deep); transform: translateY(-2px); }
.btn:active:not(:disabled) { transform: translateY(0); }
.btn:disabled { opacity: 0.7; cursor: default; }
.btn.ghost { background: transparent; color: var(--accent); box-shadow: none; }
.btn.ghost:hover:not(:disabled) { background: var(--accent-tint); }
.spinner {
  display: inline-block; width: 16px; height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.45); border-top-color: #fff;
  border-radius: 50%; animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.board-error { text-align: center; color: #d64550; }

/* ── Board ──────────────────────────────────────────────── */
.board {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.1rem;
  align-items: start;
}
@media (max-width: 900px) {
  .board { grid-template-columns: 1fr; }
}

.column {
  background: var(--paper);
  border: 1px solid var(--line-soft);
  border-radius: var(--radius-lg);
  padding: 0.9rem;
  min-height: 120px;
}
.col-head { display: flex; align-items: center; gap: 0.5rem; padding: 0.2rem 0.4rem 0.9rem; }
.col-dot { width: 9px; height: 9px; border-radius: 50%; background: var(--ink-mute); }
.col-head[data-status='todo'] .col-dot { background: var(--accent-soft); }
.col-head[data-status='in_progress'] .col-dot { background: var(--accent); }
.col-head[data-status='done'] .col-dot { background: #43b581; }
.col-head[data-status='aired'] .col-dot { background: #8b5cf6; }
.col-title { font-size: 0.9rem; font-weight: 700; color: var(--ink); margin: 0; flex: 1; }
.col-count {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.72rem; font-weight: 600;
  color: var(--ink-mute); background: var(--white);
  border-radius: 999px; padding: 0.1rem 0.5rem;
}
.col-body { display: flex; flex-direction: column; gap: 0.7rem; min-height: 40px; }
.col-empty { color: var(--ink-mute); font-size: 0.82rem; text-align: center; padding: 1rem 0; opacity: 0.6; }

/* ── Cards ──────────────────────────────────────────────── */
.card {
  background: var(--white);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  padding: 0.85rem 0.9rem;
  box-shadow: var(--shadow-soft);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.card:hover { transform: translateY(-2px); box-shadow: var(--shadow-warm); }
.card-title { font-size: 0.95rem; font-weight: 700; color: var(--ink); margin: 0 0 0.4rem; line-height: 1.35; }
.card-body { font-size: 0.85rem; color: var(--ink-soft); line-height: 1.5; margin: 0 0 0.7rem; }
.card-foot { display: flex; align-items: center; justify-content: space-between; }

/* Upvote button */
.vote-btn {
  display: inline-flex; align-items: center; gap: 0.35rem;
  border: 1px solid var(--line);
  background: var(--paper);
  color: var(--ink-soft);
  font-family: inherit; font-weight: 700; font-size: 0.82rem;
  padding: 0.32rem 0.7rem; border-radius: 999px; cursor: pointer;
  transition: transform 0.15s ease, background 0.2s, border-color 0.2s, color 0.2s;
}
.vote-btn:hover:not(:disabled) { border-color: var(--accent); color: var(--accent-deep); transform: translateY(-1px); }
.vote-btn .chev { font-size: 0.62rem; transition: transform 0.2s ease; }
.vote-btn:hover:not(:disabled) .chev { transform: translateY(-2px); }
.vote-btn.voted {
  background: var(--accent-tint); border-color: var(--accent-soft); color: var(--accent-deep);
  cursor: default;
}
.vote-btn.voted .chev { animation: bounce 0.4s ease; }
@keyframes bounce { 0%,100% { transform: translateY(0); } 40% { transform: translateY(-4px); } }

/* ── Card transitions (reordering on upvote) ────────────── */
.cards-move { transition: transform 0.4s cubic-bezier(0.2, 0.9, 0.3, 1); }
.cards-enter-active { transition: all 0.4s ease; }
.cards-enter-from { opacity: 0; transform: translateY(12px); }
.cards-leave-active { transition: all 0.25s ease; position: absolute; }
.cards-leave-to { opacity: 0; transform: scale(0.95); }

/* Form <-> thanks swap */
.swap-enter-active, .swap-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.swap-enter-from { opacity: 0; transform: translateY(10px); }
.swap-leave-to { opacity: 0; transform: translateY(-10px); }
</style>
