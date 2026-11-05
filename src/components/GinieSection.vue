<template>
  <section class="ginie-section" id="ginie">
    <header class="section-head" data-reveal>
      <span class="section-head__eyebrow">Meet Ginie</span>
      <h2 class="section-head__title">A librarian who lives on your shelf.</h2>
      <p class="section-head__sub">
        Ask in your own words. Ginie finds your next book, teases the next chapter,
        and quietly keeps your shelves tidy while you read.
      </p>
    </header>

    <div class="gx-stage" data-reveal>
      <GinieVoid class="gx-void" aria-hidden="true" />

      <div ref="cardEl" class="gx">
        <div ref="threadEl" class="gx__thread">
          <div class="gx__hello" :class="{ 'is-small': messages.length > 0 }">
            <img class="gx__hello-star" :src="ginieStar" alt="" />
            <p class="gx__hello-text">Hi, I'm Ginie the librarian.<br />Where is your imagination taking you?</p>
          </div>

          <template v-for="m in messages" :key="m.id">
            <div v-if="m.from === 'user'" class="gx__user">{{ m.text }}</div>

            <div v-else class="gx__reply">
              <p class="gx__reply-text">{{ m.text }}</p>

              <div v-if="m.picks" class="gx-short">
                <div class="gx-short__head">
                  <span>A few to consider</span>
                  <span class="gx-short__pos">{{ (pos[m.id] ?? 0) + 1 }} / {{ m.picks.length }}</span>
                </div>
                <div class="gx-short__row" @scroll="onShortScroll(m.id, $event)">
                  <article v-for="b in m.picks" :key="b.title" class="gx-pick">
                    <img class="gx-pick__cover" :src="b.cover" alt="" />
                    <div class="gx-pick__body">
                      <span class="gx-pick__tag">{{ b.tag }}</span>
                      <b class="gx-pick__title">{{ b.title }}</b>
                      <span class="gx-pick__author">{{ b.author }}</span>
                      <button
                        class="gx-pick__add"
                        :class="{ 'is-added': added.has(b.title) }"
                        @click="toggleAdd(b.title)"
                      >{{ added.has(b.title) ? 'Added' : 'Add to library' }}</button>
                    </div>
                  </article>
                </div>
                <p class="gx-short__foot">Swipe for the others. Nothing is added until you tap.</p>
              </div>

              <div v-if="m.action" class="gx-action">
                <img class="gx-action__cover" :src="m.action.cover" alt="" />
                <span class="gx-action__text"><b>{{ m.action.title }}</b><span>{{ m.action.detail }}</span></span>
                <span class="gx-action__check" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 7.5l2.6 2.6L11 4.6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
                </span>
              </div>
            </div>
          </template>

          <div v-if="thinking" class="gx__typing" aria-label="Ginie is typing"><span /><span /><span /></div>
        </div>

        <div class="gx__chips">
          <button
            v-for="p in PROMPTS"
            :key="p.q"
            class="gx__chip"
            :disabled="thinking || used.has(p.q)"
            @click="ask(p)"
          >{{ p.q }}</button>
          <button v-if="used.size === PROMPTS.length" class="gx__chip gx__chip--reset" @click="reset">Start over</button>
        </div>

        <div class="gx__input">
          <span class="gx__placeholder">Ask Ginie anything...</span>
          <button class="gx__send" :disabled="thinking" aria-label="Ask the next example" @click="askNext">
            <svg width="16" height="16" viewBox="0 0 16 16"><path d="M8 13V3M3.5 7.5L8 3l4.5 4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </button>
        </div>
      </div>
    </div>

    <div class="gx-abilities" data-reveal>
      <div class="gx-ability">
        <b>Recommend</b>
        <span>By mood, by writer, by the kind of evening it is.</span>
      </div>
      <div class="gx-ability">
        <b>Tease</b>
        <span>A taste of the next chapter, never the ending.</span>
      </div>
      <div class="gx-ability">
        <b>Track</b>
        <span>Move books, mark them finished, save a quote. Just ask.</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useReveal } from '@/composables/useReveal'
