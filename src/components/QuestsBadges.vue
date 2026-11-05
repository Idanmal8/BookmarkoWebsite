<template>
  <section class="qb" id="quests">
    <header class="section-head" data-reveal>
      <span class="section-head__eyebrow">Quests and badges</span>
      <h2 class="section-head__title">Every month, <em>a little quest.</em></h2>
      <p class="section-head__sub">
        Read a few pages, tick off the month's challenges and earn badges
        that stay on your shelf for good.
      </p>
    </header>

    <!-- Badge pyramid: the active badge in front, the rest stepping back and fading on both sides -->
    <div
      ref="stageEl"
      class="qb-stage"
      data-reveal
      @mouseenter="paused = true"
      @mouseleave="paused = false"
    >
      <div class="qb-stage__glow" aria-hidden="true" />
      <div class="qb-row">
        <button
          v-for="(b, i) in BADGES"
          :key="b.title"
          class="qb-badge"
          :class="{ 'is-active': i === active }"
          :style="badgeStyle(i)"
          :aria-label="b.title"
          :tabindex="Math.abs(offset(i)) <= 2 ? 0 : -1"
          @click="active = i"
        >
          <img :src="b.src" alt="" />
        </button>
      </div>

      <div class="qb-caption" aria-live="polite">
        <b>{{ current.title }}</b>
        <span class="qb-caption__state" :class="`is-${current.state}`">{{ STATE_LABEL[current.state] }}</span>
        <span class="qb-caption__how">{{ current.how }}</span>
      </div>
    </div>

    <!-- This month, as the app's Quests screen shows it -->
    <div class="qb-quests" data-reveal>
      <div class="qb-headline">
        <img class="qb-headline__badge" :src="badgeNov" alt="" />
        <div class="qb-headline__body">
          <span class="qb-label">This month</span>
          <b>November Reader</b>
          <span>Read on 20 days this month.</span>
          <span class="qb-bar"><i style="--to: 60%" /></span>
          <span class="qb-headline__meta"><span>12 of 20</span><span>8 days left</span></span>
        </div>
      </div>

      <div class="qb-today">
        <span class="qb-label qb-label--list">Today</span>
        <ul class="qb-list">
          <li v-for="q in TODAY" :key="q.title" :class="{ 'is-done': q.done }">
            <span class="qb-list__check" aria-hidden="true">
              <svg v-if="q.done" width="12" height="12" viewBox="0 0 14 14"><path d="M3 7.5l2.6 2.6L11 4.6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" /></svg>
            </span>
            <span class="qb-list__text"><b>{{ q.title }}</b><span>{{ q.meta }}</span></span>
            <span class="qb-exp" :class="{ 'is-done': q.done }">
              <svg v-if="q.done" width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" /></svg>
              <svg v-else width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.7 5.6 6.1.8a.6.6 0 0 1 .3 1l-4.4 4.2 1.1 6.1a.6.6 0 0 1-.9.6L12 18.2l-5.4 2.9a.6.6 0 0 1-.9-.6l1.1-6.1L2.4 10.2a.6.6 0 0 1 .3-1l6.1-.8z" fill="currentColor" /></svg>
              {{ q.done ? 'Done' : `+${q.exp} EXP` }}
            </span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useReveal } from '@/composables/useReveal'
import badgeNov from '@/assets/showcase/badge-nov-2026.webp'
import badgeDec from '@/assets/showcase/badge-dec-2026.webp'
import badgePerfectWeek from '@/assets/showcase/badge-perfect-week.webp'
import badgeGoal from '@/assets/showcase/badge-goal-2026.webp'
import badgeGenres from '@/assets/showcase/badge-twelve-genres.webp'
import badge20 from '@/assets/showcase/badge-books-20.webp'
import badge50 from '@/assets/showcase/badge-books-50.webp'
import badge100 from '@/assets/showcase/badge-books-100.webp'
import badge150 from '@/assets/showcase/badge-books-150.webp'
import badge200 from '@/assets/showcase/badge-books-200.webp'

useReveal()

type BadgeState = 'earned' | 'progress' | 'locked'
const STATE_LABEL: Record<BadgeState, string> = { earned: 'Earned', progress: 'In progress', locked: 'Still to earn' }

const TODAY = [
  { title: 'Ten pages', meta: 'Done before breakfast', exp: 15, done: true },
  { title: 'A note in the margin', meta: 'Save a thought on any book', exp: 10, done: false },
  { title: 'Perfect week', meta: '5 of 7 days this week', exp: 100, done: false },
]

