<template>
  <div class="nd" ref="rootEl">
    <!-- Atmosphere overlays -->
    <div class="nd-grain" aria-hidden="true" />
    <div class="nd-vignette" aria-hidden="true" />

    <!-- Custom cursor -->
    <div class="nd-cursor" ref="cursorDot" aria-hidden="true" />
    <div class="nd-cursor-halo" ref="cursorHalo" aria-hidden="true" />

    <!-- ═══════════ ACT I — THE OPENING (pinned, scroll-driven) ═══════════ -->
    <section class="act-open" ref="openEl">
      <div class="act-open__sticky">
        <!-- drifting dust motes -->
        <div class="motes" aria-hidden="true">
          <span
            v-for="(m, i) in motes"
            :key="'m' + i"
            class="mote"
            :style="{
              '--x': m.x + '%',
              '--y': m.y + '%',
              '--s': m.s + 'px',
              '--t': m.t + 's',
              '--dl': m.dl + 's',
            }"
          />
        </div>

        <!-- title fades away as the book opens -->
        <header class="act-open__head">
          <img class="act-open__logo" :src="logoMark" alt="Bookmarko" />
          <p class="act-open__kicker">Bookmarko presents</p>
          <h1 class="act-open__title">
            Every story<br /><em>is a door.</em>
          </h1>
        </header>

        <p class="act-open__hint">
          <span class="act-open__hint-line" />
          scroll — and open it
        </p>

        <!-- the book -->
        <div class="stage" ref="stageEl">
          <div class="book">
            <div class="book__shadow" aria-hidden="true" />
            <div class="book__glow" aria-hidden="true" />
            <div class="book__shaft" aria-hidden="true" />
            <div class="book__slit" aria-hidden="true" />

            <!-- back board: stays put, shows endpaper when open -->
            <div class="board board--back">
              <div class="board__endpaper" />
            </div>

            <!-- fanning leaves -->
            <div
              v-for="(leaf, i) in leaves"
              :key="'leaf' + i"
              class="leaf"
              :style="{ '--d': leaf.d, '--z': leaf.z + 'px' }"
            >
              <div class="leaf__lines" />
            </div>

            <!-- front cover: cloth outside, endpaper inside -->
            <div class="board board--front">
              <div class="board__face board__face--out">
                <div class="emblem">
                  <div class="emblem__frame" />
                  <span class="emblem__exlibris">the gentle art of</span>
                  <span class="emblem__mark">Beginning<br />Again.</span>
                  <span class="emblem__rule" />
                  <span class="emblem__motto">by the reader within</span>
                </div>
              </div>
              <div class="board__face board__face--in" />
            </div>
          </div>

          <!-- glyphs escaping the pages -->
          <div class="glyphs" aria-hidden="true">
            <span
              v-for="(g, i) in glyphs"
              :key="'g' + i"
              class="glyph"
              :style="{
                '--gx': g.x + 'px',
                '--gr': g.r + 'deg',
                '--gt': g.t + 's',
                '--gdl': g.dl + 's',
                '--gs': g.s + 'rem',
              }"
              >{{ g.ch }}</span
            >
          </div>
        </div>

        <!-- whispered captions timed to the opening -->
        <p class="cap cap--1">Paper. Ink. A little courage.</p>
        <p class="cap cap--2">It only ever asks one thing —</p>
        <p class="cap cap--3">that you begin.</p>
      </div>
    </section>

    <!-- ═══════════ ACT II — INSIDE THE PAGES ═══════════ -->
    <section class="act-verse" id="verse">
      <div class="verse__margin" aria-hidden="true" />
      <p class="verse__folio" aria-hidden="true">1</p>

      <div class="verse__inner">
        <p class="verse__kicker" data-in>page one</p>
        <h2 class="verse__poem">
          <span class="verse__line" data-in>Between two covers,</span>
          <span class="verse__line verse__line--em" data-in
            >an entire <em>universe</em></span
          >
          <span class="verse__line" data-in>holds its breath.</span>
        </h2>

        <p class="verse__prose" data-in>
          Not loading. Not buffering. Waiting — the old way. For a reader to
          arrive, to press a thumb into the margin, to whisper
          <em>just one more chapter</em> and mean five.
        </p>
      </div>

      <!-- marginalia scattered like a well-loved copy -->
      <span class="nota nota--1" data-in>— underlined twice</span>
      <span class="nota nota--2" data-in>read again in autumn</span>
      <span class="nota nota--3" data-in>3:12 a.m. — couldn't stop</span>

      <!-- rotating library stamp -->
      <div class="stamp" data-in aria-hidden="true">
        <svg viewBox="0 0 200 200">
          <defs>
            <path
              id="nd-stamp-arc"
              d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0"
            />
          </defs>
          <text>
            <textPath href="#nd-stamp-arc">
              read · remember · return · read · remember · return ·
            </textPath>
          </text>
          <circle cx="100" cy="100" r="52" class="stamp__ring" />
          <text x="100" y="112" class="stamp__mark">B</text>
        </svg>
      </div>
    </section>

    <!-- ═══════════ ACT III — TABLE OF CONTENTS (the features) ═══════════ -->
    <section class="act-toc" id="features">
      <p class="toc__folio" aria-hidden="true">2</p>
      <div class="toc__inner">
        <p class="toc__kicker" data-in>table of contents</p>
        <h2 class="toc__title" data-in>
          What you'll find <em>inside.</em>
        </h2>

        <ol class="toc__list">
          <li
            v-for="(ch, i) in chapters"
            :key="'ch' + i"
            class="toc__row"
            data-in
            :style="{ transitionDelay: i * 0.09 + 's' }"
          >
            <span class="toc__num">{{ ch.num }}</span>
            <div class="toc__body">
              <h3 class="toc__chapter">{{ ch.title }}</h3>
              <p class="toc__desc">{{ ch.desc }}</p>
            </div>
            <span class="toc__leader" aria-hidden="true" />
            <span class="toc__page">{{ ch.page }}</span>
          </li>
        </ol>
      </div>
    </section>

    <!-- ═══════════ ACT IV — YOUR SHELF, UNBOUND ═══════════ -->
    <section class="act-orbit" id="orbit">
      <div class="orbit__head">
        <p class="orbit__kicker" data-in>your shelf, unbound</p>
        <h2 class="orbit__title" data-in>
          Every book you've loved<br />keeps <em>orbiting</em> you.
        </h2>
        <p class="orbit__sub" data-in>
          Bookmarko keeps the constellation — what you've read, what you're
          reading, and what's still waiting for its night.
        </p>
      </div>

      <div class="orbit__stage" ref="orbitEl" data-in>
        <div class="orbit__ring">
          <div
            v-for="(cover, i) in covers"
            :key="'c' + i"
            class="orbit__card"
            :style="{ '--a': (360 / covers.length) * i + 'deg' }"
          >
            <img :src="cover" alt="" loading="lazy" draggable="false" />
          </div>
        </div>
        <p class="orbit__center">
          <span class="orbit__count">{{ covers.length }}</span>
          <span class="orbit__label">stories in motion</span>
        </p>
      </div>
    </section>

    <!-- ═══════════ FINALE — TURN TO PAGE ONE ═══════════ -->
    <section class="act-final" id="final">
      <img class="final__logo" :src="logoMark" alt="Bookmarko" data-in />
      <p class="final__kicker" data-in>the next chapter is yours</p>
      <h2 class="final__title" data-in>
        Turn to<br /><em>page one.</em>
      </h2>

      <div class="final__stores" data-in>
        <a
          href="https://apps.apple.com/us/app/bookmarko/id6762641879"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Download Bookmarko on the App Store"
        >
          <img :src="appStoreBadge" alt="Download on the App Store" />
        </a>
        <a
          href="https://play.google.com/store/apps/details?id=com.idanmal.bookmarko"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Get Bookmarko on Google Play"
        >
          <img :src="googleStoreBadge" alt="Get it on Google Play" />
        </a>
      </div>

      <a class="final__back" href="/" data-in>← back to the quiet shelf</a>
      <p class="final__colophon" data-in>
        Bookmarko · set in EB Garamond &amp; Raleway · bound by hand
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import appStoreBadge from '@/assets/appStore.png'
import googleStoreBadge from '@/assets/googleStore.png'
import logoMark from '@/assets/bookmarkoLogo-mark.png'

