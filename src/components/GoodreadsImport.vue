<template>
  <section class="gr" id="goodreads">
    <header class="section-head" data-reveal>
      <span class="section-head__eyebrow">Coming from Goodreads</span>
      <h2 class="section-head__title">Your reading years <em>come with you.</em></h2>
      <p class="section-head__sub">
        One file and your whole history lands on your shelf: read, reading, want to read,
        covers and ratings. Then everything Goodreads never gave you starts working.
      </p>
    </header>

    <div ref="gridEl" class="gr__grid" data-reveal>
      <!-- What the import brings over -->
      <div class="gr-receipt">
        <div class="gr-receipt__logos" aria-hidden="true">
          <img src="@/assets/goodL.webp" alt="" />
          <span class="gr-receipt__dots"><i /><i /><i /><i /><i /></span>
          <img src="@/assets/bookL.webp" alt="" />
        </div>
        <div class="gr-receipt__title">
          <b>Import complete</b>
          <span class="gr-receipt__tick" aria-hidden="true">
            <svg width="12" height="12" viewBox="0 0 14 14"><path d="M3 7.5l2.6 2.6L11 4.6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </span>
        </div>
        <ul class="gr-receipt__rows">
          <li v-for="r in ROWS" :key="r.label">
            <span class="gr-receipt__dot" :style="{ background: r.color }" />
            <span>{{ r.label }}</span>
            <b>{{ shown(r.value) }}</b>
          </li>
        </ul>
        <div class="gr-receipt__bar"><i :style="{ width: `${progress * 100}%` }" /></div>
        <ol class="gr-receipt__steps">
          <li><span>1</span>Export your library on Goodreads</li>
          <li><span>2</span>Profile, then Import from Goodreads</li>
          <li><span>3</span>Pick the file. That's it.</li>
        </ol>
        <p class="gr-receipt__note">Example import</p>
      </div>

      <!-- What starts working once it's here -->
      <div class="gr-gets">
        <h3 class="gr-gets__title">Then the good part</h3>
        <div v-for="g in GETS" :key="g.title" class="gr-get">
          <img class="gr-get__mascot" :src="g.mascot" alt="" :style="{ transform: `rotate(${g.tilt}deg)` }" />
          <div>
            <b>{{ g.title }}</b>
            <span>{{ g.body }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useReveal } from '@/composables/useReveal'
import mascotHeart from '@/assets/showcase/mascot-heart.svg'
import mascotClover from '@/assets/showcase/mascot-clover.svg'
import mascotCupcake from '@/assets/showcase/mascot-cupcake.svg'
import mascotKeycap from '@/assets/showcase/mascot-keycap.svg'

useReveal()

const ROWS = [
  { label: 'Read', value: 312, color: '#2BB573' },
  { label: 'Want to read', value: 87, color: '#5170FF' },
  { label: 'Currently reading', value: 3, color: '#FF8A3D' },
  { label: 'Ratings kept', value: 248, color: '#FF4F8B' },
]

const GETS = [
  { mascot: mascotHeart, tilt: -8, title: 'Ginie, ready on day one', body: 'Ask what to read next, right beside the shelf you just brought over.' },
  { mascot: mascotClover, tilt: 6, title: 'Streaks and quests', body: 'Every page you log keeps a streak alive and moves a monthly quest forward.' },
  { mascot: mascotCupcake, tilt: -5, title: 'A year you can see', body: 'Your reading calendar fills with covers, one day at a time.' },
  { mascot: mascotKeycap, tilt: 9, title: 'Collections your way', body: 'Turn old shelves into collections with their own cover and order.' },
]

// Counts the rows up once when the card scrolls into view.
const progress = ref(0)
const gridEl = ref<HTMLElement | null>(null)
const shown = (v: number) => Math.round(v * progress.value).toLocaleString('en-US')
let io: IntersectionObserver | null = null
let raf = 0

function countUp() {
  const start = performance.now()
  const step = (now: number) => {
    const t = Math.min((now - start) / 1400, 1)
    progress.value = 1 - (1 - t) ** 3
    if (t < 1) raf = requestAnimationFrame(step)
  }
  raf = requestAnimationFrame(step)
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    progress.value = 1
    return
  }
  io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return
    io?.disconnect()
    countUp()
  }, { threshold: 0.4 })
  if (gridEl.value) io.observe(gridEl.value)
})