// Titles from Bookmarko/assets/badges/badges.json; the hidden easter egg badge stays out.
const BADGES: { title: string; src: string; state: BadgeState; how: string }[] = [
  { title: 'November Reader', src: badgeNov, state: 'progress', how: 'Read on 20 days in November. Only this month.' },
  { title: 'Perfect week', src: badgePerfectWeek, state: 'earned', how: 'Read every day for a week.' },
  { title: 'Twenty books', src: badge20, state: 'earned', how: 'Finish twenty books.' },
  { title: 'Twelve genres', src: badgeGenres, state: 'earned', how: 'Read across twelve genres.' },
  { title: 'Your reading goal', src: badgeGoal, state: 'progress', how: 'Hit the goal you set for 2026.' },
  { title: 'Fifty books', src: badge50, state: 'earned', how: 'Finish fifty books.' },
  { title: 'Seven in a row', src: badgeDec, state: 'locked', how: "December's badge. Opens on the first." },
  { title: 'A hundred books', src: badge100, state: 'locked', how: 'Finish a hundred books.' },
  { title: 'A hundred and fifty', src: badge150, state: 'locked', how: 'Finish a hundred and fifty books.' },
  { title: 'Two hundred books', src: badge200, state: 'locked', how: 'Finish two hundred books.' },
]

const N = BADGES.length
const active = ref(0)
const paused = ref(false)
const current = computed(() => BADGES[active.value])

// Signed distance from the active badge, wrapped so the row loops in both directions.
const offset = (i: number) => ((i - active.value + N + Math.floor(N / 2)) % N) - Math.floor(N / 2)

function badgeStyle(i: number) {
  const d = offset(i), a = Math.abs(d)
  return {
    transform: `translate(-50%, -50%) translateX(${d * 46}%) scale(${1 - a * 0.17})`,
    opacity: a > 4 ? 0 : 1 - a * 0.2,
    zIndex: 10 - a,
    pointerEvents: a > 4 ? 'none' : 'auto',
  } as const
}

// Steps one badge forward every few seconds while the row is on screen and not hovered.
const stageEl = ref<HTMLElement | null>(null)
let visible = false
let timer = 0
let io: IntersectionObserver | null = null

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if ('IntersectionObserver' in window && stageEl.value) {
    io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }, { threshold: 0.3 })
    io.observe(stageEl.value)
  }
  timer = window.setInterval(() => {
    if (visible && !paused.value && !document.hidden) active.value = (active.value + 1) % N
  }, 2800)
})

onBeforeUnmount(() => {
  io?.disconnect()
  window.clearInterval(timer)
})
</script>

<style scoped>
.qb { padding: 130px 36px; background: transparent; overflow: hidden; }