/* ── real covers for the orbit ─────────────────────────────────────────── */
const coverModules = import.meta.glob('../assets/Books/*.jpg', {
  eager: true,
  import: 'default',
}) as Record<string, string>
const covers = Object.values(coverModules).slice(0, 12)

/* ── the features, told as chapters ────────────────────────────────────── */
const chapters = [
  {
    num: 'I',
    title: 'One quiet shelf',
    desc: 'Every book you’ve ever loved — reading, read, and next — kept in one warm, well-lit place.',
    page: '04',
  },
  {
    num: 'II',
    title: 'Pages that count',
    desc: 'EXP for every page you turn, streaks that keep the fire lit, and a leaderboard of fellow readers.',
    page: '11',
  },
  {
    num: 'III',
    title: 'A librarian in the lamp',
    desc: 'Ask Ginie in your own words. It recommends your next read and teases the chapter after that.',
    page: '23',
  },
  {
    num: 'IV',
    title: 'Your past, poured in',
    desc: 'Export your Goodreads CSV, drop it in, and watch years of reading shelve themselves in minutes.',
    page: '37',
  },
]

/* ── generated scenery ─────────────────────────────────────────────────── */
const rand = (min: number, max: number) => min + Math.random() * (max - min)

const motes = Array.from({ length: 22 }, () => ({
  x: rand(2, 98),
  y: rand(4, 96),
  s: rand(1.5, 3.5),
  t: rand(9, 22),
  dl: rand(-20, 0),
}))

const GLYPH_CHARS = ['a', 'S', '?', '&', 'e', '¶', 'k', '!', 'm', '§', 'R', '…', 'é', 'w', '„', 'q']
const glyphs = GLYPH_CHARS.map((ch) => ({
  ch,
  x: rand(-210, 210),
  r: rand(-70, 70),
  t: rand(4.5, 9),
  dl: rand(-9, 0),
  s: rand(1.2, 2.8),
}))

/* five leaves fanning open with a stagger (--d = when each starts) */
const leaves = [
  { d: 0.1, z: 5 },
  { d: 0.2, z: 4 },
  { d: 0.3, z: 3 },
  { d: 0.42, z: 2 },
  { d: 0.55, z: 1 },
]

/* ── refs ──────────────────────────────────────────────────────────────── */
const rootEl = ref<HTMLElement | null>(null)
const openEl = ref<HTMLElement | null>(null)
const stageEl = ref<HTMLElement | null>(null)
const orbitEl = ref<HTMLElement | null>(null)
const cursorDot = ref<HTMLElement | null>(null)
const cursorHalo = ref<HTMLElement | null>(null)

/* ── scroll-driven opening ─────────────────────────────────────────────── */
/* dev aid: /newDesign?p=0.6 freezes the opening at a given progress */
const forcedP = (() => {
  const v = new URLSearchParams(window.location.search).get('p')
  const n = v === null ? NaN : parseFloat(v)
  return Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : null
})()

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
/* triangular window: 1 at center c, 0 beyond half-width w */
const win = (p: number, c: number, w: number) =>
  clamp01(1 - Math.abs(p - c) / w)