import GinieVoid from './GinieVoid.vue'
import ginieStar from '@/assets/ginie-star.svg'
import redRising from '@/assets/Books/RedRising.webp'
import dungeon from '@/assets/Books/Dungeon.webp'
import onyxStorm from '@/assets/Books/OnyxStorm.webp'
import strangePictures from '@/assets/Books/StrangePictures.webp'
import housemaid from '@/assets/Books/HouseMain.webp'
import yesteryear from '@/assets/Books/Yesteryear.webp'
import weddingPeople from '@/assets/Books/TWeddingPepole.webp'
import heartLover from '@/assets/Books/Heart.webp'
import tomorrow from '@/assets/Books/TATAT.webp'

useReveal()

type Pick = { title: string; author: string; tag: string; cover: string }
type Prompt = { q: string; a: string; picks?: Pick[]; action?: { title: string; detail: string; cover: string } }
type Msg = { id: number; from: 'user' | 'ginie'; text: string; picks?: Pick[]; action?: Prompt['action'] }

// Mirrors the app's Ginie: replies can carry a shortlist carousel or an action card.
const PROMPTS: Prompt[] = [
  {
    q: 'Something like Project Hail Mary',
    a: 'Big, fast and very hard to put down. Three to consider.',
    picks: [
      { title: 'Red Rising', author: 'Pierce Brown', tag: 'Sci fi', cover: redRising },
      { title: 'Dungeon Crawler Carl', author: 'Matt Dinniman', tag: 'LitRPG', cover: dungeon },
      { title: 'Onyx Storm', author: 'Rebecca Yarros', tag: 'Fantasy', cover: onyxStorm },
    ],
  },
  {
    q: 'A twisty thriller for tonight',
    a: 'Lights on for these. Each one turns at least once.',
    picks: [
      { title: 'Strange Pictures', author: 'Uketsu', tag: 'Mystery', cover: strangePictures },
      { title: 'The Housemaid', author: 'Sarah A. Denzil', tag: 'Thriller', cover: housemaid },
      { title: 'Yesteryear', author: 'Caro Claire Burke', tag: 'Thriller', cover: yesteryear },
    ],
  },
  {
    q: 'Cozy and a little romantic',
    a: 'Warm, funny and quietly devastating in the best way.',
    picks: [
      { title: 'The Wedding People', author: 'Alison Espach', tag: 'Fiction', cover: weddingPeople },
      { title: 'Heart the Lover', author: 'Lily King', tag: 'Romance', cover: heartLover },
      { title: 'Tomorrow, and Tomorrow, and Tomorrow', author: 'Gabrielle Zevin', tag: 'Fiction', cover: tomorrow },
    ],
  },
  {
    q: 'Mark Red Rising as finished',
    a: 'Done. One more for this year.',
    action: { title: 'Moved to Finished', detail: 'Red Rising, Pierce Brown', cover: redRising },
  },
]

let nextId = 1
const messages = ref<Msg[]>([])
const thinking = ref(false)
const used = ref(new Set<string>())
const added = ref(new Set<string>())
const pos = reactive<Record<number, number>>({})
const threadEl = ref<HTMLElement | null>(null)
const cardEl = ref<HTMLElement | null>(null)
let touched = false
let timer = 0
let io: IntersectionObserver | null = null

watch([messages, thinking], async () => {
  await nextTick()
  threadEl.value?.scrollTo({ top: threadEl.value.scrollHeight, behavior: 'smooth' })
}, { deep: true })

function ask(p: Prompt, auto = false) {
  if (thinking.value || used.value.has(p.q)) return
  if (!auto) touched = true
  messages.value.push({ id: nextId++, from: 'user', text: p.q })
  used.value = new Set([...used.value, p.q])
  thinking.value = true
  timer = window.setTimeout(() => {
    messages.value.push({ id: nextId++, from: 'ginie', text: p.a, picks: p.picks, action: p.action })
    thinking.value = false
  }, 1100)
}

function askNext() {
  const p = PROMPTS.find((x) => !used.value.has(x.q))
  if (p) ask(p)
  else reset()
}

function reset() {
  touched = true
  messages.value = []
  used.value = new Set()
  added.value = new Set()
}

function toggleAdd(title: string) {
  const next = new Set(added.value)
  if (next.has(title)) next.delete(title)
  else next.add(title)
  added.value = next
}

function onShortScroll(id: number, e: Event) {
  const row = e.target as HTMLElement
  const card = row.firstElementChild as HTMLElement | null
  if (card) pos[id] = Math.round(row.scrollLeft / (card.offsetWidth + 10))
}

