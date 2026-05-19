<template>
  <section class="features" id="how">
    <header class="section-head" data-reveal>
      <span class="section-head__eyebrow">Open the door</span>
      <h2 class="section-head__title">A reading room that quietly does the keeping.</h2>
    </header>
    <div class="features__grid">
      <article class="feature" data-reveal>
        <div class="feature__ill"><SaveIll /></div>
        <span class="feature__tag">Save</span>
        <h3 class="feature__title">Slip a bookmark, anywhere.</h3>
        <p class="feature__body">
          One tap on your phone — from the couch, the train, or under the covers at 11 PM.
          Bookmarko remembers the book, the page, and the mood.
        </p>
      </article>
      <article class="feature" data-reveal style="transition-delay:90ms">
        <div class="feature__ill"><ShelveIll /></div>
        <span class="feature__tag">Shelve</span>
        <h3 class="feature__title">Your library, the way you arrange it.</h3>
        <p class="feature__body">
          Group by mood, project, or "books I lied about reading." Drag, rename,
          dust off — it bends to your shape.
        </p>
      </article>
      <article class="feature" data-reveal style="transition-delay:180ms">
        <div class="feature__ill"><StreakIll /></div>
        <span class="feature__tag">Streak</span>
        <h3 class="feature__title">Show up. Your streak quietly grows.</h3>
        <p class="feature__body">
          A small daily habit, kept lightly. Most evenings you read — Bookmarko
          keeps the gentle thread. Miss one and nothing breaks; pick it up the next.
        </p>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { h } from 'vue'
import { useReveal } from '@/composables/useReveal'

useReveal()

const SaveIll = () =>
  h('svg', { viewBox: '0 0 220 140', class: 'ill' }, [
    h('rect', { x: 20, y: 18, width: 180, height: 104, rx: 6, fill: '#EFE6D4' }),
    h('rect', { x: 20, y: 18, width: 180, height: 22, fill: '#1F2E54' }),
    h('circle', { cx: 32, cy: 29, r: 3, fill: '#FAF5EB' }),
    h('circle', { cx: 42, cy: 29, r: 3, fill: '#FAF5EB', opacity: '.7' }),
    h('circle', { cx: 52, cy: 29, r: 3, fill: '#FAF5EB', opacity: '.5' }),
    h('rect', { x: 34, y: 56, width: 120, height: 6, rx: 2, fill: '#1F2E54', opacity: '.7' }),
    h('rect', { x: 34, y: 70, width: 150, height: 4, rx: 2, fill: '#1F2E54', opacity: '.25' }),
    h('rect', { x: 34, y: 80, width: 138, height: 4, rx: 2, fill: '#1F2E54', opacity: '.25' }),
    h('rect', { x: 34, y: 90, width: 80, height: 4, rx: 2, fill: '#1F2E54', opacity: '.25' }),
    h('g', { class: 'ill__bookmark' }, [
      h('path', { d: 'M160 14 L160 84 L172 74 L184 84 L184 14 Z', fill: '#5170ff' }),
      h('path', { d: 'M160 14 L184 14 L184 22 L160 22 Z', fill: 'rgba(0,0,0,.18)' }),
    ]),
  ])

