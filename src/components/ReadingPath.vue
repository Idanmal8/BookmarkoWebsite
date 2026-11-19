<template>
  <section class="rp" id="path">
    <header class="section-head" data-reveal>
      <span class="section-head__eyebrow">The reading path</span>
      <h2 class="section-head__title">Just <em>one more page.</em></h2>
      <p class="section-head__sub">
        Every day you read drops a coin on your path. Friends along the road
        hand out little quests, and a finished book pays out in gems.
      </p>
    </header>

    <!-- The path as the app draws it: the days behind Boo, today's coin beside
         her, the days to come leading to a reward book. The app's own art. -->
    <div class="rp-stage" data-reveal>
      <svg
        class="rp-scene"
        viewBox="0 0 1600 560"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="A winding path of day coins. Boo toasts a marshmallow at her campfire beside today's coin; the days ahead lead to a reward book."
      >
        <path :d="road" class="rp-road rp-road--edge" transform="translate(0 9)" />
        <path :d="road" class="rp-road" />
        <path :d="road" class="rp-road rp-road--dash" />

        <image class="rp-drift" :href="art.cloud_looks_right" x="20" y="-28" width="170" height="170" />
        <g class="rp-hover rp-hover--slow rp-far">
          <image :href="art.ginie_sparkles" x="1127" y="23" width="106" height="114" />
          <image :href="art.ginie_body" x="1127" y="23" width="106" height="114" />
        </g>

        <image class="rp-gem rp-gem--a" :href="art.gem" x="1262" y="52" width="46" height="46" />
        <image class="rp-gem rp-gem--b" :href="art.gem" x="1532" y="40" width="38" height="38" />
        <image :href="art.book_rare" x="1302" y="12" width="276" height="276" />

        <g class="rp-hover">
          <image class="rp-shadow" :href="art.flower_shadow" x="270" y="95" width="126" height="135" />
          <image :href="art.flower_petals" x="270" y="95" width="126" height="135" />
          <image class="rp-blink rp-blink--open" :href="art.flower_body" x="270" y="95" width="126" height="135" />
          <image class="rp-blink rp-blink--shut" :href="art.flower_blink" x="270" y="95" width="126" height="135" />
        </g>

        <!-- Boo's camp: nine layers in one frame, as the app moves them. -->
        <g class="rp-camp">
          <image class="rp-camp__glow" :href="art.camp_glow" v-bind="CAMP" />
          <image class="rp-camp__boo rp-blink rp-blink--open" :href="art.camp_boo" v-bind="CAMP" />
          <image class="rp-camp__boo rp-blink rp-blink--shut" :href="art.camp_boo_blink" v-bind="CAMP" />
          <image :href="art.camp_fire_back" v-bind="CAMP" />
          <image class="rp-flame rp-flame--a" :href="art.camp_flame_a" v-bind="CAMP" />
          <image class="rp-flame rp-flame--b" :href="art.camp_flame_b" v-bind="CAMP" />
          <image class="rp-flame rp-flame--c" :href="art.camp_flame_c" v-bind="CAMP" />
          <image :href="art.camp_fire_front" v-bind="CAMP" />
          <image class="rp-camp__stick" :href="art.camp_stick" v-bind="CAMP" />
          <image class="rp-camp__sparks" :href="art.camp_sparks" v-bind="CAMP" />
        </g>

        <g
          v-for="(c, i) in coins"
          :key="i"
          class="rp-coin"
          :class="{ 'rp-coin--today': c.today }"
          :style="{ '--i': i }"
        >
          <image :href="art[c.art]" :x="c.x - c.w / 2" :y="c.y - c.w * 0.6" :width="c.w" :height="c.w" />
          <image v-if="c.crown" :href="art.crown" :x="c.x - c.w / 2" :y="c.y - c.w * 0.6" :width="c.w" :height="c.w" />
          <image
            v-if="c.stars"
            :href="c.stars === 3 ? art.stars_3 : art.stars_2"
            :x="c.x - c.w * 0.27"
            :y="c.y + c.w * 0.31"
            :width="c.w * 0.54"
            :height="c.w * 0.216"
          />
          <g v-if="c.today" class="rp-today">
            <rect :x="c.x - 37" :y="c.y - c.w * 0.6 - 4" width="74" height="26" rx="13" />
            <text :x="c.x" :y="c.y - c.w * 0.6 + 14">TODAY</text>
          </g>
        </g>

        <image :href="art.gamestick_looks_right" x="18" y="312" width="184" height="184" />
        <image :href="art.earth_looks_left" x="1248" y="352" width="158" height="158" />
      </svg>
    </div>

    <div class="rp-cards">
      <!-- A day's three stars -->
      <article class="rp-card" data-reveal>
        <div class="rp-demo rp-demo--stars">
          <div class="rp-stars" :class="{ 'is-perfect': stars === 3 }" aria-hidden="true">
            <span v-for="(s, i) in STAR_SIDES" :key="s" class="rp-star" :class="[`rp-star--${s}`, { 'is-on': stars > i }]">
              <img :src="art[`star_${s}_empty`]" alt="" />
              <img class="rp-star__gold" :src="art[`star_${s}`]" alt="" />
            </span>
          </div>
          <ul class="rp-goals">
            <li v-for="(g, i) in GOALS" :key="g" :class="{ 'is-done': stars > i }">
              <span class="rp-check" aria-hidden="true">
                <svg width="12" height="12" viewBox="0 0 14 14"><path d="M3 7.5l2.6 2.6L11 4.6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" /></svg>
              </span>
              {{ g }}
            </li>
          </ul>
          <button class="rp-btn" type="button" :disabled="reading" @click="readToday">
            {{ stars === 3 ? 'Perfect day! Read again' : 'Read a chapter' }}
          </button>
          <span class="rp-live" aria-live="polite">{{ stars === 3 ? 'Three stars: a perfect day.' : '' }}</span>
        </div>
        <span class="rp-label">Every day</span>
        <h3>Three stars to catch</h3>
        <p>A page earns one. Ten pages, two. A whole chapter makes it a perfect day.</p>
      </article>

      <!-- A friend's quests -->
      <article class="rp-card" data-reveal>
        <div class="rp-demo rp-demo--quests">
          <div class="rp-friend">
            <svg class="rp-friend__art" viewBox="0 0 126 135" aria-hidden="true">
              <g class="rp-hover">
                <image class="rp-shadow" :href="art.flower_shadow" width="126" height="135" />
                <image :href="art.flower_petals" width="126" height="135" />
                <image class="rp-blink rp-blink--open" :href="art.flower_body" width="126" height="135" />
                <image class="rp-blink rp-blink--shut" :href="art.flower_blink" width="126" height="135" />
              </g>
            </svg>
            <div>
              <b>Flower's quests</b>
              <span>For this book · 2 of 3 done</span>
            </div>
          </div>
          <ul class="rp-quests">
            <li v-for="q in QUESTS" :key="q.title" :class="{ 'is-done': q.done }">
              <span class="rp-quests__text">
                <b>{{ q.title }}</b>
                <span class="rp-bar"><i :style="{ '--to': q.done ? '100%' : '0%' }" /></span>
              </span>
              <span v-if="q.done" class="rp-check is-on" aria-label="Done">
                <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 7.5l2.6 2.6L11 4.6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" /></svg>
              </span>
              <span v-else class="rp-quests__count">0/1</span>
            </li>
          </ul>
          <div class="rp-prize">
            <img :src="art.reward_book" alt="" />
            Do all three for a reward book
          </div>
        </div>
        <span class="rp-label">Every book</span>
        <h3>Friends with quests</h3>
        <p>Boo and her friends wait along the road with three small quests for the book you're on.</p>
      </article>

      <!-- A reward book -->
      <article class="rp-card" data-reveal>
        <div class="rp-demo rp-demo--reward">
          <button
            class="rp-book"
            :class="`is-${book}`"
            type="button"
            :aria-label="book === 'open' ? 'Close the reward book' : 'Open the reward book'"
            :disabled="book === 'jumping'"
            @click="tapBook"
          >
            <img class="rp-book__shut" :src="art.book_rare" alt="" />
            <img class="rp-book__open" :src="art.marker_book" alt="" />
            <span class="rp-burst" aria-hidden="true">
              <img v-for="(g, i) in BURST" :key="i" :src="art.gem" alt="" :style="g" />
            </span>
          </button>
          <div class="rp-won" :class="{ 'is-shown': book === 'open' }" aria-live="polite">
            <span class="rp-tier">Rare</span>
            <span class="rp-gems"><img :src="art.gem" alt="" />+{{ gems }} <small>gems</small></span>
          </div>
          <span class="rp-hint" :class="{ 'is-hidden': book !== 'shut' }">Tap the book to open it</span>
        </div>
        <span class="rp-label">Every finish</span>
        <h3>A book that pays</h3>
        <p>Finish a book, or all three of a friend's quests, and a reward book opens. Some are rarer than others.</p>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { useReveal } from '@/composables/useReveal'