// Plays the first question by itself once the card is in view, unless the visitor got there first.
onMounted(() => {
  if (!('IntersectionObserver' in window) || !cardEl.value) return
  io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return
    io?.disconnect()
    timer = window.setTimeout(() => { if (!touched) ask(PROMPTS[0], true) }, 1400)
  }, { threshold: 0.5 })
  io.observe(cardEl.value)
})

onBeforeUnmount(() => {
  io?.disconnect()
  window.clearTimeout(timer)
})
</script>

<style scoped>
.ginie-section { padding: 130px 36px; background: transparent; }
.section-head {
  max-width: 720px;
  margin: 0 auto 56px;
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

/* Void animation on the left, the chat on the right */
.gx-stage {
  max-width: 1080px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 440px;
  gap: 48px;
  align-items: center;
}
.gx-void { width: 100%; max-width: 500px; justify-self: center; }

.gx {
  height: 620px;
  display: flex;
  flex-direction: column;
  border-radius: 32px;
  background: #fff;
  border: 1px solid var(--line-soft);
  box-shadow: 0 40px 80px -40px rgba(81, 112, 255, .35), 0 12px 30px -18px rgba(20, 25, 58, .18);
  overflow: hidden;
}

.gx__thread {
  flex: 1;
  overflow-y: auto;
  padding: 22px 20px 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  scrollbar-width: none;
}
.gx__thread::-webkit-scrollbar { display: none; }

/* Greeting: large and centred like the app's empty state, then it shrinks to a header */
.gx__hello {
  margin: auto 0;
  text-align: center;
  transition: margin .4s ease;
}
.gx__hello.is-small { margin: 0 0 4px; }
.gx__hello-star {
  width: 96px; height: 96px;
  display: block; margin: 0 auto 10px;
  transition: width .4s ease, height .4s ease;
  animation: gxBob 4s ease-in-out infinite;
}
.gx__hello.is-small .gx__hello-star { width: 52px; height: 52px; }
.gx__hello-text {
  font-family: 'EB Garamond', serif;
  font-size: 22px;
  line-height: 1.25;
  color: var(--ink);
  transition: font-size .4s ease;
}
.gx__hello.is-small .gx__hello-text { font-size: 16px; color: var(--ink-soft); }
@keyframes gxBob {
  0%, 100% { transform: translateY(0) rotate(-4deg); }
  50%      { transform: translateY(-6px) rotate(4deg); }
}

.gx__user {
  align-self: flex-end;
  max-width: 80%;
  padding: 10px 14px;
  border-radius: 18px 18px 6px 18px;
  background: var(--accent);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  animation: gxIn .3s ease both;
}
.gx__reply { display: flex; flex-direction: column; gap: 10px; animation: gxIn .35s ease both; }
.gx__reply-text { font-family: 'EB Garamond', serif; font-size: 18px; line-height: 1.35; color: var(--ink); }
@keyframes gxIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: none; }
}

