<template>
  <!-- Rendered only on fine-pointer (non-touch) devices; see mounted() guard -->
  <div v-if="enabled" class="cursor-root" aria-hidden="true">
    <!-- The pixel-art book that trails the pointer -->
    <div ref="bookEl" class="cursor-book" :class="{ 'is-click': clicking, 'is-hot': hovering }">
      <div class="cursor-book-tilt">
        <svg
          :viewBox="`0 0 ${GRID} ${GRID}`"
          width="34"
          height="34"
          shape-rendering="crispEdges"
        >
          <rect
            v-for="(p, i) in pixels"
            :key="i"
            :x="p.x"
            :y="p.y"
            width="1.02"
            height="1.02"
            :fill="p.color"
          />
        </svg>
      </div>
    </div>

    <!-- Sparkle particles spawned on click -->
    <div
      v-for="s in sparkles"
      :key="s.id"
      class="cursor-spark"
      :style="s.style"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const GRID = 16

/* Pixel-art blue book with a little bookmark ribbon.
   D = dark blue outline, B = cover, L = spine sheen,
   M = bookmark ribbon, P = page edge, . = transparent */
const ART = [
  '................',
  '................',
  '...DDDDDDDDDD...',
  '..DBBBBMMBBBBD..',
  '..DBLBBMMBBBBD..',
  '..DBLBBMMBBBBD..',
  '..DBLBBMMBBBBD..',
  '..DBLBBBBBBBBD..',
  '..DBLBBBBBBBBD..',
  '..DBLBBBBBBBBD..',
  '..DBLBBBBBBBBD..',
  '..DBLBBBBBBBBD..',
  '..DBBBBBBBBBBD..',
  '..DDDDDDDDDDDD..',
  '...PPPPPPPPPP...',
  '................',
]

const COLORS: Record<string, string> = {
  D: '#3d59e6', // --accent-deep
  B: '#5170ff', // --accent
  L: '#A5C2F4', // --accent-soft (sheen)
  M: '#FFC24D', // bookmark ribbon
  P: '#F7F9FC', // --paper (page edge)
}

const pixels = computed(() => {
  const out: { x: number; y: number; color: string }[] = []
  ART.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const c = row[x]
      if (c !== '.') out.push({ x, y, color: COLORS[c] })
    }
  })
  return out
})

const enabled = ref(false)
const clicking = ref(false)
const hovering = ref(false)
const bookEl = ref<HTMLElement | null>(null)

let reduceMotion = false
let sparkId = 0
type Spark = { id: number; style: Record<string, string> }
const sparkles = ref<Spark[]>([])

// Pointer follow state (kept out of reactivity for per-frame perf)
let targetX = -100
let targetY = -100
let curX = -100
let curY = -100
let raf = 0
let clickTimer: number | undefined

function onMove(e: MouseEvent) {
  targetX = e.clientX
  targetY = e.clientY
  // Book grows a touch over clickable things
  hovering.value = !!(e.target as HTMLElement)?.closest?.('a, button, [role="button"], input, label')
}

function frame() {
  // Smooth trailing follow (snappier when reduced motion is on)
  const ease = reduceMotion ? 1 : 0.28
  curX += (targetX - curX) * ease
  curY += (targetY - curY) * ease
  if (bookEl.value) {
    bookEl.value.style.transform = `translate3d(${curX}px, ${curY}px, 0)`
  }
  raf = requestAnimationFrame(frame)
}

const SPARK_COLORS = ['#5170ff', '#FFC24D', '#A5C2F4', '#FFFFFF']

function burst(x: number, y: number) {
  const count = reduceMotion ? 4 : 9
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.6
    const dist = 14 + Math.random() * 26
    const tx = Math.cos(angle) * dist
    const ty = Math.sin(angle) * dist
    const id = sparkId++
    const size = 3 + Math.round(Math.random() * 3)
    sparkles.value.push({
      id,
      style: {
        left: `${x}px`,
        top: `${y}px`,
        width: `${size}px`,
        height: `${size}px`,
        background: SPARK_COLORS[i % SPARK_COLORS.length],
        '--tx': `${tx}px`,
        '--ty': `${ty}px`,
        animationDelay: `${Math.random() * 40}ms`,
      },
    })
    // Clean up after the animation finishes
    window.setTimeout(() => {
      sparkles.value = sparkles.value.filter((s) => s.id !== id)
    }, 700)
  }
}

function onDown(e: MouseEvent) {
  clicking.value = true
  window.clearTimeout(clickTimer)
  clickTimer = window.setTimeout(() => (clicking.value = false), 320)
  burst(e.clientX, e.clientY)
}

onMounted(() => {
  const fine = window.matchMedia('(pointer: fine)').matches
  if (!fine) return // touch / coarse pointer → keep native behaviour
  reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  enabled.value = true
  document.documentElement.classList.add('has-book-cursor')

  window.addEventListener('mousemove', onMove, { passive: true })
  window.addEventListener('mousedown', onDown)
  raf = requestAnimationFrame(frame)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.clearTimeout(clickTimer)
  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('mousedown', onDown)
  document.documentElement.classList.remove('has-book-cursor')
})
</script>

<style>
/* Hide the native cursor everywhere once the book cursor is active */
html.has-book-cursor,
html.has-book-cursor * {
  cursor: none !important;
}
</style>

<style scoped>
.cursor-root {
  position: fixed;
  inset: 0;
  z-index: 2147483647; /* above everything, incl. paper-grain overlay */
  pointer-events: none;
}

.cursor-book {
  position: fixed;
  top: 0;
  left: 0;
  /* Center the book on the pointer; translate3d is set per-frame in JS */
  margin: -17px 0 0 -17px;
  will-change: transform;
  filter: drop-shadow(0 3px 4px rgba(20, 25, 58, 0.28));
}

/* Base 3D tilt — angles the book so it's viewed from above/side (nicer POV) */
.cursor-book-tilt {
  transform: perspective(320px) rotateX(24deg) rotateY(26deg) rotate(-6deg);
  transform-origin: center center;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.cursor-book.is-hot .cursor-book-tilt {
  transform: perspective(320px) rotateX(16deg) rotateY(18deg) rotate(-3deg);
}

.cursor-book svg {
  display: block;
  image-rendering: pixelated;
  transform: scale(1) rotate(0deg);
  transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.cursor-book.is-hot svg {
  transform: scale(1.18);
}

/* Click "boop": quick squash-and-jump */
.cursor-book.is-click svg {
  animation: book-boop 0.32s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes book-boop {
  0% { transform: scale(1) rotate(0deg) translateY(0); }
  35% { transform: scale(1.35, 0.8) rotate(-10deg) translateY(2px); }
  70% { transform: scale(0.92, 1.12) rotate(8deg) translateY(-5px); }
  100% { transform: scale(1) rotate(0deg) translateY(0); }
}

.cursor-spark {
  position: fixed;
  border-radius: 1px; /* keep the pixel look */
  image-rendering: pixelated;
  transform: translate(-50%, -50%);
  animation: spark-fly 0.66s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
  box-shadow: 0 0 4px rgba(81, 112, 255, 0.6);
}

@keyframes spark-fly {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) translate(0, 0) scale(1) rotate(0deg);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) translate(var(--tx), var(--ty)) scale(0.2) rotate(180deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .cursor-book.is-click svg { animation-duration: 0.2s; }
  .cursor-spark { animation-duration: 0.4s; }
}
</style>