useReveal()

// The app's own vector art (Bookmarko/assets/images/reading_path, the reward
// book from tasks/reward_icons, the gem from tasks/gem_pour), by file name.
const files = import.meta.glob('@/assets/reading-path/*.svg', { eager: true, query: '?url', import: 'default' }) as Record<string, string>
const art: Record<string, string> = {}
for (const [path, url] of Object.entries(files)) art[path.split('/').pop()!.replace('.svg', '')] = url

// ---- The path -----------------------------------------------------------------
// Drawn in a 1600 x 560 scene. The same recipe as the store art
// (BookmarkoAssets/Bookmarko_Reading_Game_Store/source/kit.py): a smooth line
// through a few waypoints, a coin every so often along it.

type Pt = [number, number]
const WAYPOINTS: Pt[] = [[-120, 330], [130, 205], [335, 335], [545, 425], [750, 412], [945, 300], [1135, 388], [1290, 292], [1392, 222]]
const COIN = 126
const TODAY_NEAR: Pt = [945, 300]
// Oldest first: three books' colours, a crown on the perfect days.
const DAYS: { art: string; crown: boolean; stars: 2 | 3 }[] = [
  { art: 'coin_teal_read', crown: true, stars: 3 },
  { art: 'coin_teal_read', crown: false, stars: 2 },
  { art: 'coin_teal_read', crown: true, stars: 3 },
  { art: 'coin_pink_read', crown: false, stars: 2 },
  { art: 'coin_pink_read', crown: true, stars: 3 },
  { art: 'coin_pink_read', crown: true, stars: 3 },
  { art: 'coin_orange_read', crown: true, stars: 3 },
  { art: 'coin_orange_read', crown: false, stars: 2 },
  { art: 'coin_orange_read', crown: true, stars: 3 },
]
const CAMP = { x: 580, y: 160, width: 250, height: 178 }