onBeforeUnmount(() => {
  io?.disconnect()
  cancelAnimationFrame(raf)
})
</script>

<style scoped>
.gr { padding: 130px 36px; background: transparent; }

.section-head {
  max-width: 760px;
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
.section-head__title em { font-style: italic; font-weight: 400; }
.section-head__sub {
  margin: 18px auto 0;
  font-size: 17px;
  line-height: 1.6;
  color: var(--ink-soft);
  max-width: 600px;
}

.gr__grid {
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 400px minmax(0, 1fr);
  gap: 56px;
  align-items: center;
}

/* The import, as a receipt card */
.gr-receipt {
  position: relative;
  padding: 26px 26px 20px;
  border-radius: 28px;
  background: #fff;
  border: 1px solid var(--line-soft);
  box-shadow: 0 40px 80px -40px rgba(81, 112, 255, .35), 0 12px 30px -18px rgba(20, 25, 58, .18);
}
.gr-receipt__logos { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
.gr-receipt__logos img { width: 48px; height: 48px; border-radius: 14px; object-fit: cover; box-shadow: 0 6px 14px -8px rgba(20, 25, 58, .4); }
.gr-receipt__dots { flex: 1; display: flex; justify-content: space-between; padding: 0 4px; }
.gr-receipt__dots i {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--accent-soft);
  animation: grDot 1.6s ease-in-out infinite;
}
.gr-receipt__dots i:nth-child(2) { animation-delay: .12s; }
.gr-receipt__dots i:nth-child(3) { animation-delay: .24s; }
.gr-receipt__dots i:nth-child(4) { animation-delay: .36s; }
.gr-receipt__dots i:nth-child(5) { animation-delay: .48s; }
@keyframes grDot {
  0%, 100% { background: var(--accent-soft); transform: scale(1); }
  50%      { background: var(--accent); transform: scale(1.35); }
}

.gr-receipt__title { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
.gr-receipt__title b { font-family: 'EB Garamond', serif; font-size: 24px; font-weight: 600; color: var(--ink); }
.gr-receipt__tick { width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; background: #2BB573; color: #fff; }

.gr-receipt__rows { list-style: none; display: flex; flex-direction: column; }
.gr-receipt__rows li {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid var(--line-soft);
  font-size: 14.5px; color: var(--ink-soft);
}
.gr-receipt__rows b {
  margin-left: auto;
  font-family: 'EB Garamond', serif;
  font-size: 22px; font-weight: 600;
  color: var(--ink);
  font-variant-numeric: tabular-nums;
}
.gr-receipt__dot { width: 9px; height: 9px; border-radius: 50%; flex: none; }

.gr-receipt__bar { height: 6px; border-radius: 999px; background: var(--line-soft); overflow: hidden; margin: 16px 0 18px; }
.gr-receipt__bar i { display: block; height: 100%; border-radius: inherit; background: #2BB573; }

.gr-receipt__steps { list-style: none; display: flex; flex-direction: column; gap: 6px; }
.gr-receipt__steps li { display: flex; align-items: center; gap: 10px; font-size: 13px; color: var(--ink-soft); }
.gr-receipt__steps span {
  width: 20px; height: 20px; flex: none;
  border-radius: 50%;
  display: grid; place-items: center;
  font-size: 11px; font-weight: 700;
  background: var(--accent-tint); color: var(--accent-deep);
}
.gr-receipt__note {
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid var(--line-soft);
  font-size: 10.5px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase;
  color: var(--ink-mute);
}

/* What you get */
.gr-gets { display: flex; flex-direction: column; gap: 22px; }
.gr-gets__title {
  font-size: 12px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase;
  color: var(--pink-deep);
}
.gr-get { display: flex; align-items: center; gap: 18px; }
.gr-get__mascot { width: 64px; height: 64px; flex: none; object-fit: contain; }
.gr-get b { display: block; font-family: 'EB Garamond', serif; font-size: 22px; font-weight: 600; color: var(--ink); line-height: 1.15; }
.gr-get span { display: block; margin-top: 3px; font-size: 15px; line-height: 1.5; color: var(--ink-soft); }

@media (max-width: 900px) {
  .gr__grid { grid-template-columns: 1fr; gap: 48px; max-width: 520px; }
}
@media (max-width: 720px) {
  .gr { padding: 100px 18px; }
}
@media (prefers-reduced-motion: reduce) {
  .gr-receipt__dots i { animation: none; }
}
</style>
