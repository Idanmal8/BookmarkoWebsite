<template>
  <!-- Idan's personal newsletter, not Bookmarko's (tasks/IDAN_NEWSLETTER.md). -->
  <div ref="root" class="nl-page" :class="{ prep: animated && !ready }">
    <!-- ── Hero ── -->
    <section class="hero">
      <div class="hero-copy">
        <p class="badge" data-intro><span class="dot" aria-hidden="true" />A letter from Idan, straight to your inbox</p>
        <h1 class="title" aria-label="The newsletter by Idan Malka">
          <span class="line" aria-hidden="true">
            <span class="w">The</span> <span class="w">newsletter</span> <span class="w by">by</span>
          </span>
          <span class="line" aria-hidden="true">
            <span class="w name">
              Idan Malka
              <svg class="squiggle" viewBox="0 0 300 20" preserveAspectRatio="none">
                <path ref="squiggle" d="M4 14 C 40 4, 70 4, 100 12 S 160 20, 200 10 S 260 2, 296 10" />
              </svg>
            </span>
          </span>
        </h1>
        <p class="lede" data-intro>
          My journey from zero audience to many, told in the open. Plus tech guides and industry best
          practices you can hand straight to your AI companion.
        </p>
        <div data-intro>
          <NewsletterForm source="website-hero" fine-print="Free forever. No fluff. Unsubscribe anytime." />
        </div>
      </div>

      <div class="hero-art">
        <div ref="photoStack" class="photo-stack">
          <span class="photo-back" aria-hidden="true" />
          <img class="photo" src="/newsletter/idan.jpg" width="900" height="900" alt="Idan Malka smiling" />
          <span class="sticker s1">📱 6 years in mobile</span>
          <span class="sticker s2">📚 Book lover</span>
          <span class="sticker s3">🚀 Builder at heart</span>
        </div>
        <p v-if="animated" class="hint" aria-hidden="true">psst… the stickers move <span class="hint-arrow">↑</span></p>
      </div>
    </section>

    <!-- ── Topic ticker ── -->
    <div class="ticker" aria-hidden="true">
      <div ref="tickerTrack" class="ticker-track">
        <template v-for="n in 2" :key="n">
          <span v-for="topic in topics" :key="`${n}-${topic}`" class="ticker-item">{{ topic }}<span class="star">✦</span></span>
        </template>
      </div>
    </div>

    <!-- ── What you'll get ── -->
    <section class="get">
      <p class="kicker">What you'll get</p>
      <h2 class="section-title" data-split>Three things, every issue</h2>
      <div class="cards">
        <article v-for="(item, i) in benefits" :key="item.title" class="card" :class="`c${i + 1}`">
          <span class="card-icon" aria-hidden="true">{{ item.icon }}</span>
          <span class="card-num">0{{ i + 1 }}</span>
          <h3 class="card-title">{{ item.title }}</h3>
          <p class="card-body">{{ item.body }}</p>
        </article>
      </div>
    </section>

    <!-- ── About ── -->
    <section class="about">
      <div class="letter">
        <div class="toon" aria-hidden="true">
          <img class="toon-img" src="/newsletter/idan-illustrated.jpg" width="600" height="900" alt="" loading="lazy" />
          <span class="toon-tag">that's me ✏️</span>
        </div>
        <div>
          <h2 class="section-title left" data-split>Hi, I'm Idan</h2>
          <p class="about-body">
            I'm a mobile engineer with six years in the tech industry and entrepreneurship in my blood.
            I'm also a book lover and a loving husband.
          </p>
          <p class="about-body">
            This newsletter is where I share everything I learn while building an audience from zero,
            so you can skip the mistakes I already made.
          </p>
          <p class="signature">Idan <span class="wave" aria-hidden="true">👋</span></p>
        </div>
      </div>
    </section>

    <!-- ── Final CTA ── -->
    <section id="join" class="cta">
      <span class="cta-blob b1" aria-hidden="true" />
      <span class="cta-blob b2" aria-hidden="true" />
      <span class="cta-blob b3" aria-hidden="true" />
      <h2 class="cta-title" data-split>See you in your inbox…</h2>
      <p class="cta-sub">Join now and get the next letter the moment it's out.</p>
      <div class="cta-form">
        <NewsletterForm source="website-footer" tone="dark" fine-print="Unsubscribe anytime." />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { Draggable } from 'gsap/Draggable'
import { InertiaPlugin } from 'gsap/InertiaPlugin'
import NewsletterForm from './NewsletterForm.vue'