.section-head { max-width: 760px; margin: 0 auto 24px; text-align: center; }
.section-head__eyebrow {
  display: inline-block;
  font-size: 12px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase;
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
.section-head__title em { font-style: italic; font-weight: 400; }
.section-head__sub { margin: 18px auto 0; font-size: 17px; line-height: 1.6; color: var(--ink-soft); max-width: 560px; }

/* ---------- Badge pyramid ---------- */
.qb-stage { position: relative; max-width: 1100px; margin: 0 auto; }
.qb-stage__glow {
  position: absolute; left: 50%; top: 150px;
  width: 420px; height: 300px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(closest-side, rgba(255, 179, 206, .55), rgba(165, 194, 244, .25) 60%, transparent);
  pointer-events: none;
}
.qb-row { position: relative; height: 300px; }
.qb-badge {
  position: absolute; left: 50%; top: 50%;
  width: 230px; height: 230px;
  padding: 0; border: 0; background: none;
  cursor: pointer;
  transition: transform .7s cubic-bezier(.22, 1, .36, 1), opacity .7s ease;
}
.qb-badge img {
  display: block; width: 100%; height: 100%; object-fit: contain;
  filter: drop-shadow(0 18px 22px rgba(20, 25, 58, .18));
}
.qb-badge.is-active img { animation: qbFloat 3.2s ease-in-out infinite; }
.qb-badge:not(.is-active):hover { filter: brightness(1.05); }
.qb-badge:focus-visible { outline: none; }
.qb-badge:focus-visible img { outline: 3px solid var(--accent); outline-offset: 4px; border-radius: 30%; }
@keyframes qbFloat {
  0%, 100% { transform: translateY(0) rotate(-2deg); }
  50%      { transform: translateY(-8px) rotate(2deg); }
}

.qb-caption { display: flex; flex-direction: column; align-items: center; gap: 6px; margin-top: 18px; min-height: 92px; text-align: center; }
.qb-caption b { font-family: 'EB Garamond', serif; font-size: 28px; font-weight: 600; color: var(--ink); }
.qb-caption__state { font-size: 11.5px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; padding: 4px 11px; border-radius: 999px; }
.qb-caption__state.is-earned { background: #DDF5E6; color: #1E7A4A; }
.qb-caption__state.is-progress { background: var(--pink-tint); color: var(--pink-deep); }
.qb-caption__state.is-locked { background: var(--line-soft); color: var(--ink-mute); }
.qb-caption__how { font-size: 15px; color: var(--ink-soft); }

/* ---------- This month ---------- */
.qb-quests {
  max-width: 900px;
  margin: 56px auto 0;
  padding: 22px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px;
  align-items: start;
  border-radius: 28px;
  background: #fff;
  border: 1px solid var(--line-soft);
  box-shadow: 0 40px 80px -40px rgba(81, 112, 255, .35), 0 12px 30px -18px rgba(20, 25, 58, .18);
}
.qb-label { font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--ink-mute); }
.qb-label--list { display: block; margin: 2px 4px 8px; }

.qb-headline {
  display: flex; gap: 16px; align-items: center;
  padding: 16px;
  border-radius: 22px;
  background: #E5F5FE;
  border: 2px solid #1CB0F6;
}
.qb-headline__badge { width: 84px; height: 84px; flex: none; object-fit: contain; }
.qb-headline__body { flex: 1; display: flex; flex-direction: column; gap: 2px; font-size: 13.5px; color: var(--ink-soft); }
.qb-headline__body b { font-family: 'EB Garamond', serif; font-size: 23px; font-weight: 600; color: var(--ink); line-height: 1.1; }
.qb-headline__meta { display: flex; justify-content: space-between; font-size: 12px; font-weight: 700; color: #0B7FB8; }

.qb-bar { display: block; height: 8px; margin: 8px 0 4px; border-radius: 999px; background: rgba(28, 176, 246, .18); overflow: hidden; }
.qb-bar i { display: block; height: 100%; width: 0; border-radius: inherit; background: #1CB0F6; transition: width 1.4s cubic-bezier(.16, .84, .44, 1) .3s; }
.qb-quests.is-revealed .qb-bar i { width: var(--to); }

.qb-list { list-style: none; display: flex; flex-direction: column; gap: 8px; }
.qb-list li {
  display: flex; align-items: center; gap: 12px;
  padding: 11px 14px;
  border-radius: 16px;
  background: var(--paper);
  border: 1px solid var(--line-soft);
}
.qb-list__check {
  width: 24px; height: 24px; flex: none;
  border-radius: 50%;
  display: grid; place-items: center;
  border: 2px solid var(--line);
  color: #fff;
}
.qb-list li.is-done .qb-list__check { background: #2BB573; border-color: #2BB573; }
.qb-list__text { flex: 1; display: flex; flex-direction: column; font-size: 12.5px; color: var(--ink-mute); min-width: 0; }
.qb-list__text b { font-size: 14.5px; color: var(--ink); }
.qb-list li.is-done .qb-list__text b { text-decoration: line-through; text-decoration-color: var(--ink-mute); }
/* The app's QuestRewardPill: a sticker chip with an ink edge and a hard shadow,
   yellow while open and green once done */
.qb-exp {
  flex: none;
  display: inline-flex; align-items: center; gap: 3px;
  padding: 4px 10px 4px 7px;
  border-radius: 999px;
  font-size: 12px; font-weight: 800;
  color: #111114;
  background: #FFE58A;
  border: 2px solid #111114;
  box-shadow: 0 2px 0 #111114;
}
.qb-exp.is-done { background: #B9E8AE; }

@media (max-width: 860px) {
  .qb-row { height: 230px; }
  .qb-badge { width: 170px; height: 170px; }
  .qb-stage__glow { top: 115px; width: 300px; height: 220px; }
  .qb-quests { grid-template-columns: 1fr; max-width: 520px; }
}
@media (max-width: 720px) {
  .qb { padding: 100px 18px; }
}
@media (prefers-reduced-motion: reduce) {
  .qb-badge { transition: none; }
  .qb-badge.is-active img { animation: none; }
  .qb-bar i { transition: none; }
}
</style>