let ticking = false
function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    ticking = false
    const el = openEl.value
    if (!el) return
    const rect = el.getBoundingClientRect()
    const vh = window.innerHeight
    const p = forcedP ?? clamp01(-rect.top / (rect.height - vh))
    const glow = easeInOut(clamp01(p / 0.85))
    const dive = easeInOut(clamp01((p - 0.82) / 0.18))
    el.style.setProperty('--p', p.toFixed(4))
    el.style.setProperty('--glow', glow.toFixed(4))
    el.classList.toggle('is-lit', glow > 0.02)
    el.style.setProperty('--dive', dive.toFixed(4))
    el.style.setProperty('--head', (1 - clamp01(p / 0.16)).toFixed(4))
    el.style.setProperty('--cap1', win(p, 0.3, 0.13).toFixed(4))
    el.style.setProperty('--cap2', win(p, 0.52, 0.13).toFixed(4))
    el.style.setProperty('--cap3', win(p, 0.74, 0.12).toFixed(4))
  })
}

/* ── mouse parallax on the book + the orbit ring ───────────────────────── */
function onMove(e: MouseEvent) {
  const nx = (e.clientX / window.innerWidth) * 2 - 1
  const ny = (e.clientY / window.innerHeight) * 2 - 1
  stageEl.value?.style.setProperty('--mx', nx.toFixed(3))
  stageEl.value?.style.setProperty('--my', ny.toFixed(3))
  orbitEl.value?.style.setProperty('--mx', nx.toFixed(3))
  orbitEl.value?.style.setProperty('--my', ny.toFixed(3))
}

/* ── custom cursor (lerped halo) ───────────────────────────────────────── */
let cx = -100
let cy = -100
let hx = -100
let hy = -100
let cursorRaf = 0
function onCursorMove(e: MouseEvent) {
  cx = e.clientX
  cy = e.clientY
  if (cursorDot.value)
    cursorDot.value.style.transform = `translate(${cx}px, ${cy}px)`
}
function cursorLoop() {
  hx += (cx - hx) * 0.14
  hy += (cy - hy) * 0.14
  if (cursorHalo.value)
    cursorHalo.value.style.transform = `translate(${hx}px, ${hy}px)`
  cursorRaf = requestAnimationFrame(cursorLoop)
}
function onOver(e: MouseEvent) {
  const interactive = (e.target as HTMLElement).closest('a, button')
  cursorHalo.value?.classList.toggle('is-hot', !!interactive)
}

/* ── reveal-on-scroll for the later acts ───────────────────────────────── */
let io: IntersectionObserver | null = null

const prevTitle = document.title

onMounted(() => {
  document.title = 'Bookmarko — Every story is a door'

  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  if (fine) {
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mousemove', onCursorMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    rootEl.value?.classList.add('has-cursor')
    cursorRaf = requestAnimationFrame(cursorLoop)
  }

  io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in')
          io?.unobserve(entry.target)
        }
      }
    },
    { threshold: 0.25 },
  )
  rootEl.value
    ?.querySelectorAll('[data-in]')
    .forEach((el) => io?.observe(el))

  /* dev aid: /newDesign?at=verse|features|orbit|final jumps straight to an act */
  const at = new URLSearchParams(window.location.search).get('at')
  if (at) {
    requestAnimationFrame(() =>
      requestAnimationFrame(() =>
        document.getElementById(at)?.scrollIntoView({ behavior: 'instant' }),
      ),
    )
  }
})

onBeforeUnmount(() => {
  document.title = prevTitle
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('mousemove', onCursorMove)
  window.removeEventListener('mouseover', onOver)
  cancelAnimationFrame(cursorRaf)
  io?.disconnect()
})
</script>

<style scoped>
/* ═══════════════════════ TOKENS — the site's design system ═══════════════
   Mirrors :root in style.css: --accent #5170ff, --ink #14193A,
   --ink-deep #0E1230, --paper #F7F9FC, --accent-soft #A5C2F4,
   --accent-tint #E2ECFB. Same fonts as the home route. */
.nd {
  --deep: #0e1230;
  --deep-soft: #14193a;
  --foil: #a5c2f4;
  --foil-hot: #e2ecfb;
  --blue: #5170ff;
  --blue-deep: #3d59e6;
  --paper: #f7f9fc;
  --paper-deep: #e2ecfb;
  --ink: #14193a;
  --moon: #f7f9fc;
  --moon-dim: rgba(247, 249, 252, 0.55);

  --serif: 'EB Garamond', Georgia, serif;
  --whisper: 'EB Garamond', Georgia, serif;
  --sans: 'Raleway', system-ui, sans-serif;

  background: var(--deep);
  color: var(--moon);
  font-family: var(--serif);
  overflow-x: clip;
}
.nd.has-cursor,
.nd.has-cursor :deep(a) {
  cursor: none;
}
.nd ::selection {
  background: var(--blue);
  color: #fff;
}

/* ═══════════════════════ ATMOSPHERE ═══════════════════════ */
/* static grain — an animated grain layer forces full-screen repaints */
.nd-grain {
  position: fixed;
  inset: 0;
  z-index: 60;
  pointer-events: none;
  opacity: 0.07;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
.nd-vignette {
  position: fixed;
  inset: 0;
  z-index: 59;
  pointer-events: none;
  background: radial-gradient(
    120% 100% at 50% 45%,
    transparent 55%,
    rgba(8, 11, 32, 0.5) 100%
  );
}

/* ═══════════════════════ CURSOR ═══════════════════════ */
.nd-cursor,
.nd-cursor-halo {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 90;
  pointer-events: none;
  display: none;
  will-change: transform;
}
.has-cursor .nd-cursor,
.has-cursor .nd-cursor-halo {
  display: block;
}
.nd-cursor::after {
  content: '';
  position: absolute;
  top: -3px;
  left: -3px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--foil-hot);
  box-shadow: 0 0 12px 2px rgba(81, 112, 255, 0.65);
}
.nd-cursor-halo::after {
  content: '';
  position: absolute;
  top: -19px;
  left: -19px;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1px solid rgba(165, 194, 244, 0.45);
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.35s ease, background 0.35s ease;
}
.nd-cursor-halo.is-hot::after {
  transform: scale(1.7);
  border-color: rgba(226, 236, 251, 0.9);
  background: rgba(81, 112, 255, 0.12);
}