gsap.registerPlugin(ScrollTrigger, SplitText, Draggable, InertiaPlugin)

const topics = [
  'Audience growth',
  'Building in public',
  'AI workflows',
  'Mobile engineering',
  'Open source',
  'Tech best practices',
  'Indie projects',
]

const benefits = [
  {
    icon: '📈',
    title: 'From zero to an audience',
    body: "My journey from zero audience to many, and the conclusions I draw along the way: what worked, what didn't, and why.",
  },
  {
    icon: '🤖',
    title: 'Tech, made usable',
    body: 'Technical terms, guides and best practices from the tech industry, ready to hand straight to your AI companion.',
  },
  {
    icon: '🎁',
    title: 'First access',
    body: 'Be the first to try my new projects and open source tools, built to help you grow.',
  },
]

const root = ref<HTMLElement>()
const squiggle = ref<SVGPathElement>()
const photoStack = ref<HTMLElement>()
const tickerTrack = ref<HTMLElement>()

// Reduced motion gets the finished, static page: nothing is hidden or animated.
const animated = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
// Hides the hero until the intro has set its start states, so nothing flashes.
const ready = ref(false)

let ctx: gsap.Context | undefined
let draggables: Draggable[] = []
let removeTilt: (() => void) | undefined

onMounted(async () => {
  if (!animated || !root.value) return
  // Splitting before Recoleta loads would measure the fallback font.
  await document.fonts.ready
  if (!root.value) return

  ctx = gsap.context(() => {
    intro()
    stickers()
    tilt()
    ticker()
    reveals()
  }, root.value)
  ready.value = true
})

onBeforeUnmount(() => {
  draggables.forEach((d) => d.kill())
  removeTilt?.()
  ctx?.revert()
})

function intro() {
  const length = squiggle.value!.getTotalLength()
  gsap.set(squiggle.value!, { strokeDasharray: length, strokeDashoffset: length })

  gsap
    .timeline({ defaults: { ease: 'power4.out' } })
    .from('.title .w', { yPercent: 70, rotate: 6, autoAlpha: 0, duration: 1, stagger: 0.09 })
    .to(squiggle.value!, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' }, '-=0.45')
    .from('[data-intro]', { y: 28, autoAlpha: 0, duration: 0.8, stagger: 0.1 }, '<-0.5')
    .from('.photo-stack', { scale: 0.6, rotate: -14, autoAlpha: 0, duration: 1.1, ease: 'elastic.out(1, 0.6)' }, 0.2)
    .from('.photo-back', { rotate: 0, x: 0, y: 0, duration: 0.9, ease: 'back.out(2)' }, '<0.35')
    .from('.sticker', { scale: 0, autoAlpha: 0, duration: 0.7, stagger: 0.12, ease: 'back.out(3)' }, '<0.25')
    .from('.hint', { autoAlpha: 0, y: 10, duration: 0.6 }, '+=0.4')
}

// Grab a sticker, fling it, and it settles back home with a bounce.
function stickers() {
  draggables = Draggable.create('.sticker', {
    type: 'x,y',
    inertia: true,
    bounds: '.hero',
    edgeResistance: 0.7,
    zIndexBoost: true,
    onPress() {
      gsap.to(this.target, { scale: 1.12, duration: 0.2 })
    },
    onRelease() {
      gsap.to(this.target, { scale: 1, duration: 0.3 })
    },
    onThrowComplete() {
      gsap.to(this.target, { x: 0, y: 0, duration: 1.2, delay: 1.5, ease: 'elastic.out(1, 0.5)' })
    },
  })
}

// The photo leans a little toward the pointer. Fine pointers only.
function tilt() {
  if (!window.matchMedia('(pointer: fine)').matches || !photoStack.value) return
  gsap.set(photoStack.value, { transformPerspective: 900 })
  const rotateX = gsap.quickTo(photoStack.value, 'rotationX', { duration: 0.6, ease: 'power3' })
  const rotateY = gsap.quickTo(photoStack.value, 'rotationY', { duration: 0.6, ease: 'power3' })
  const onMove = (e: PointerEvent) => {
    rotateY((e.clientX / window.innerWidth - 0.5) * 16)
    rotateX((e.clientY / window.innerHeight - 0.5) * -12)
  }
  window.addEventListener('pointermove', onMove)
  removeTilt = () => window.removeEventListener('pointermove', onMove)
}

// An endless strip that speeds up while the page is scrolling.
function ticker() {
  const loop = gsap.to(tickerTrack.value!, { xPercent: -50, duration: 34, ease: 'none', repeat: -1 })
  ScrollTrigger.create({
    onUpdate(self) {
      const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 250, 6)
      gsap.to(loop, { timeScale: boost, duration: 0.2, overwrite: true })
      gsap.to(loop, { timeScale: 1, duration: 1.2, delay: 0.2, ease: 'power2.out' })
    },
  })
}

