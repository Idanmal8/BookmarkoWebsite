<template>
  <section class="ginie-section" id="ginie">
    <header class="section-head" data-reveal>
      <span class="section-head__eyebrow">Meet Ginie</span>
      <h2 class="section-head__title">A librarian who lives in the lamp on your shelf.</h2>
      <p class="section-head__sub">
        Ask in your own words. Ginie recommends, teases the next chapter,
        and quietly keeps your shelves tidy while you read.
      </p>
    </header>

    <div data-reveal>
      <div class="ginie">
        <div class="ginie__card">
          <header class="ginie__header">
            <div class="ginie__avatar">
              <img src="/src/assets/ginie-lamp.png" alt="" />
            </div>
            <div class="ginie__id">
              <div class="ginie__name">Ginie</div>
              <div class="ginie__status">
                <span class="ginie__pulse" />
                online · your in-house librarian
              </div>
            </div>
            <div class="ginie__live">AI · preview</div>
          </header>

          <div class="ginie__thread" ref="threadEl">
            <div
              v-for="m in messages"
              :key="m.id"
              :class="['ginie__msg', `ginie__msg--${m.from}`]"
            >
              <div v-if="m.from === 'ginie'" class="ginie__msg-avatar">
                <img src="/src/assets/ginie-lamp.png" alt="" />
              </div>
              <div class="ginie__bubble">{{ m.text }}</div>
            </div>
            <div v-if="thinking" class="ginie__msg ginie__msg--ginie">
              <div class="ginie__msg-avatar">
                <img src="/src/assets/ginie-lamp.png" alt="" />
              </div>
              <div class="ginie__bubble ginie__bubble--typing">
                <span /><span /><span />
              </div>
            </div>
          </div>

          <div class="ginie__examples">
            <div class="ginie__examples-head">
              <span class="ginie__examples-label">Try one</span>
              <button v-if="used.size > 0" class="ginie__reset" @click="reset">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6a4 4 0 1 1 1.2 2.8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" fill="none" />
                  <path d="M2 3v3h3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="none" />
                </svg>
                Start over
              </button>
            </div>
            <div class="ginie__examples-list">
              <button
                v-for="p in PROMPTS"
                :key="p.q"
                :class="['ginie__chip', { 'ginie__chip--used': used.has(p.q) }]"
                :disabled="used.has(p.q) || thinking"
                @click="ask(p)"
              >
                {{ p.q }}
              </button>
            </div>
          </div>
        </div>

        <div class="ginie__abilities">
          <div class="ginie__ability">
            <div class="ginie__ability-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 4h9M2 8h9M2 12h6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
                <circle cx="13" cy="12" r="2" stroke="currentColor" stroke-width="1.6" />
              </svg>
            </div>
            <div>
              <div class="ginie__ability-title">Recommend</div>
              <div class="ginie__ability-body">By mood, by writer, by the kind of evening it is.</div>
            </div>
          </div>
          <div class="ginie__ability">
            <div class="ginie__ability-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 3h8l2 2v8H3z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
                <path d="M6 7h4M6 10h3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
              </svg>
            </div>
            <div>
              <div class="ginie__ability-title">Tease</div>
              <div class="ginie__ability-body">Spoiler-free tastes of chapters waiting on your shelf.</div>
            </div>
          </div>
          <div class="ginie__ability">
            <div class="ginie__ability-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8l3 3 7-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <div>
              <div class="ginie__ability-title">Track</div>
              <div class="ginie__ability-body">Move books, mark them finished, save a quote — just ask.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import { useReveal } from '@/composables/useReveal'

useReveal()

const OPENING = "Hi, I'm Ginie. Where is your imagination taking you tonight?"

const PROMPTS = [
  { q: 'Recommend a slow Sunday read', a: "Try Banana Yoshimoto's Kitchen. It's small, quiet, and tastes like a kitchen that someone once loved you in. A single afternoon and you're done — but it stays with you." },
  { q: 'Teaser for chapter 3 of "The Great Gatsby"', a: "It's the party chapter. The garden is full of strangers, the orchestra is too loud, and Nick finally meets the man whose smile, he says, you only see four or five times in a life." },
  { q: 'Mark "Pride and Prejudice" as finished', a: "Done — I've moved it to your Finished shelf and saved the Pemberley walk as a favourite passage. A good one to keep close." },
  { q: "What's similar to Italo Calvino?", a: "If you loved his lightness, try Borges' Labyrinths or Lispector's The Hour of the Star. Both feel like Calvino on a different evening." },
] as const