/** A smooth line through the waypoints (Catmull-Rom). */
function spline(points: Pt[], per = 28): Pt[] {
  const p = [points[0], ...points, points[points.length - 1]]
  const out: Pt[] = []
  for (let i = 1; i < p.length - 2; i++) {
    const [a, b, c, d] = [p[i - 1], p[i], p[i + 1], p[i + 2]]
    for (let k = 0; k < per; k++) {
      const t = k / per
      const at = (n: 0 | 1) =>
        0.5 * (2 * b[n] + (-a[n] + c[n]) * t + (2 * a[n] - 5 * b[n] + 4 * c[n] - d[n]) * t * t + (-a[n] + 3 * b[n] - 3 * c[n] + d[n]) * t ** 3)
      out.push([at(0), at(1)])
    }
  }
  out.push(points[points.length - 1])
  return out
}

/** Points along the line, `gap` apart. */
function along(line: Pt[], start: number, gap: number): Pt[] {
  const out: Pt[] = []
  let want = start
  let run = 0
  for (let i = 0; i < line.length - 1; i++) {
    const [a, b] = [line[i], line[i + 1]]
    const seg = Math.hypot(b[0] - a[0], b[1] - a[1])
    while (seg > 0 && run + seg >= want) {
      const t = (want - run) / seg
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t])
      want += gap
    }
    run += seg
  }
  return out
}

const line = spline(WAYPOINTS)
const road = 'M' + line.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L')
const spots = along(line, COIN * 0.52, COIN * 1.04)
const todayAt = spots.reduce((best, s, i) => (dist(s, TODAY_NEAR) < dist(spots[best], TODAY_NEAR) ? i : best), 0)
function dist(a: Pt, b: Pt) {
  return Math.hypot(a[0] - b[0], a[1] - b[1])
}