function reveals() {
  gsap.utils.toArray<HTMLElement>('[data-split]').forEach((el) => {
    SplitText.create(el, {
      type: 'words',
      mask: 'words',
      onSplit: (self) =>
        gsap.from(self.words, {
          yPercent: 110,
          duration: 0.9,
          stagger: 0.07,
          ease: 'power4.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        }),
    })
  })

  gsap.from('.kicker', { autoAlpha: 0, y: 12, duration: 0.6, scrollTrigger: { trigger: '.get', start: 'top 80%' } })

  gsap.from('.card', {
    y: 120,
    rotate: (i) => [-8, 4, 9][i] ?? 0,
    autoAlpha: 0,
    duration: 1,
    stagger: 0.14,
    ease: 'back.out(1.5)',
    scrollTrigger: { trigger: '.cards', start: 'top 82%' },
  })
  gsap.from('.card-icon', {
    scale: 0,
    rotate: -45,
    duration: 0.6,
    stagger: 0.14,
    delay: 0.45,
    ease: 'back.out(3)',
    scrollTrigger: { trigger: '.cards', start: 'top 82%' },
  })

  gsap
    .timeline({ scrollTrigger: { trigger: '.letter', start: 'top 78%' } })
    .from('.letter', { x: -80, rotate: -3, autoAlpha: 0, duration: 1, ease: 'power4.out' })
    .from('.toon', { scale: 0.5, rotate: 16, autoAlpha: 0, duration: 0.9, ease: 'elastic.out(1, 0.6)' }, '-=0.6')
    .from('.about-body, .signature', { y: 18, autoAlpha: 0, duration: 0.6, stagger: 0.1 }, '-=0.7')

  gsap.from('.cta', {
    scale: 0.9,
    y: 60,
    autoAlpha: 0,
    duration: 1,
    ease: 'power4.out',
    scrollTrigger: { trigger: '.cta', start: 'top 85%' },
  })
  // The blobs drift and spin as the block scrolls through.
  const blobs: [string, gsap.TweenVars][] = [
    ['.b1', { x: 60, y: 40, rotate: 90 }],
    ['.b2', { x: -50, y: -40, rotate: -60 }],
    ['.b3', { x: -30, y: 60, rotate: 120 }],
  ]
  blobs.forEach(([target, vars]) =>
    gsap.to(target, { ...vars, ease: 'none', scrollTrigger: { trigger: '.cta', start: 'top bottom', end: 'bottom top', scrub: true } }),
  )
}
</script>

<style scoped>
/* Recoleta is a local demo file only (gitignored): it needs a Latinotype web
   licence before shipping. Until then production falls back to EB Garamond. */
@font-face {
  font-family: 'Recoleta';
  src: url('/fonts/recoleta-regular-demo.otf') format('opentype');
  font-weight: 400;
  font-display: swap;
}

.nl-page {
  --nl-ink: #14193a;
  --nl-blue: #5170ff;
  --nl-accent: #ff6b3d;
  --nl-cream: #fbf6ec;
  --nl-yellow: #ffd66b;
  --nl-mint: #bdebd4;
  --nl-pink: #ffc9d6;
  --nl-mute: #6b7298;
  --nl-display: 'Recoleta', 'EB Garamond', Georgia, serif;

  background: var(--nl-cream);
  color: var(--nl-ink);
  overflow: hidden;
  padding-bottom: 5rem;
  /* The demo font swaps its ligature glyphs (fl, fi…) for a watermark. */
  font-variant-ligatures: none;
}
.prep .hero {
  visibility: hidden;
}

/* ── Hero ── */
.hero {
  position: relative;
  max-width: 1160px;
  margin: 0 auto;
  padding: 8rem 1.5rem 4rem;
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 4rem;
  align-items: center;
}
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  background: #fff;
  border: 1.5px solid var(--nl-ink);
  border-radius: 999px;
  padding: 0.4rem 0.95rem;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 1.6rem;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #2ecc71;
  box-shadow: 0 0 0 4px rgba(46, 204, 113, 0.2);
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse {
  50% { box-shadow: 0 0 0 7px rgba(46, 204, 113, 0.08); }
}
.title {
  font-family: var(--nl-display);
  font-weight: 400;
  font-size: clamp(2.9rem, 6.4vw, 5.2rem);
  line-height: 1.04;
  letter-spacing: -0.02em;
  margin-bottom: 1.4rem;
}
.line {
  display: block;
}
.w {
  display: inline-block;
}
.by {
  font-style: italic;
  color: var(--nl-mute);
  font-size: 0.7em;
}
.name {
  position: relative;
  color: var(--nl-accent);
  white-space: nowrap;
}
.squiggle {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -0.12em;
  width: 100%;
  height: 0.28em;
  fill: none;
  stroke: var(--nl-yellow);
  stroke-width: 5;
  stroke-linecap: round;
}
.lede {
  font-size: 1.15rem;
  line-height: 1.65;
  color: var(--ink-soft);
  max-width: 540px;
  margin-bottom: 2rem;
}

.hero-art {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.photo-stack {
  position: relative;
  width: min(100%, 400px);
  transform-style: preserve-3d;
}
.photo-back {
  position: absolute;
  inset: 0;
  border-radius: 36px;
  background: var(--nl-yellow);
  border: 2px solid var(--nl-ink);
  transform: rotate(6deg) translate(10px, 8px);
}
.photo {
  position: relative;
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 36px;
  border: 2px solid var(--nl-ink);
  transform: rotate(-2deg);
}
.sticker {
  position: absolute;
  z-index: 2;
  background: #fff;
  border: 2px solid var(--nl-ink);
  border-radius: 999px;
  padding: 0.5rem 0.95rem;
  font-size: 0.9rem;
  font-weight: 700;
  white-space: nowrap;
  box-shadow: 3px 3px 0 var(--nl-ink);
  cursor: grab;
  user-select: none;
  touch-action: none;
}
.sticker:active {
  cursor: grabbing;
}
.s1 { top: 8%; left: -14%; rotate: -6deg; }
.s2 { top: 46%; right: -12%; background: var(--nl-pink); rotate: 5deg; }
.s3 { bottom: 4%; left: -6%; background: var(--nl-mint); rotate: -3deg; }
.hint {
  margin-top: 2.2rem;
  font-family: var(--nl-display);
  font-style: italic;
  font-size: 1.05rem;
  color: var(--nl-mute);
  rotate: -2deg;
}
.hint-arrow {
  display: inline-block;
  animation: nudge 1.4s ease-in-out infinite;
}
@keyframes nudge {
  50% { translate: 0 -4px; }
}

/* ── Ticker ── */
.ticker {
  background: var(--nl-ink);
  color: #fff;
  transform: rotate(-1.2deg);
  margin: 1rem -2rem 0;
  padding: 0.95rem 0;
  overflow: hidden;
}
.ticker-track {
  display: flex;
  width: max-content;
}
.ticker-item {
  font-family: var(--nl-display);
  font-size: 1.5rem;
  padding-right: 1.5rem;
  white-space: nowrap;
}
.star {
  color: var(--nl-yellow);
  padding-left: 1.5rem;
}

/* ── Cards ── */
.get {
  max-width: 1160px;
  margin: 0 auto;
  padding: 6.5rem 1.5rem 2rem;
  text-align: center;
}
.kicker {
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--nl-accent);
  margin-bottom: 0.7rem;
}
.section-title {
  font-family: var(--nl-display);
  font-weight: 400;
  font-size: clamp(2.2rem, 4vw, 3.2rem);
  line-height: 1.15;
  margin-bottom: 3rem;
}
.section-title.left {
  margin-bottom: 1.2rem;
}
.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.75rem;
  text-align: left;
}
.card {
  position: relative;
  border: 2px solid var(--nl-ink);
  border-radius: 28px;
  padding: 2rem 1.8rem 2.1rem;
  box-shadow: 6px 6px 0 var(--nl-ink);
  transition: box-shadow 0.25s ease, translate 0.25s ease;
}
.card:hover {
  translate: -3px -3px;
  box-shadow: 9px 9px 0 var(--nl-ink);
}
.card:hover .card-icon {
  animation: wiggle 0.5s ease;
}
@keyframes wiggle {
  25% { rotate: -12deg; }
  75% { rotate: 10deg; }
}
.c1 { background: var(--nl-pink); }
.c2 { background: var(--nl-yellow); }
.c3 { background: var(--nl-mint); }
.card-icon {
  display: inline-grid;
  place-items: center;
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: #fff;
  border: 2px solid var(--nl-ink);
  font-size: 1.6rem;
  margin-bottom: 1.4rem;
}
.card-num {
  position: absolute;
  top: 1.5rem;
  right: 1.6rem;
  font-family: var(--nl-display);
  font-size: 2.6rem;
  line-height: 1;
  opacity: 0.25;
}
.card-title {
  font-family: var(--nl-display);
  font-weight: 400;
  font-size: 1.55rem;
  line-height: 1.15;
  margin-bottom: 0.7rem;
}
.card-body {
  color: #2c3256;
  line-height: 1.6;
}

/* ── About ── */
.about {
  max-width: 920px;
  margin: 0 auto;
  padding: 5rem 1.5rem;
}
.letter {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 3rem;
  align-items: center;
  background: #fff;
  border: 2px solid var(--nl-ink);
  border-radius: 32px;
  padding: 2.75rem;
  box-shadow: 6px 6px 0 var(--nl-ink);
}
.toon {
  position: relative;
  rotate: -4deg;
}
.toon-img {
  display: block;
  width: 220px;
  height: 275px;
  object-fit: cover;
  object-position: top;
  border: 2px solid var(--nl-ink);
  border-radius: 24px;
  box-shadow: 5px 5px 0 var(--nl-ink);
}
.toon-tag {
  position: absolute;
  left: 50%;
  bottom: -14px;
  translate: -50% 0;
  rotate: 5deg;
  background: var(--nl-yellow);
  border: 2px solid var(--nl-ink);
  border-radius: 999px;
  padding: 0.25rem 0.8rem;
  font-family: var(--nl-display);
  font-style: italic;
  font-size: 0.95rem;
  white-space: nowrap;
}
.about-body {
  color: var(--ink-soft);
  font-size: 1.08rem;
  line-height: 1.75;
}
.about-body + .about-body {
  margin-top: 0.9rem;
}
.signature {
  font-family: var(--nl-display);
  font-size: 2.2rem;
  color: var(--nl-accent);
  margin-top: 1rem;
  rotate: -3deg;
  display: inline-block;
}
.wave {
  display: inline-block;
  font-size: 0.8em;
  transform-origin: 70% 70%;
  animation: wave 2.4s ease-in-out infinite;
}
@keyframes wave {
  0%, 60%, 100% { transform: rotate(0); }
  10%, 30% { transform: rotate(14deg); }
  20%, 40% { transform: rotate(-8deg); }
}

/* ── Final CTA ── */
.cta {
  position: relative;
  max-width: 1080px;
  margin-inline: auto;
  padding: 4.5rem 2rem;
  background: var(--nl-ink);
  border: 2px solid var(--nl-ink);
  border-radius: 40px;
  box-shadow: 8px 8px 0 var(--nl-accent);
  text-align: center;
  color: #fff;
  overflow: hidden;
  scroll-margin-top: 120px;
}
.cta-blob {
  position: absolute;
  pointer-events: none;
}
.b1 { width: 220px; height: 220px; border-radius: 50%; background: var(--nl-yellow); top: -100px; left: -70px; }
.b2 { width: 160px; height: 160px; border-radius: 50%; background: var(--nl-accent); bottom: -80px; right: -40px; }
.b3 { width: 70px; height: 70px; border-radius: 18px; background: var(--nl-mint); top: 30px; right: 12%; rotate: 20deg; }
.cta-title {
  position: relative;
  font-family: var(--nl-display);
  font-weight: 400;
  font-size: clamp(2.3rem, 4.6vw, 3.6rem);
  line-height: 1.12;
  margin-bottom: 0.8rem;
}
.cta-sub {
  position: relative;
  font-size: 1.1rem;
  opacity: 0.85;
  margin-bottom: 2.2rem;
}
.cta-form {
  position: relative;
  max-width: 620px;
  margin: 0 auto;
}

@media (max-width: 1100px) {
  .cta { margin-inline: 1.5rem; }
}
@media (max-width: 900px) {
  .hero { grid-template-columns: 1fr; gap: 3.5rem; padding-top: 6.5rem; }
  .hero-art { order: -1; }
  .photo-stack { width: min(72%, 320px); }
  .cards { grid-template-columns: 1fr; }
  .letter { grid-template-columns: 1fr; padding: 2rem; gap: 2rem; }
  .toon-img { width: 160px; height: 200px; }
}
@media (max-width: 600px) {
  .s1 { left: -10%; }
  .s2 { right: -10%; }
  .sticker { font-size: 0.8rem; padding: 0.4rem 0.75rem; }
  .cta { padding: 3.5rem 1.25rem; border-radius: 28px; }
}
@media (prefers-reduced-motion: reduce) {
  .wave, .dot, .hint-arrow { animation: none; }
}
</style>
