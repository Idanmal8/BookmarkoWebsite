<template>
  <svg
    class="bk-shelf"
    :viewBox="`0 0 ${width} ${height}`"
    width="100%"
    height="100%"
    preserveAspectRatio="xMidYMid slice"
    style="display:block"
  >
    <g v-for="(row, ri) in rows" :key="ri">
      <g
        v-for="(b, bi) in row.books"
        :key="b.id"
        class="bk-book"
        :style="bookStyle(b, bi, row.seed)"
      >
        <rect :x="b.x" :y="b.y" :width="b.w" :height="b.h" rx="1" :fill="b.color" />
        <rect :x="b.x + 0.5" :y="b.y + 1" width="1" :height="b.h - 2" fill="rgba(255,255,255,.15)" />
        <rect :x="b.x + b.w - 1.5" :y="b.y + 1" width="1" :height="b.h - 2" fill="rgba(0,0,0,.15)" />
        <template v-if="b.bands">
          <rect :x="b.x" :y="b.y + 8" :width="b.w" height="1.5" :fill="b.bandColor" />
          <rect :x="b.x" :y="b.y + b.h - 10" :width="b.w" height="1.5" :fill="b.bandColor" />
        </template>
        <rect
          v-if="b.title"
          :x="b.x + b.w / 2 - 0.6"
          :y="b.y + 18"
          width="1.2"
          :height="b.h - 36"
          :fill="b.textColor"
          opacity="0.7"
        />
      </g>
      <rect x="0" :y="row.y + row.shelfHeight - 6" :width="width" height="6" fill="#FFFFFF" />
      <rect x="0" :y="row.y + row.shelfHeight - 6" :width="width" height="1" fill="rgba(20,25,58,.08)" />
      <rect x="0" :y="row.y + row.shelfHeight" :width="width" height="4" fill="rgba(20,25,58,.05)" />
    </g>
  </svg>
</template>

<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'

const props = withDefaults(
  defineProps<{
    side?: 'left' | 'right'
    height?: number
    width?: number
    shelves?: number
  }>(),
  { side: 'left', height: 1100, width: 240, shelves: 7 },
)

const SPINE_COLORS = [
  '#6B2737', '#C4933D', '#2F5D44', '#1F2E54', '#A04A2C',
  '#E8DCC4', '#4E342E', '#7E9982', '#B47B7B', '#3A3A3A',
  '#8C5E3B', '#5170ff', '#D9B382', '#6E4A7E', '#264653',
]
const LIGHT = new Set(['#E8DCC4', '#D9B382', '#C4933D'])

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pickColor(rnd: () => number, last: string | null) {
  let c = SPINE_COLORS[Math.floor(rnd() * SPINE_COLORS.length)]
  if (c === last) c = SPINE_COLORS[(SPINE_COLORS.indexOf(c) + 3) % SPINE_COLORS.length]
  if (c === '#5170ff' && rnd() > 0.15) c = SPINE_COLORS[Math.floor(rnd() * 10)]
  return c
}

type Book = {
  id: string; x: number; y: number; w: number; h: number; color: string
  tilt: number; bands: boolean; title: boolean; textColor: string; bandColor: string
}

const rows = computed(() => {
  const shelfHeight = props.height / props.shelves
  const result: { y: number; shelfHeight: number; books: Book[]; seed: number }[] = []
  for (let i = 0; i < props.shelves; i++) {
    const seed = (props.side === 'left' ? 7 : 31) * (i + 1) * 11
    const rnd = mulberry32(seed)
    const y = i * shelfHeight
    const books: Book[] = []
    let x = 4
    let last: string | null = null
    let idx = 0
    while (x < props.width - 6) {
      const bw = 8 + Math.floor(rnd() * 14)
      const bh = shelfHeight - 6 - Math.floor(rnd() * 22)
      const tilt = rnd() < 0.07 ? (rnd() < 0.5 ? -8 : 8) : 0
      const color = pickColor(rnd, last)
      last = color
      const isLight = LIGHT.has(color)
      books.push({
        id: `${props.side}-${seed}-${idx}`,
        x,
        y: y + (shelfHeight - bh) - 8,
        w: bw,
        h: bh,
        color,
        tilt,
        bands: bh > 50 && idx % 3 === 0,
        title: bh > 70 && bw > 12 && idx % 2 === 0,
        textColor: isLight ? 'rgba(40,30,20,.55)' : 'rgba(255,255,255,.55)',
        bandColor: isLight ? 'rgba(40,30,20,.18)' : 'rgba(255,255,255,.18)',
      })
      x += bw + 1
      idx++
    }
    result.push({ y, shelfHeight, books, seed })
  }
  return result
})

function bookStyle(b: Book, i: number, seed: number): CSSProperties {
  return {
    transformOrigin: `${b.x + b.w / 2}px ${b.y + b.h}px`,
    transform: b.tilt ? `rotate(${b.tilt}deg)` : undefined,
    animationDelay: `${(i * 30 + seed * 50) % 1200}ms`,
  }
}
</script>

<style scoped>
.bk-shelf :deep(.bk-book) {
  animation: bookSlideIn .9s cubic-bezier(.16,.84,.44,1) both;
  transition: transform .35s cubic-bezier(.2,.7,.3,1.4);
}
.bk-book:hover { transform: translateY(-6px) rotate(-2deg) !important; cursor: pointer; }
@keyframes bookSlideIn {
  from { opacity: 0; transform: translateY(-14px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