const coins = spots
  .map(([x, y], i) => {
    if (i === todayAt) return { x, y, w: COIN * 1.12, art: 'coin_orange_today', crown: false, stars: 0, today: true }
    if (i > todayAt) return { x, y, w: COIN, art: 'coin_future', crown: false, stars: 0, today: false }
    const day = DAYS[(DAYS.length - (todayAt - i) + DAYS.length * 4) % DAYS.length]
    return { x, y, w: COIN, art: day.art, crown: day.crown, stars: day.stars, today: false }
  })
  // The nearer coin is drawn over the further one.
  .sort((a, b) => a.y - b.y)

// ---- A day's three stars ------------------------------------------------------

const STAR_SIDES = ['l', 'm', 'r'] as const
const GOALS = ['Read a page', 'Read 10 pages', 'Read a chapter']
const stars = ref(1)
const reading = ref(false)
const timers: number[] = []
const still = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function later(ms: number, run: () => void) {
  timers.push(window.setTimeout(run, still ? 0 : ms))
}

function readToday() {
  if (reading.value) return
  reading.value = true
  if (stars.value === 3) stars.value = 0
  const from = stars.value
  for (let s = from + 1; s <= 3; s++) later((s - from) * 520, () => (stars.value = s))
  later((3 - from) * 520 + 300, () => (reading.value = false))
}

// ---- A friend's quests --------------------------------------------------------

const QUESTS = [
  { title: 'Read 110 pages', done: true },
  { title: 'Write a review', done: true },
  { title: 'Write a post about your book', done: false },
]

// ---- A reward book ------------------------------------------------------------

const RARE_GEMS = 25 // what a rare reward book holds in the app
const book = ref<'shut' | 'jumping' | 'open'>('shut')
const gems = ref(0)
let counting = 0

// Where each gem of the burst lands, round the open book.
const BURST = [
  [-92, -8, -24, 0], [-58, -62, 14, 60], [-18, -92, -10, 120], [28, -86, 22, 40],
  [66, -52, -16, 160], [96, -4, 12, 90], [-104, 50, 8, 200], [106, 54, -12, 140],
].map(([x, y, turn, wait]) => ({ '--x': `${x}px`, '--y': `${y}px`, '--turn': `${turn}deg`, '--wait': `${wait}ms` }))

function tapBook() {
  if (book.value === 'jumping') return
  if (book.value === 'open') {
    book.value = 'shut'
    gems.value = 0
    cancelAnimationFrame(counting)
    return
  }
  book.value = 'jumping'
  // Three jumps, as the app's reward book makes, then it opens.
  later(1150, () => {
    book.value = 'open'
    if (still) {
      gems.value = RARE_GEMS
      return
    }
    const began = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - began - 250) / 900)
      gems.value = Math.round(RARE_GEMS * Math.max(0, t))
      if (t < 1) counting = requestAnimationFrame(tick)
    }
    counting = requestAnimationFrame(tick)
  })
}

onBeforeUnmount(() => {
  timers.forEach((t) => window.clearTimeout(t))
  cancelAnimationFrame(counting)
})
</script>

<style scoped>
.rp { padding: 130px 36px; background: transparent; overflow: hidden; }

.section-head { max-width: 760px; margin: 0 auto 28px; text-align: center; }
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

/* ---------- The path ---------- */
.rp-stage { max-width: 1240px; margin: 0 auto; }
.rp-scene { display: block; width: 100%; height: auto; aspect-ratio: 1600 / 560; overflow: visible; }