function rng(seed: number) {
  return () => {
    let t = (seed = (seed + 0x6d2b79f5) | 0)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function shelfRow(yBase: number, seed: number) {
  const r = rng(seed)
  const palette = ['#6B2737', '#C4933D', '#2F5D44', '#1F2E54', '#A04A2C', '#E8DCC4', '#4E342E', '#7E9982']
  const items: ReturnType<typeof h>[] = []
  let x = 14
  let i = 0
  while (x < 200) {
    const bw = 8 + Math.floor(r() * 12)
    const bh = 28 + Math.floor(r() * 14)
    const color = palette[Math.floor(r() * palette.length)]
    items.push(h('rect', { key: i++, x, y: yBase + (46 - bh), width: bw, height: bh, rx: 1, fill: color }))
    x += bw + 1
  }
  items.push(h('rect', { key: 'shelf', x: 10, y: yBase + 46, width: 200, height: 3, fill: '#1F2E54', opacity: '.25' }))
  return items
}

const ShelveIll = () =>
  h('svg', { viewBox: '0 0 220 140', class: 'ill' }, [...shelfRow(8, 5), ...shelfRow(56, 11)])

const STREAK_DAYS = [true, true, true, true, true, false, false]
const STREAK_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const TODAY = 4

const StreakIll = () =>
  h('svg', { viewBox: '0 0 220 140', class: 'ill' }, [
    h('defs', {}, [
      h('radialGradient', { id: 'streakGlow', cx: '50%', cy: '50%', r: '50%' }, [
        h('stop', { offset: '0%', 'stop-color': '#FFB347', 'stop-opacity': '0.55' }),
        h('stop', { offset: '60%', 'stop-color': '#FFD580', 'stop-opacity': '0.2' }),
        h('stop', { offset: '100%', 'stop-color': '#FFD580', 'stop-opacity': '0' }),
      ]),
    ]),
    h('ellipse', { cx: 110, cy: 42, rx: 46, ry: 36, fill: 'url(#streakGlow)' }),
    h('rect', { x: 93, y: 22, width: 34, height: 44, rx: 2, fill: '#1F2E54' }),
    h('rect', { x: 93, y: 22, width: 5, height: 44, fill: '#0E1230' }),
    h('rect', { x: 104, y: 33, width: 18, height: 2, fill: '#5170ff' }),
    h('rect', { x: 104, y: 40, width: 14, height: 1.5, fill: 'rgba(255,255,255,.3)' }),
    h('rect', { x: 104, y: 46, width: 16, height: 1.5, fill: 'rgba(255,255,255,.3)' }),
    h('rect', { x: 104, y: 52, width: 12, height: 1.5, fill: 'rgba(255,255,255,.3)' }),
    h('rect', { x: 66, y: 30, width: 5, height: 5, transform: 'rotate(45 68.5 32.5)', fill: '#FFB347', opacity: '0.75' }),
    h('rect', { x: 152, y: 54, width: 4, height: 4, transform: 'rotate(45 154 56)', fill: '#FFB347', opacity: '0.6' }),
    h('rect', { x: 158, y: 20, width: 3, height: 3, transform: 'rotate(45 159.5 21.5)', fill: '#FFB347', opacity: '0.7' }),
    h('rect', { x: 60, y: 58, width: 3, height: 3, transform: 'rotate(45 61.5 59.5)', fill: '#FFB347', opacity: '0.5' }),
    ...STREAK_DAYS.flatMap((checked, d) => {
      const cx = 28 + d * 27
      const isToday = d === TODAY
      const parts: ReturnType<typeof h>[] = [
        h('circle', {
          key: `c${d}`,
          cx,
          cy: 102,
          r: 10,
          fill: checked ? '#5170ff' : '#EEF2FF',
          stroke: isToday ? '#1F2E54' : 'none',
          'stroke-width': isToday ? 1.4 : 0,
        }),
      ]
      if (checked) {
        parts.push(
          h('path', {
            key: `k${d}`,
            d: `M${cx - 4} 102 l3 3 l6 -6`,
            stroke: '#fff',
            'stroke-width': 1.8,
            fill: 'none',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
          }),
        )
      }
      return parts
    }),
    ...STREAK_LABELS.map((lbl, d) =>
      h(
        'text',
        {
          key: `l${d}`,
          x: 28 + d * 27,
          y: 126,
          'font-size': 9,
          fill: 'rgba(20,25,58,.45)',
          'text-anchor': 'middle',
          'font-family': 'Raleway, sans-serif',
          'font-weight': 600,
          'letter-spacing': '.06em',
        },
        lbl,
      ),
    ),
  ])
</script>

<style scoped>
.features {
  background: transparent;
  padding: 110px 36px 130px;
}
.features__grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}
.feature {
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 24px;
  padding: 28px 28px 32px;
  box-shadow: var(--shadow-soft);
  transition: transform .3s, box-shadow .3s;
}
.feature:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-warm);
}
.feature__ill {
  background: var(--paper-deep);
  border-radius: 16px;
  padding: 14px;
  margin-bottom: 20px;
  overflow: hidden;
}
.feature__ill :deep(.ill) { width: 100%; height: auto; display: block; }
.feature__ill :deep(.ill__bookmark) {
  transform-origin: 172px 14px;
  animation: bookmarkSwing 4s ease-in-out infinite;
}
@keyframes bookmarkSwing {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(2deg); }
}
.feature__tag {
  display: inline-block;
  font-size: 11px; font-weight: 700;
  letter-spacing: .14em; text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 12px;
}
.feature__title {
  font-family: 'EB Garamond', serif;
  font-weight: 500;
  font-size: 26px;
  line-height: 1.15;
  letter-spacing: -.01em;
  margin-bottom: 12px;
  color: var(--ink);
}
.feature__body {
  font-size: 15px;
  line-height: 1.6;
  color: var(--ink-soft);
}

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

@media (max-width: 880px) {
  .features__grid { grid-template-columns: 1fr; }
}
</style>