/* ═══════════════════════ ACT I — THE OPENING ═══════════════════════ */
.act-open {
  --p: 0;
  --glow: 0;
  --dive: 0;
  --head: 1;
  --cap1: 0;
  --cap2: 0;
  --cap3: 0;
  height: 420vh;
  position: relative;
}
.act-open__sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: clip;
  display: grid;
  place-items: center;
  background:
    radial-gradient(90% 70% at 50% 110%, rgba(81, 112, 255, 0.18), transparent 60%),
    var(--deep);
}
/* glow wash as an opacity-faded overlay: compositor-only, never repaints */
.act-open__sticky::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: radial-gradient(70% 55% at 50% 42%, rgba(165, 194, 244, 0.16), transparent 70%);
  opacity: var(--glow);
  will-change: opacity;
}

/* motes */
.motes {
  position: absolute;
  inset: 0;
}
.mote {
  position: absolute;
  left: var(--x);
  top: var(--y);
  width: var(--s);
  height: var(--s);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(226, 236, 251, 0.6), transparent 70%);
  animation: nd-drift var(--t) ease-in-out var(--dl) infinite alternate;
}
@keyframes nd-drift {
  from { transform: translate(0, 0); opacity: 0.15; }
  50% { opacity: 0.6; }
  to { transform: translate(28px, -46px); opacity: 0.1; }
}

/* headline */
.act-open__head {
  position: absolute;
  top: clamp(2.5rem, 7vh, 5.5rem);
  left: 50%;
  transform: translate(-50%, calc(var(--p) * -40px));
  text-align: center;
  z-index: 5;
  opacity: var(--head);
  pointer-events: none;
  width: max-content;
  max-width: 92vw;
}
.act-open__logo {
  height: clamp(38px, 6vh, 52px);
  margin-bottom: 1rem;
  opacity: 0.92;
  animation: nd-rise 1.2s cubic-bezier(0.16, 0.84, 0.44, 1) both;
}
.act-open__kicker {
  font-family: var(--sans);
  font-weight: 600;
  font-size: clamp(0.7rem, 1.2vw, 0.8rem);
  letter-spacing: 0.34em;
  color: var(--foil);
  text-transform: uppercase;
  animation: nd-rise 1.2s 0.1s cubic-bezier(0.16, 0.84, 0.44, 1) both;
}
.act-open__title {
  margin-top: 0.9rem;
  font-weight: 500;
  font-size: clamp(2.6rem, 7.5vw, 5.8rem);
  line-height: 1.02;
  letter-spacing: -0.015em;
  color: var(--moon);
  animation: nd-rise 1.2s 0.2s cubic-bezier(0.16, 0.84, 0.44, 1) both;
}
.act-open__title em {
  font-style: italic;
  font-weight: 500;
  color: var(--foil);
}
.act-open__hint {
  position: absolute;
  bottom: clamp(1.6rem, 4.5vh, 3rem);
  left: 50%;
  transform: translateX(-50%);
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 0.7rem;
  font-family: var(--whisper);
  font-style: italic;
  font-size: 0.95rem;
  letter-spacing: 0.18em;
  color: var(--moon-dim);
  opacity: var(--head);
  z-index: 5;
  pointer-events: none;
  /* fill: backwards, so scroll-driven opacity wins once the entrance ends */
  animation: nd-rise 1.2s 0.35s cubic-bezier(0.16, 0.84, 0.44, 1) backwards;
}
.act-open__hint-line {
  width: 1px;
  height: 34px;
  background: linear-gradient(to bottom, transparent, var(--foil));
  animation: nd-hint 2.2s ease-in-out infinite;
}
@keyframes nd-hint {
  0%, 100% { transform: scaleY(0.4); transform-origin: top; opacity: 0.4; }
  50% { transform: scaleY(1); opacity: 1; }
}
@keyframes nd-rise {
  from { opacity: 0; transform: translateY(26px); }
  to { opacity: 1; transform: translateY(0); }
}

/* the stage & book */
.stage {
  --mx: 0;
  --my: 0;
  --bw: min(300px, 60vw, 34vh);
  --bh: calc(var(--bw) * 1.46);
  position: relative;
  perspective: 1700px;
  transform: scale(calc(1 + var(--dive) * 2.4))
    translateY(calc(7vh + var(--dive) * 10vh));
  opacity: calc(1 - var(--dive));
  will-change: transform, opacity;
  z-index: 2;
}
.book {
  position: relative;
  width: var(--bw);
  height: var(--bh);
  transform-style: preserve-3d;
  transform: rotateX(calc(8deg + var(--my) * -3deg))
    rotateY(calc(-14deg + var(--p) * 14deg + var(--mx) * 4deg))
    translateX(calc(var(--p) * var(--bw) / 2));
  animation: nd-float 7s ease-in-out infinite;
  will-change: transform;
}
@keyframes nd-float {
  0%, 100% { translate: 0 0; }
  50% { translate: 0 -14px; }
}