.rp-road { fill: none; stroke: #E4EBFB; stroke-width: 108; stroke-linecap: round; stroke-linejoin: round; }
.rp-road--edge { stroke: #C7D4F4; }
.rp-road--dash { stroke: #fff; stroke-width: 5; stroke-dasharray: 22 28; }

.rp-scene image, .rp-scene g { transform-box: fill-box; }

/* Each day's coin drops onto the path in turn once the scene is in view. */
.rp-coin { transform-origin: 50% 100%; }
.rp-stage:not(.is-revealed) .rp-coin { opacity: 0; }
.rp-stage.is-revealed .rp-coin { animation: rpDrop .62s cubic-bezier(.3, 1.4, .5, 1) both; animation-delay: calc(var(--i) * 70ms + 200ms); }
@keyframes rpDrop {
  0%   { opacity: 0; transform: translateY(-34px) scale(.86); }
  60%  { opacity: 1; }
  100% { opacity: 1; transform: none; }
}
.rp-coin--today > image:first-child { transform-origin: 50% 60%; animation: rpToday 2.4s ease-in-out infinite; }
@keyframes rpToday { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
.rp-today rect { fill: var(--ink); }
.rp-today text { fill: #fff; font: 800 13px 'Raleway', system-ui, sans-serif; letter-spacing: .1em; text-anchor: middle; }

/* Who hovers: up and down, the shadow shrinking as they rise. */
.rp-hover { animation: rpHover 3.2s ease-in-out infinite; }
.rp-hover--slow { animation-duration: 4.4s; }
.rp-hover .rp-shadow { transform-origin: 50% 91%; animation: rpShadow 3.2s ease-in-out infinite; }
@keyframes rpHover { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-9px); } }
@keyframes rpShadow { 0%, 100% { transform: translateY(0) scale(1); opacity: .9; } 50% { transform: translateY(9px) scale(.9); opacity: .7; } }
.rp-drift { animation: rpDrift 9s ease-in-out infinite; }
@keyframes rpDrift { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(26px); } }
.rp-gem { transform-origin: 50% 50%; animation: rpGem 3.6s ease-in-out infinite; }
.rp-gem--b { animation-delay: -1.6s; }
@keyframes rpGem { 0%, 100% { transform: translateY(0) rotate(-10deg); } 50% { transform: translateY(-7px) rotate(8deg); } }

/* A blink: the open-eyed picture gives way to the shut one for a moment. */
.rp-blink--shut { opacity: 0; animation: rpShut 5.2s infinite; }
.rp-blink--open { animation: rpOpen 5.2s infinite; }
@keyframes rpShut { 0%, 94%, 100% { opacity: 0; } 95%, 98% { opacity: 1; } }
@keyframes rpOpen { 0%, 94%, 100% { opacity: 1; } 95%, 98% { opacity: 0; } }

/* Boo's camp. The fire stands at 68% across, 73% down the frame; Boo's feet at 27%, 73%. */
.rp-camp__glow { animation: rpGlow 1.9s ease-in-out infinite; }
@keyframes rpGlow { 0%, 100% { opacity: .82; } 50% { opacity: 1; } }
.rp-camp__boo { transform-origin: 27% 73%; }
.rp-camp__boo.rp-blink--open { animation: rpOpen 5.2s infinite, rpBreathe 3.6s ease-in-out infinite; }
.rp-camp__boo.rp-blink--shut { animation: rpShut 5.2s infinite, rpBreathe 3.6s ease-in-out infinite; }
@keyframes rpBreathe { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(1.014); } }
.rp-flame { transform-origin: 68% 73%; }
.rp-flame--a { animation: rpFlame 1.5s ease-in-out infinite; }
.rp-flame--b { animation: rpFlame 1.1s ease-in-out -.4s infinite; }
.rp-flame--c { animation: rpFlame .8s ease-in-out -.2s infinite; }
@keyframes rpFlame {
  0%, 100% { transform: skewX(-3deg) scale(1.02, .95); }
  50%      { transform: skewX(4deg) scale(.97, 1.08); }
}
.rp-camp__stick { animation: rpStick 2.8s ease-in-out infinite; }
@keyframes rpStick { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
.rp-camp__sparks { animation: rpSparks 1.9s linear infinite; }
@keyframes rpSparks { 0% { transform: translateY(0); opacity: 0; } 40% { opacity: 1; } 100% { transform: translateY(-14px); opacity: 0; } }

/* ---------- The three cards ---------- */
.rp-cards {
  max-width: 1100px;
  margin: 44px auto 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}
.rp-card {
  display: flex; flex-direction: column;
  padding: 22px 22px 26px;
  border-radius: 28px;
  background: #fff;
  border: 1px solid var(--line-soft);
  box-shadow: 0 40px 80px -46px rgba(81, 112, 255, .35), 0 12px 30px -20px rgba(20, 25, 58, .18);
}
.rp-card:nth-child(2) { transition-delay: .1s; }
.rp-card:nth-child(3) { transition-delay: .2s; }
.rp-label { margin-top: 20px; font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--ink-mute); }
.rp-card h3 { margin-top: 4px; font-family: 'EB Garamond', serif; font-size: 26px; font-weight: 600; line-height: 1.15; color: var(--ink); }
.rp-card p { margin-top: 8px; font-size: 15px; line-height: 1.55; color: var(--ink-soft); }

.rp-demo {
  position: relative;
  /* One height for all three, so the words under them line up. */
  height: 352px;
  padding: 18px;
  border-radius: 20px;
  background: var(--paper);
  border: 1px solid var(--line-soft);
  display: flex; flex-direction: column; align-items: stretch; justify-content: center; gap: 14px;
}
.rp-live { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }

.rp-check {
  width: 22px; height: 22px; flex: none;
  border-radius: 50%;
  display: grid; place-items: center;
  border: 2px solid var(--line);
  color: transparent;
  transition: background-color .25s, border-color .25s, color .25s;
}
.rp-check.is-on, li.is-done > .rp-check { background: #2BB573; border-color: #2BB573; color: #fff; }

/* Stars */
.rp-stars { position: relative; display: flex; justify-content: center; align-items: flex-end; gap: 2px; height: 74px; }
.rp-star { position: relative; width: 62px; }
.rp-star--m { width: 76px; margin-bottom: 10px; }
.rp-star img { display: block; width: 100%; height: auto; }
.rp-star__gold { position: absolute; inset: 0; transform: scale(0); transition: transform .42s cubic-bezier(.3, 1.7, .5, 1); }
.rp-star.is-on .rp-star__gold { transform: scale(1); }
.rp-stars.is-perfect { animation: rpPerfect .5s ease-out .15s; }
@keyframes rpPerfect { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.07); } }
.rp-goals { list-style: none; display: flex; flex-direction: column; gap: 7px; }
.rp-goals li {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 12px;
  border-radius: 14px;
  background: #fff;
  border: 1px solid var(--line-soft);
  font-size: 14px; font-weight: 600; color: var(--ink);
}
.rp-btn {
  align-self: center;
  padding: 10px 20px;
  border-radius: 14px;
  font-size: 14px; font-weight: 800;
  color: #fff;
  background: var(--accent);
  box-shadow: 0 4px 0 var(--accent-deep);
  transition: transform .1s, box-shadow .1s, opacity .2s;
}
.rp-btn:active:not(:disabled) { transform: translateY(3px); box-shadow: 0 1px 0 var(--accent-deep); }
.rp-btn:disabled { opacity: .7; cursor: default; }
.rp-btn:focus-visible, .rp-book:focus-visible { outline: 3px solid var(--accent); outline-offset: 3px; }