type Msg = { from: 'ginie' | 'user'; text: string; id: number }

let nextId = 1
const messages = ref<Msg[]>([{ from: 'ginie', text: OPENING, id: 0 }])
const thinking = ref(false)
const used = ref(new Set<string>())
const threadEl = ref<HTMLElement | null>(null)

watch([messages, thinking], async () => {
  await nextTick()
  if (threadEl.value) threadEl.value.scrollTop = threadEl.value.scrollHeight
}, { deep: true })

function ask(p: { q: string; a: string }) {
  if (thinking.value || used.value.has(p.q)) return
  messages.value.push({ from: 'user', text: p.q, id: nextId++ })
  used.value = new Set([...used.value, p.q])
  thinking.value = true
  window.setTimeout(() => {
    messages.value.push({ from: 'ginie', text: p.a, id: nextId++ })
    thinking.value = false
  }, 900)
}

function reset() {
  messages.value = [{ from: 'ginie', text: OPENING, id: nextId++ }]
  used.value = new Set()
  thinking.value = false
}
</script>

<style scoped>
.ginie-section { padding: 130px 36px; background: transparent; }
.section-head {
  max-width: 720px;
  margin: 0 auto 64px;
  text-align: center;
}
.section-head__eyebrow {
  display: inline-block;
  font-size: 12px; font-weight: 700;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 16px;
}
.section-head__title {
  font-family: 'EB Garamond', serif;
  font-weight: 500;
  font-size: clamp(34px, 4.4vw, 54px);
  line-height: 1.05;
  letter-spacing: -.015em;
  color: var(--ink);
  text-wrap: balance;
}
.section-head__sub {
  margin: 18px auto 0;
  font-size: 17px;
  line-height: 1.6;
  color: var(--ink-soft);
  max-width: 560px;
}

.ginie {
  max-width: 1080px;
  margin: 0 auto;
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  gap: 36px;
}
.ginie__card {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 22px;
  box-shadow: var(--shadow-warm);
  overflow: hidden;
  max-width: 740px;
  margin: 0 auto;
  width: 100%;
}
.ginie__header {
  display: flex; align-items: center; gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--line);
  background: linear-gradient(180deg, rgba(238,242,255,.6) 0%, transparent 100%);
}
.ginie__avatar {
  width: 40px; height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #FFF4D6 0%, #FFE3A0 100%);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 1px 0 rgba(255,255,255,.6) inset, 0 4px 10px rgba(228, 173, 60, .25);
}
.ginie__avatar img { width: 28px; height: 28px; object-fit: contain; }
.ginie__id { flex: 1; }
.ginie__name {
  font-family: 'EB Garamond', serif;
  font-weight: 600;
  font-size: 20px;
  color: var(--ink);
  letter-spacing: -.01em;
}
.ginie__status {
  font-size: 12px;
  color: var(--ink-mute);
  display: inline-flex; align-items: center; gap: 6px;
}
.ginie__pulse {
  width: 6px; height: 6px;
  background: #2BB573;
  border-radius: 50%;
  box-shadow: 0 0 0 4px rgba(43, 181, 115, .18);
  animation: giniePulse 2s ease-in-out infinite;
}
@keyframes giniePulse {
  0%, 100% { box-shadow: 0 0 0 4px rgba(43, 181, 115, .18); }
  50%      { box-shadow: 0 0 0 6px rgba(43, 181, 115, .08); }
}
.ginie__live {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--accent-deep);
  padding: 4px 8px;
  background: var(--accent-tint);
  border-radius: 999px;
}