/* under-shadow + spilling light */
.book__shadow {
  position: absolute;
  bottom: -14%;
  left: -46%;
  width: 190%;
  height: 15%;
  border-radius: 50%;
  background: radial-gradient(50% 50% at 50% 50%, rgba(4, 6, 20, 0.7), transparent 70%);
  transform: rotateX(88deg) translateZ(calc(var(--bh) * -0.48));
  filter: blur(6px);
}
.book__glow {
  position: absolute;
  top: 50%;
  left: 0;
  width: calc(var(--bw) * 2.6);
  height: calc(var(--bh) * 1.9);
  transform: translate(-50%, -50%);
  border-radius: 50%;
  pointer-events: none;
  background: radial-gradient(
    50% 50% at 50% 50%,
    rgba(226, 236, 251, 0.5),
    rgba(165, 194, 244, 0.22) 40%,
    transparent 72%
  );
  opacity: var(--glow);
  scale: calc(0.4 + var(--glow) * 0.8);
  will-change: opacity, scale;
}
.book__shaft {
  position: absolute;
  bottom: 46%;
  left: 0;
  width: calc(var(--bw) * 1.1);
  height: calc(var(--bh) * 1.75);
  transform: translateX(-50%);
  pointer-events: none;
  background: conic-gradient(
    from 178deg at 50% 100%,
    transparent 0deg,
    rgba(226, 236, 251, 0.5) 5deg,
    rgba(226, 236, 251, 0.12) 12deg,
    transparent 22deg
  );
  filter: blur(8px);
  opacity: calc(var(--glow) * 0.9);
  will-change: opacity;
}
/* light bursting straight out of the gutter */
.book__slit {
  position: absolute;
  top: -6%;
  bottom: -6%;
  left: 0;
  width: 16px;
  transform: translateX(-50%) translateZ(26px);
  background: linear-gradient(
    to bottom,
    transparent,
    var(--foil-hot) 22%,
    #ffffff 50%,
    var(--foil-hot) 78%,
    transparent
  );
  filter: blur(7px);
  opacity: var(--glow);
  will-change: opacity;
  pointer-events: none;
}