/* Quests */
.rp-friend { display: flex; align-items: center; gap: 10px; }
.rp-friend__art { width: 78px; height: auto; flex: none; overflow: visible; }
.rp-friend__art image, .rp-friend__art g { transform-box: fill-box; }
.rp-friend div { display: flex; flex-direction: column; font-size: 13px; color: var(--ink-mute); }
.rp-friend b { font-family: 'EB Garamond', serif; font-size: 22px; font-weight: 600; line-height: 1.1; color: var(--ink); }
.rp-quests { list-style: none; display: flex; flex-direction: column; gap: 7px; }
.rp-quests li {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 12px;
  border-radius: 14px;
  background: #fff;
  border: 1px solid var(--line-soft);
}
.rp-quests__text { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
.rp-quests__text b { font-size: 14px; color: var(--ink); }
.rp-quests__count { font-size: 12px; font-weight: 800; color: var(--ink-mute); }
.rp-bar { display: block; height: 7px; border-radius: 999px; background: var(--line); overflow: hidden; }
.rp-bar i { display: block; height: 100%; width: 0; border-radius: inherit; background: #8FD6A0; transition: width 1.2s cubic-bezier(.16, .84, .44, 1) .35s; }
.rp-card.is-revealed .rp-bar i { width: var(--to); }
.rp-prize {
  display: flex; align-items: center; gap: 8px;
  padding: 6px 12px 6px 8px;
  border-radius: 14px;
  background: #fff;
  border: 1.5px solid var(--line);
  font-size: 13.5px; font-weight: 700; color: var(--ink);
}
.rp-prize img { width: 38px; height: auto; flex: none; }

/* Reward book */
.rp-demo--reward { align-items: center; }
.rp-book {
  position: relative;
  width: 190px; height: 170px;
  padding: 0; background: none;
  border-radius: 24px;
}
.rp-book img { position: absolute; display: block; }
.rp-book__shut { left: 0; top: -14px; width: 190px; transform-origin: 50% 90%; }
.rp-book__open { left: 12px; top: -6px; width: 166px; opacity: 0; }
.rp-book.is-shut:hover .rp-book__shut { animation: rpNudge .5s ease-in-out; }
.rp-book.is-jumping .rp-book__shut { animation: rpJump 1.15s cubic-bezier(.3, 0, .4, 1) both; }
.rp-book.is-open .rp-book__shut { opacity: 0; }
.rp-book.is-open .rp-book__open { opacity: 1; animation: rpPop .4s cubic-bezier(.3, 1.6, .5, 1); }
@keyframes rpNudge { 0%, 100% { transform: rotate(0); } 30% { transform: rotate(-4deg); } 70% { transform: rotate(4deg); } }
@keyframes rpJump {
  0%   { transform: translate(0, 0) rotate(0); }
  14%  { transform: translate(-12px, -30px) rotate(-9deg); }
  30%  { transform: translate(0, 0) rotate(0) scale(1.04, .94); }
  46%  { transform: translate(12px, -34px) rotate(9deg); }
  62%  { transform: translate(0, 0) rotate(0) scale(1.05, .93); }
  78%  { transform: translate(-6px, -38px) rotate(-6deg); }
  100% { transform: translate(0, 0) rotate(0) scale(1.08, .9); }
}
@keyframes rpPop { 0% { transform: scale(.8); } 100% { transform: scale(1); } }
.rp-burst { position: absolute; left: 50%; top: 46%; width: 0; height: 0; }
.rp-burst img { left: -15px; top: -15px; width: 30px; opacity: 0; }
.rp-book.is-open .rp-burst img { animation: rpBurst .9s cubic-bezier(.2, .9, .3, 1) var(--wait) both; }
@keyframes rpBurst {
  0%   { opacity: 0; transform: translate(0, 0) scale(.3) rotate(0); }
  20%  { opacity: 1; }
  100% { opacity: 1; transform: translate(var(--x), var(--y)) scale(1) rotate(var(--turn)); }
}
.rp-won { display: flex; align-items: center; gap: 10px; opacity: 0; transform: translateY(6px); transition: opacity .3s .3s, transform .3s .3s; }
.rp-won.is-shown { opacity: 1; transform: none; }
.rp-tier { padding: 4px 12px; border-radius: 999px; font-size: 11.5px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: #fff; background: #4F6BF0; }
.rp-gems { display: inline-flex; align-items: center; gap: 6px; font-size: 24px; font-weight: 800; color: var(--ink); font-variant-numeric: tabular-nums; }
.rp-gems img { width: 26px; height: auto; }
.rp-gems small { font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--ink-mute); }
.rp-hint { position: absolute; left: 0; right: 0; bottom: 34px; text-align: center; font-size: 13.5px; font-weight: 700; color: var(--ink-mute); transition: opacity .2s; }
.rp-hint.is-hidden { opacity: 0; }

@media (max-width: 980px) {
  .rp-cards { grid-template-columns: 1fr; max-width: 460px; }
}
@media (max-width: 720px) {
  .rp { padding: 100px 18px; }
  /* The phone sees the middle of the scene: Boo, today's coin and the days either side. */
  .rp-stage { margin: 0 -18px; }
  .rp-scene { aspect-ratio: 390 / 300; }
  /* Half out of the phone's view: left out there. */
  .rp-far { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .rp-scene *, .rp-friend__art * { animation: none !important; }
  .rp-stage:not(.is-revealed) .rp-coin { opacity: 1; }
  .rp-blink--shut { opacity: 0; }
  .rp-star__gold, .rp-bar i, .rp-won { transition: none; }
  .rp-book img, .rp-stars { animation: none !important; }
  .rp-book.is-open .rp-burst img { opacity: 1; transform: translate(var(--x), var(--y)) rotate(var(--turn)); }
}
</style>