.ginie__thread {
  padding: 24px 20px 8px;
  max-height: 360px;
  min-height: 260px;
  overflow-y: auto;
  display: flex; flex-direction: column;
  gap: 14px;
  scroll-behavior: smooth;
}
.ginie__msg {
  display: flex; gap: 10px;
  max-width: 88%;
  animation: msgIn .35s cubic-bezier(.16,.84,.44,1) both;
}
@keyframes msgIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
.ginie__msg--ginie { align-self: flex-start; }
.ginie__msg--user { align-self: flex-end; flex-direction: row-reverse; }
.ginie__msg-avatar {
  width: 28px; height: 28px;
  border-radius: 8px;
  background: linear-gradient(135deg, #FFF4D6 0%, #FFE3A0 100%);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(228, 173, 60, .25);
}
.ginie__msg-avatar img { width: 18px; height: 18px; object-fit: contain; }
.ginie__bubble {
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 14.5px;
  line-height: 1.5;
  color: var(--ink);
  white-space: pre-wrap;
}
.ginie__msg--ginie .ginie__bubble {
  background: var(--accent-tint);
  border-bottom-left-radius: 6px;
  font-family: 'EB Garamond', serif;
  font-size: 17px;
  line-height: 1.4;
}
.ginie__msg--user .ginie__bubble {
  background: var(--accent);
  color: #fff;
  border-bottom-right-radius: 6px;
}
.ginie__bubble--typing { display: flex; gap: 4px; padding: 14px 16px; }
.ginie__bubble--typing span {
  width: 7px; height: 7px;
  background: var(--accent);
  border-radius: 50%;
  opacity: .55;
  animation: typingBounce 1.2s ease-in-out infinite;
}
.ginie__bubble--typing span:nth-child(2) { animation-delay: .15s; }
.ginie__bubble--typing span:nth-child(3) { animation-delay: .3s; }
@keyframes typingBounce {
  0%, 60%, 100% { transform: translateY(0); opacity: .4; }
  30%           { transform: translateY(-4px); opacity: 1; }
}

.ginie__examples {
  padding: 16px 20px 22px;
  border-top: 1px solid var(--line-soft);
  background: linear-gradient(180deg, transparent 0%, rgba(165,194,244,.18) 100%);
}
.ginie__examples-head {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 10px;
}
.ginie__examples-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--ink-mute);
}
.ginie__reset {
  display: inline-flex; align-items: center; gap: 6px;
  border: 0; background: transparent;
  color: var(--ink-mute);
  font: inherit; font-size: 11.5px; font-weight: 600;
  letter-spacing: .02em;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 999px;
  transition: color .2s, background .2s;
}
.ginie__reset:hover { color: var(--accent-deep); background: var(--accent-tint); }
.ginie__examples-list { display: flex; flex-wrap: wrap; gap: 6px; }
.ginie__chip {
  border: 1px solid var(--line);
  background: #fff;
  color: var(--ink-soft);
  padding: 7px 12px;
  font: inherit; font-size: 12.5px; font-weight: 500;
  border-radius: 999px;
  cursor: pointer;
  transition: background .2s, color .2s, border-color .2s, transform .2s, opacity .2s;
}
.ginie__chip:hover:not(:disabled) {
  background: var(--accent-tint);
  color: var(--accent-deep);
  border-color: var(--accent-tint);
  transform: translateY(-1px);
}
.ginie__chip:disabled { cursor: not-allowed; }
.ginie__chip--used {
  opacity: .45;
  text-decoration: line-through;
  text-decoration-color: var(--ink-mute);
}

.ginie__abilities {
  max-width: 740px;
  margin: 0 auto;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  padding-top: 8px;
}
.ginie__ability {
  display: flex; gap: 12px;
  padding: 16px;
  background: rgba(255,255,255,.6);
  border: 1px solid var(--line-soft);
  border-radius: 14px;
}
.ginie__ability-icon {
  width: 32px; height: 32px;
  border-radius: 8px;
  background: var(--accent-tint);
  color: var(--accent-deep);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.ginie__ability-title {
  font-family: 'EB Garamond', serif;
  font-weight: 600;
  font-size: 16px;
  color: var(--ink);
  margin-bottom: 2px;
}
.ginie__ability-body {
  font-size: 13px;
  color: var(--ink-soft);
  line-height: 1.4;
}

@media (max-width: 720px) {
  .ginie__abilities { grid-template-columns: 1fr; }
}
</style>