/* boards & leaves — hinge on the left edge */
.board,
.leaf {
  position: absolute;
  inset: 0;
  transform-origin: left center;
  border-radius: 4px 10px 10px 4px;
  will-change: transform;
}
.board--back {
  transform: translateZ(0px);
  background: linear-gradient(115deg, #17204a, #10163a 60%);
  box-shadow:
    inset 0 0 0 1px rgba(165, 194, 244, 0.14),
    -6px 0 0 -2px #121838,
    -11px 0 0 -4px #0e1230;
}
.board__endpaper {
  position: absolute;
  inset: 4px;
  border-radius: 3px 8px 8px 3px;
  background:
    linear-gradient(90deg, rgba(20, 25, 58, 0.2), transparent 16%),
    radial-gradient(120% 90% at 0% 50%, rgba(165, 194, 244, 0.5), transparent 60%),
    repeating-linear-gradient(to bottom, transparent 0 10px, rgba(20, 25, 58, 0.08) 10px 11px),
    linear-gradient(100deg, #fbfcfe 60%, #e6edfa);
  opacity: calc(var(--glow) * 0.9 + 0.1);
  will-change: opacity;
}

.leaf {
  background:
    linear-gradient(100deg, rgba(20, 25, 58, 0.16), transparent 14%),
    linear-gradient(280deg, rgba(20, 25, 58, 0.08), transparent 22%),
    linear-gradient(100deg, #fbfcfe 60%, #e6edfa);
  transform: rotateY(
      calc(clamp(0, (var(--p) - var(--d)) / 0.42, 1) * (-138deg - var(--d) * -40deg))
    )
    translateZ(var(--z));
  box-shadow: inset -1px 0 0 rgba(20, 25, 58, 0.08);
}
/* cool light seeping across the page from the gutter */
.leaf::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(100deg, rgba(81, 112, 255, 0.22), rgba(165, 194, 244, 0.08) 45%, transparent 70%);
  opacity: var(--glow);
  will-change: opacity;
}
.leaf__lines {
  position: absolute;
  inset: 11% 9% 12% 13%;
  background: repeating-linear-gradient(
    to bottom,
    rgba(20, 25, 58, 0.22) 0 1px,
    transparent 1px 10px
  );
  opacity: 0.6;
  mask-image: linear-gradient(105deg, #000 55%, rgba(0, 0, 0, 0.25));
  -webkit-mask-image: linear-gradient(105deg, #000 55%, rgba(0, 0, 0, 0.25));
}

.board--front {
  transform: rotateY(calc(clamp(0, var(--p) / 0.5, 1) * -168deg)) translateZ(6px);
  transform-style: preserve-3d;
}
.board__face {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
.board__face--out {
  background:
    radial-gradient(140% 110% at 15% 8%, rgba(81, 112, 255, 0.35), transparent 55%),
    linear-gradient(128deg, #1c2653 0%, #14193a 55%, #0e1230 100%);
  box-shadow:
    inset 0 0 0 1px rgba(165, 194, 244, 0.18),
    inset 0 1px 0 rgba(247, 249, 252, 0.1),
    0 18px 50px -18px rgba(4, 6, 20, 0.8);
  display: grid;
  place-items: center;
}
.board__face--in {
  transform: rotateY(180deg);
  background:
    radial-gradient(120% 90% at 100% 50%, rgba(165, 194, 244, 0.5), transparent 55%),
    linear-gradient(100deg, #fbfcfe 60%, #e6edfa);
}

/* the foil emblem */
.emblem {
  position: relative;
  width: 78%;
  height: 84%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  color: var(--foil);
  text-align: center;
}
.emblem__frame {
  position: absolute;
  inset: 0;
  border: 1px solid rgba(165, 194, 244, 0.55);
  border-radius: 3px;
  box-shadow: inset 0 0 0 3px var(--deep-soft),
    inset 0 0 0 4px rgba(165, 194, 244, 0.3);
}
.emblem__exlibris {
  font-family: var(--whisper);
  font-style: italic;
  font-size: clamp(0.62rem, 1.4vw, 0.8rem);
  letter-spacing: 0.42em;
  text-transform: uppercase;
  opacity: 0.85;
}
.emblem__mark {
  font-size: clamp(1.7rem, 5vw, 2.5rem);
  font-weight: 500;
  font-style: italic;
  line-height: 1.15;
  background: linear-gradient(160deg, var(--foil-hot), var(--foil) 55%, var(--blue));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 28px rgba(81, 112, 255, 0.25);
}
.emblem__rule {
  width: 38%;
  height: 1px;
  background: linear-gradient(to right, transparent, var(--foil), transparent);
}
.emblem__motto {
  font-family: var(--whisper);
  font-style: italic;
  font-size: clamp(0.7rem, 1.6vw, 0.85rem);
  letter-spacing: 0.14em;
  color: rgba(165, 194, 244, 0.75);
}

/* escaping glyphs */
.glyphs {
  position: absolute;
  bottom: 55%;
  left: 50%;
  width: 0;
  height: 0;
  opacity: var(--glow);
  pointer-events: none;
}
.glyph {
  position: absolute;
  bottom: 0;
  left: var(--gx);
  font-family: var(--whisper);
  font-style: italic;
  font-size: var(--gs);
  color: var(--foil-hot);
  text-shadow: 0 0 10px rgba(226, 236, 251, 0.9), 0 0 26px rgba(81, 112, 255, 0.55);
  animation: nd-ascend var(--gt) linear var(--gdl) infinite;
  animation-play-state: paused; /* only animate once the book is glowing */
  will-change: transform, opacity;
}
.act-open.is-lit .glyph {
  animation-play-state: running;
}
@keyframes nd-ascend {
  0% { transform: translateY(6vh) rotate(0deg) scale(0.7); opacity: 0; }
  12% { opacity: 0.9; }
  70% { opacity: 0.5; }
  100% { transform: translateY(-56vh) rotate(var(--gr)) scale(1.1); opacity: 0; }
}

/* timed captions */
.cap {
  position: absolute;
  left: 50%;
  bottom: clamp(2.2rem, 6vh, 4rem);
  transform: translateX(-50%);
  font-family: var(--whisper);
  font-style: italic;
  font-size: clamp(1.15rem, 2.6vw, 1.7rem);
  letter-spacing: 0.06em;
  color: var(--foil-hot);
  white-space: nowrap;
  pointer-events: none;
  z-index: 4;
}
.cap--1 { opacity: var(--cap1); }
.cap--2 { opacity: var(--cap2); }
.cap--3 { opacity: var(--cap3); }

/* ═══════════════════════ ACT II — INSIDE THE PAGES ═══════════════════════ */
.act-verse {
  position: relative;
  background:
    radial-gradient(140% 60% at 50% 0%, rgba(165, 194, 244, 0.35), transparent 55%),
    repeating-linear-gradient(to bottom, transparent 0 42px, rgba(20, 25, 58, 0.05) 42px 43px),
    var(--paper);
  color: var(--ink);
  padding: clamp(7rem, 16vh, 12rem) clamp(1.5rem, 8vw, 9rem);
  overflow: clip;
}
.verse__margin {
  position: absolute;
  top: 0;
  bottom: 0;
  left: clamp(2.5rem, 7vw, 7rem);
  width: 1px;
  background: rgba(81, 112, 255, 0.35);
}
.verse__folio {
  position: absolute;
  top: clamp(1.4rem, 4vh, 2.8rem);
  right: clamp(1.6rem, 5vw, 4rem);
  font-family: var(--whisper);
  font-style: italic;
  font-size: 1rem;
  color: rgba(20, 25, 58, 0.45);
}
.verse__inner {
  max-width: 60rem;
  margin-inline: auto;
}
.verse__kicker {
  font-family: var(--sans);
  font-weight: 600;
  letter-spacing: 0.34em;
  text-transform: uppercase;
  font-size: clamp(0.7rem, 1.2vw, 0.8rem);
  color: var(--blue);
}
.verse__poem {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.2em;
  font-weight: 500;
  font-size: clamp(2.4rem, 6.4vw, 5.4rem);
  line-height: 1.04;
  letter-spacing: -0.02em;
}
.verse__line--em { margin-left: clamp(1rem, 8vw, 7rem); }
.verse__line:nth-child(3) { margin-left: clamp(0.5rem, 4vw, 3.5rem); }
.verse__poem em {
  font-style: italic;
  font-weight: 500;
  background: linear-gradient(120deg, var(--blue-deep), var(--blue));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.verse__prose {
  margin-top: clamp(2.5rem, 6vh, 4.5rem);
  max-width: 34rem;
  margin-left: clamp(1rem, 12vw, 12rem);
  font-family: var(--whisper);
  font-size: clamp(1.1rem, 2vw, 1.3rem);
  line-height: 1.75;
  color: rgba(20, 25, 58, 0.78);
}
.verse__prose em { font-style: italic; color: var(--blue-deep); }

/* marginalia */
.nota {
  position: absolute;
  font-family: var(--whisper);
  font-style: italic;
  font-size: clamp(0.85rem, 1.6vw, 1.05rem);
  color: rgba(61, 89, 230, 0.75);
  white-space: nowrap;
}
.nota--1 { top: 24%; right: 6%; transform: rotate(4deg); }
.nota--2 { top: 55%; left: 3%; transform: rotate(-7deg); writing-mode: vertical-rl; }
.nota--3 { bottom: 12%; right: 12%; transform: rotate(-3deg); }

/* rotating library stamp */
.stamp {
  position: absolute;
  bottom: clamp(2rem, 6vh, 4rem);
  left: clamp(4rem, 10vw, 10rem);
  width: clamp(110px, 14vw, 170px);
  opacity: 0.8;
}
.stamp svg { width: 100%; height: auto; animation: nd-spin 26s linear infinite; }
.stamp textPath {
  font-family: var(--whisper);
  font-style: italic;
  font-size: 15.5px;
  letter-spacing: 0.32em;
  fill: rgba(20, 25, 58, 0.6);
  text-transform: uppercase;
}
.stamp__ring { fill: none; stroke: rgba(20, 25, 58, 0.4); stroke-width: 1; }
.stamp__mark {
  font-family: var(--serif);
  font-style: italic;
  font-size: 44px;
  text-anchor: middle;
  fill: rgba(20, 25, 58, 0.65);
}
@keyframes nd-spin { to { transform: rotate(360deg); } }

/* ═══════════════════ ACT III — TABLE OF CONTENTS ═══════════════════ */
.act-toc {
  position: relative;
  background:
    linear-gradient(to bottom, var(--paper), var(--paper-deep) 30%, var(--paper-deep) 70%, var(--paper));
  color: var(--ink);
  padding: clamp(6rem, 14vh, 10rem) clamp(1.5rem, 8vw, 9rem);
}
.toc__folio {
  position: absolute;
  top: clamp(1.4rem, 4vh, 2.8rem);
  left: clamp(1.6rem, 5vw, 4rem);
  font-family: var(--whisper);
  font-style: italic;
  font-size: 1rem;
  color: rgba(20, 25, 58, 0.45);
}
.toc__inner {
  max-width: 52rem;
  margin-inline: auto;
}
.toc__kicker {
  font-family: var(--sans);
  font-weight: 600;
  letter-spacing: 0.34em;
  text-transform: uppercase;
  font-size: clamp(0.7rem, 1.2vw, 0.8rem);
  color: var(--blue);
  text-align: center;
}
.toc__title {
  margin-top: 1.2rem;
  text-align: center;
  font-weight: 500;
  font-size: clamp(2rem, 4.8vw, 3.4rem);
  letter-spacing: -0.015em;
}
.toc__title em { font-style: italic; color: var(--blue); }
.toc__list {
  list-style: none;
  margin-top: clamp(3rem, 7vh, 4.5rem);
  display: flex;
  flex-direction: column;
}
.toc__row {
  display: flex;
  align-items: baseline;
  gap: clamp(1rem, 3vw, 1.8rem);
  padding: clamp(1.3rem, 3vh, 1.8rem) 0.4rem;
  border-top: 1px solid rgba(20, 25, 58, 0.12);
  transition: background 0.35s ease, transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 1s cubic-bezier(0.16, 0.84, 0.44, 1);
}
.toc__row:last-child { border-bottom: 1px solid rgba(20, 25, 58, 0.12); }
.toc__row:hover {
  background: linear-gradient(to right, transparent, rgba(81, 112, 255, 0.07), transparent);
  transform: translateX(6px);
}
.toc__num {
  flex: none;
  width: 2.2rem;
  font-family: var(--whisper);
  font-style: italic;
  font-size: clamp(1.2rem, 2.4vw, 1.6rem);
  color: var(--blue);
}
.toc__body { max-width: 30rem; }
.toc__chapter {
  font-weight: 600;
  font-size: clamp(1.25rem, 2.6vw, 1.7rem);
  letter-spacing: -0.01em;
}
.toc__desc {
  margin-top: 0.35rem;
  font-family: var(--whisper);
  font-size: clamp(0.95rem, 1.7vw, 1.1rem);
  line-height: 1.6;
  color: rgba(20, 25, 58, 0.68);
}
.toc__leader {
  flex: 1;
  border-bottom: 2px dotted rgba(20, 25, 58, 0.3);
  transform: translateY(-0.3em);
}
.toc__page {
  flex: none;
  font-family: var(--whisper);
  font-style: italic;
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: rgba(20, 25, 58, 0.5);
  transition: color 0.35s ease;
}
.toc__row:hover .toc__page { color: var(--blue); }

/* ═══════════════════════ ACT IV — ORBIT ═══════════════════════ */
.act-orbit {
  position: relative;
  padding: clamp(7rem, 16vh, 12rem) 1.5rem clamp(5rem, 12vh, 9rem);
  background:
    radial-gradient(80% 50% at 50% 0%, rgba(81, 112, 255, 0.16), transparent 60%),
    var(--deep);
  overflow: clip;
}
.orbit__head { text-align: center; max-width: 46rem; margin-inline: auto; }
.orbit__kicker {
  font-family: var(--sans);
  font-weight: 600;
  letter-spacing: 0.34em;
  text-transform: uppercase;
  font-size: clamp(0.7rem, 1.2vw, 0.8rem);
  color: var(--foil);
}
.orbit__title {
  margin-top: 1.4rem;
  font-weight: 500;
  font-size: clamp(2.1rem, 5.4vw, 4.2rem);
  line-height: 1.06;
  letter-spacing: -0.015em;
}
.orbit__title em { font-style: italic; color: var(--foil); }
.orbit__sub {
  margin-top: 1.6rem;
  font-family: var(--whisper);
  font-size: clamp(1.05rem, 1.9vw, 1.25rem);
  line-height: 1.7;
  color: var(--moon-dim);
}

.orbit__stage {
  --mx: 0;
  --my: 0;
  --r: clamp(230px, 34vw, 430px);
  position: relative;
  height: clamp(380px, 60vh, 560px);
  margin-top: clamp(3rem, 8vh, 5.5rem);
  perspective: 1600px;
  display: grid;
  place-items: center;
}
.orbit__ring {
  position: absolute;
  width: 0;
  height: 0;
  transform-style: preserve-3d;
  transform: translateY(-36px) rotateX(calc(-14deg + var(--my) * -5deg))
    rotateY(calc(var(--mx) * 8deg));
}
.orbit__ring::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: calc(var(--r) * 2.3);
  height: calc(var(--r) * 2.3);
  transform: translate(-50%, -50%) rotateX(90deg);
  border-radius: 50%;
  border: 1px dashed rgba(165, 194, 244, 0.25);
}
.orbit__card {
  position: absolute;
  top: calc(clamp(80px, 11vw, 126px) * -0.75);
  left: calc(clamp(80px, 11vw, 126px) * -0.5);
  width: clamp(80px, 11vw, 126px);
  aspect-ratio: 2 / 3;
  transform: rotateY(var(--a)) translateZ(var(--r));
  animation: nd-orbit 70s linear infinite;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 24px 50px -18px rgba(4, 6, 20, 0.8),
    inset 0 0 0 1px rgba(247, 249, 252, 0.12);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
@keyframes nd-orbit {
  from { transform: rotateY(var(--a)) translateZ(var(--r)) rotateY(calc(var(--a) * -1)); }
  to { transform: rotateY(calc(var(--a) + 360deg)) translateZ(var(--r)) rotateY(calc((var(--a) + 360deg) * -1)); }
}
.orbit__card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  filter: saturate(0.92) brightness(0.94);
}
.orbit__card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(200deg, rgba(247, 249, 252, 0.14), transparent 45%),
    linear-gradient(to top, rgba(14, 18, 48, 0.35), transparent 45%);
}
.orbit__center {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  pointer-events: none;
}
.orbit__count {
  font-size: clamp(3.2rem, 8vw, 5.6rem);
  font-weight: 500;
  font-style: italic;
  line-height: 1;
  color: var(--foil);
  text-shadow: 0 0 44px rgba(81, 112, 255, 0.45);
}
.orbit__label {
  font-family: var(--whisper);
  font-style: italic;
  letter-spacing: 0.28em;
  font-size: clamp(0.8rem, 1.5vw, 0.95rem);
  color: var(--moon-dim);
  text-transform: lowercase;
}

/* ═══════════════════════ FINALE ═══════════════════════ */
.act-final {
  position: relative;
  text-align: center;
  padding: clamp(7rem, 18vh, 13rem) 1.5rem clamp(4rem, 10vh, 7rem);
  background:
    radial-gradient(60% 45% at 50% 62%, rgba(81, 112, 255, 0.15), transparent 70%),
    linear-gradient(to bottom, var(--deep), #090c22);
}
.final__logo {
  height: clamp(44px, 7vh, 60px);
  margin-bottom: 1.6rem;
  opacity: 0.92;
}
.final__kicker {
  font-family: var(--sans);
  font-weight: 600;
  letter-spacing: 0.34em;
  text-transform: uppercase;
  font-size: clamp(0.7rem, 1.2vw, 0.8rem);
  color: var(--foil);
}
.final__title {
  margin-top: 1.6rem;
  font-weight: 500;
  font-size: clamp(3rem, 10vw, 8rem);
  line-height: 0.98;
  letter-spacing: -0.02em;
}
.final__title em {
  font-style: italic;
  font-weight: 500;
  background: linear-gradient(150deg, var(--foil-hot), var(--foil) 60%, var(--blue));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.final__stores {
  margin-top: clamp(2.5rem, 6vh, 4rem);
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}
.final__stores img {
  height: 52px;
  display: block;
  border-radius: 10px;
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s ease;
}
.final__stores a:hover img {
  transform: translateY(-4px);
  box-shadow: 0 18px 34px -14px rgba(81, 112, 255, 0.5);
}
.final__back {
  display: inline-block;
  margin-top: clamp(3rem, 7vh, 5rem);
  font-family: var(--whisper);
  font-style: italic;
  font-size: 1.05rem;
  letter-spacing: 0.08em;
  color: var(--moon-dim);
  text-decoration: none;
  border-bottom: 1px solid rgba(247, 249, 252, 0.25);
  padding-bottom: 2px;
  transition: color 0.3s ease, border-color 0.3s ease;
}
.final__back:hover { color: var(--foil-hot); border-color: var(--foil); }
.final__colophon {
  margin-top: 3.5rem;
  font-family: var(--whisper);
  font-style: italic;
  font-size: 0.85rem;
  letter-spacing: 0.12em;
  color: rgba(247, 249, 252, 0.3);
}

/* ═══════════════════════ RENDER BUDGET ═══════════════════════ */
/* don't lay out / paint the later acts while the opening is on screen */
.act-verse,
.act-toc,
.act-orbit,
.act-final {
  content-visibility: auto;
  contain-intrinsic-size: auto 100vh;
}

/* ═══════════════════════ REVEALS & MOTION PREFS ═══════════════════════ */
[data-in] {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 1s cubic-bezier(0.16, 0.84, 0.44, 1),
    transform 1s cubic-bezier(0.16, 0.84, 0.44, 1);
}
[data-in].in { opacity: 1; transform: translateY(0); }
.nota[data-in].in.nota--1 { transform: rotate(4deg); }
.nota[data-in].in.nota--2 { transform: rotate(-7deg); }
.nota[data-in].in.nota--3 { transform: rotate(-3deg); }
.verse__line[data-in]:nth-child(2) { transition-delay: 0.15s; }
.verse__line[data-in]:nth-child(3) { transition-delay: 0.3s; }

@media (prefers-reduced-motion: reduce) {
  .mote,
  .glyph,
  .book,
  .act-open__hint-line,
  .stamp svg,
  .orbit__card {
    animation: none !important;
  }
  [data-in] {
    opacity: 1;
    transform: none;
    transition: none;
  }
}

/* ═══════════════════════ SMALL SCREENS ═══════════════════════ */
@media (max-width: 640px) {
  .act-open { height: 340vh; }
  .nota--2 { display: none; }
  .stamp { left: auto; right: 1.2rem; bottom: 1.2rem; }
  .verse__prose { margin-left: 0; }
  .cap { white-space: normal; text-align: center; width: 88vw; }
  .toc__row { flex-wrap: wrap; }
  .toc__leader { display: none; }
  .toc__page { display: none; }
}
</style>
