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
import badgeFirstLight from '@/assets/showcase/badge-first-light.webp'
import badgeFullShelf from '@/assets/showcase/badge-full-shelf.webp'
import badgeDoorstopper from '@/assets/showcase/badge-doorstopper.webp'
import badgeTenK from '@/assets/showcase/badge-ten-thousand-pages.webp'
import badgeMoon from '@/assets/showcase/badge-moon-cycle.webp'
import badgeHundredDays from '@/assets/showcase/badge-hundred-days.webp'
import badgeMarginalia from '@/assets/showcase/badge-marginalia.webp'
import badgeCritic from '@/assets/showcase/badge-critic.webp'

useReveal()

type BadgeState = 'earned' | 'progress' | 'locked'
const STATE_LABEL: Record<BadgeState, string> = { earned: 'Earned', progress: 'In progress', locked: 'Still to earn' }

// Art and titles from Bookmarko/assets/badges (badges.json, the award style redrawn 2026-11-12),
// converted to 460px webp. The hidden easter egg badge (two_books) stays out.
const BADGES: { title: string; src: string; state: BadgeState; how: string }[] = [
  { title: 'November Reader', src: badgeNov, state: 'progress', how: 'Read on 20 days in November. Only this month.' },
  { title: 'Perfect week', src: badgePerfectWeek, state: 'earned', how: 'Read every day for a week.' },
  { title: 'First Light', src: badgeFirstLight, state: 'earned', how: 'Finish your first book.' },
  { title: 'Full Shelf', src: badgeFullShelf, state: 'earned', how: 'Finish ten books.' },
  { title: 'Twenty books', src: badge20, state: 'earned', how: 'Finish twenty books.' },
  { title: 'Twelve genres', src: badgeGenres, state: 'earned', how: 'Read across twelve genres.' },
  { title: 'Moon Cycle', src: badgeMoon, state: 'earned', how: 'Read 30 days in a row.' },
  { title: 'Your reading goal', src: badgeGoal, state: 'progress', how: 'Hit the goal you set for 2026.' },
  { title: 'Marginalia', src: badgeMarginalia, state: 'progress', how: 'Write fifty notes in your books.' },
  { title: 'Critic', src: badgeCritic, state: 'progress', how: 'Write ten reviews.' },
  { title: 'Ten Thousand Pages', src: badgeTenK, state: 'progress', how: 'Read ten thousand pages.' },
  { title: 'Fifty books', src: badge50, state: 'earned', how: 'Finish fifty books.' },
  { title: 'Doorstopper', src: badgeDoorstopper, state: 'locked', how: 'Finish a book over 700 pages.' },
  { title: 'Seven in a row', src: badgeDec, state: 'locked', how: "December's badge. Opens on the first." },
  { title: 'Hundred Days', src: badgeHundredDays, state: 'locked', how: 'Read 100 days in a row.' },
  { title: 'Hundred books', src: badge100, state: 'locked', how: 'Finish a hundred books.' },
  { title: 'Book fort', src: badge150, state: 'locked', how: 'Finish a hundred and fifty books.' },
  { title: 'Book royalty', src: badge200, state: 'locked', how: 'Finish two hundred books.' },
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

@media (max-width: 860px) {
  .qb-row { height: 230px; }
  .qb-badge { width: 170px; height: 170px; }
  .qb-stage__glow { top: 115px; width: 300px; height: 220px; }
}
@media (max-width: 720px) {
  .qb { padding: 100px 18px; }
}
@media (prefers-reduced-motion: reduce) {
  .qb-badge { transition: none; }
  .qb-badge.is-active img { animation: none; }
}
</style>