/* Shortlist carousel */
.gx-short__head {
  display: flex; justify-content: space-between; align-items: baseline;
  font-size: 13px; font-weight: 700; color: var(--ink);
  margin-bottom: 8px;
}
.gx-short__pos { font-size: 12px; color: var(--ink-mute); }
.gx-short__row {
  display: flex; gap: 10px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  margin: 0 -20px; padding: 2px 20px 6px;
  scrollbar-width: none;
}
.gx-short__row::-webkit-scrollbar { display: none; }
.gx-pick {
  flex: 0 0 86%;
  scroll-snap-align: start;
  display: flex; gap: 12px;
  padding: 12px;
  border-radius: 18px;
  background: var(--paper);
  border: 1px solid var(--line-soft);
}
.gx-pick__cover { width: 70px; height: 105px; object-fit: cover; border-radius: 8px; flex: none; box-shadow: 0 8px 16px -8px rgba(20, 25, 58, .45); }
.gx-pick__body { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.gx-pick__tag {
  align-self: flex-start;
  font-size: 10px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase;
  color: var(--accent-deep); background: var(--accent-tint);
  padding: 2px 8px; border-radius: 999px; margin-bottom: 4px;
}
.gx-pick__title { font-family: 'EB Garamond', serif; font-size: 17px; line-height: 1.15; color: var(--ink); }
.gx-pick__author { font-size: 12.5px; color: var(--ink-soft); }
.gx-pick__add {
  margin-top: auto;
  align-self: flex-start;
  border: 0;
  font: inherit; font-size: 12.5px; font-weight: 700;
  padding: 7px 14px;
  border-radius: 999px;
  background: var(--ink);
  color: #fff;
  cursor: pointer;
  transition: background .2s, transform .2s;
}
.gx-pick__add:hover { transform: translateY(-1px); }
.gx-pick__add.is-added { background: #2BB573; }
.gx-short__foot { font-size: 11.5px; color: var(--ink-mute); margin-top: 2px; }

/* Action card */
.gx-action {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 12px;
  border-radius: 16px;
  background: #EAF8F0;
  border: 1px solid #BFE9D1;
}
.gx-action__cover { width: 34px; height: 51px; object-fit: cover; border-radius: 5px; flex: none; }
.gx-action__text { display: flex; flex-direction: column; font-size: 12.5px; color: var(--ink-soft); }
.gx-action__text b { font-size: 14px; color: #1E7A4A; }
.gx-action__check {
  margin-left: auto; flex: none;
  width: 26px; height: 26px; border-radius: 50%;
  display: grid; place-items: center;
  background: #2BB573; color: #fff;
}

.gx__typing { display: flex; gap: 5px; padding: 6px 2px; }
.gx__typing span {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--accent-soft);
  animation: gxDot 1s ease-in-out infinite;
}
.gx__typing span:nth-child(2) { animation-delay: .15s; }
.gx__typing span:nth-child(3) { animation-delay: .3s; }
@keyframes gxDot {
  0%, 100% { transform: translateY(0); opacity: .5; }
  50%      { transform: translateY(-4px); opacity: 1; }
}

/* Example prompts and the input bar */
.gx__chips {
  display: flex; gap: 6px;
  overflow-x: auto;
  padding: 8px 20px;
  scrollbar-width: none;
}
.gx__chips::-webkit-scrollbar { display: none; }
.gx__chip {
  flex: none;
  border: 1px solid var(--line);
  background: #fff;
  color: var(--ink-soft);
  padding: 7px 12px;
  font: inherit; font-size: 12.5px; font-weight: 600;
  border-radius: 999px;
  cursor: pointer;
  transition: background .2s, color .2s, opacity .2s;
}
.gx__chip:hover:not(:disabled) { background: var(--accent-tint); color: var(--accent-deep); }
.gx__chip:disabled { opacity: .4; cursor: default; }
.gx__chip--reset { color: var(--accent-deep); border-color: var(--accent-tint); }

.gx__input {
  display: flex; align-items: center; gap: 10px;
  margin: 4px 16px 16px;
  padding: 6px 6px 6px 18px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: #fff;
  box-shadow: 0 6px 20px -12px rgba(20, 25, 58, .25);
}
.gx__placeholder { flex: 1; font-size: 14px; color: var(--ink-mute); }
.gx__send {
  width: 38px; height: 38px;
  border: 0; border-radius: 50%;
  display: grid; place-items: center;
  background: var(--ink); color: #fff;
  cursor: pointer;
  transition: transform .2s;
}
.gx__send:hover:not(:disabled) { transform: scale(1.06); }
.gx__send:disabled { opacity: .5; cursor: default; }

/* What Ginie does, as three quiet notes under the stage */
.gx-abilities {
  max-width: 1080px;
  margin: 56px auto 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}
.gx-ability {
  display: flex; flex-direction: column; gap: 4px;
  padding: 18px 20px;
  border-radius: 18px;
  background: rgba(255, 255, 255, .6);
  border: 1px solid var(--line-soft);
}
.gx-ability b { font-family: 'EB Garamond', serif; font-size: 19px; font-weight: 600; color: var(--ink); }
.gx-ability span { font-size: 14px; color: var(--ink-soft); line-height: 1.45; }

@media (max-width: 960px) {
  .gx-stage { grid-template-columns: 1fr; gap: 8px; }
  .gx-void { max-width: 340px; }
  .gx { width: 100%; max-width: 460px; justify-self: center; height: 580px; }
}
@media (max-width: 720px) {
  .ginie-section { padding: 100px 18px; }
  .gx-abilities { grid-template-columns: 1fr; }
}

@media (prefers-reduced-motion: reduce) {
  .gx__hello-star, .gx__typing span { animation: none; }
  .gx__user, .gx__reply { animation: none; }
}
</style>
