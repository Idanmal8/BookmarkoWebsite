<template>
  <div
    ref="root"
    class="bk"
    :class="`bk--${side}`"
    aria-hidden="true"
  >
    <div ref="stage" class="bk__stage">
      <div v-for="row in rows" :key="row.id" class="bk__row">
        <div class="bk__back" />

        <div class="bk__items">
          <template v-for="item in row.items" :key="item.id">
            <!-- upright book -->
            <div
              v-if="item.kind === 'book'"
              class="bk-box bk-box--up"
              :data-lean="item.lean"
              :data-z="item.z"
              :style="uprightStyle(item)"
            >
              <span class="bk-f bk-f--front">
                <i v-if="item.bands" class="bk-band bk-band--top" />
                <i v-if="item.bands" class="bk-band bk-band--bottom" />
                <i v-if="item.title" class="bk-title" />
              </span>
              <span class="bk-f bk-f--side" />
              <span class="bk-f bk-f--top" />
            </div>

            <!-- stack of books lying flat -->
            <div v-else class="bk__stack" :style="{ width: `${item.w}px` }">
              <div
                v-for="flat in item.books"
                :key="flat.id"
                class="bk-box bk-box--flat"
                :data-lean="0"
                :data-z="flat.z"
                :style="flatStyle(flat)"
              >
                <span class="bk-f bk-f--front" />
                <span class="bk-f bk-f--side" />
                <span class="bk-f bk-f--top" />
              </div>
            </div>
          </template>
        </div>

        <div class="bk__contact" />

        <div class="bk-plank">
          <span class="bk-plank__top" />
          <span class="bk-plank__front" />
        </div>
      </div>
    </div>

    <div class="bk__frame" />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, type CSSProperties } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const props = withDefaults(
  defineProps<{
    side?: 'left' | 'right'
    /** Column width in px — decides how many books fit on a shelf. */
    width?: number
    shelves?: number
  }>(),
  { side: 'left', width: 240, shelves: 7 },
)

const root = ref<HTMLElement | null>(null)
const stage = ref<HTMLElement | null>(null)

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

type Upright = {
  kind: 'book'
  id: string
  w: number
  hPct: number
  depth: number
  color: string
  light: boolean
  lean: number
  z: number
  bands: boolean
  title: boolean
}
type Flat = { id: string; h: number; depth: number; color: string; light: boolean; z: number }
type Stack = { kind: 'stack'; id: string; w: number; books: Flat[] }
type Row = { id: string; items: (Upright | Stack)[] }

/** Shelf depth in px — how far back the cabinet reads. Books stay shallower. */
const SHELF_DEPTH = 38

const rows = computed<Row[]>(() => {
  const out: Row[] = []
  for (let i = 0; i < props.shelves; i++) {
    const seed = (props.side === 'left' ? 7 : 31) * (i + 1) * 11
    const rnd = mulberry32(seed)
    const items: (Upright | Stack)[] = []
    let used = 0
    let last: string | null = null
    let idx = 0
    const limit = props.width + 8

    while (used < limit) {
      const remaining = limit - used

      // Occasionally finish a shelf with a small flat stack.
      if (remaining > 34 && remaining < 64 && rnd() < 0.55) {
        const w = Math.min(remaining - 2, 28 + Math.floor(rnd() * 10))
        const count = 2 + Math.floor(rnd() * 2)
        const books: Flat[] = []
        for (let k = 0; k < count; k++) {
          const color = pickColor(rnd, last)
          last = color
          books.push({
            id: `${props.side}-${seed}-s${idx}-${k}`,
            h: 7 + Math.floor(rnd() * 4),
            depth: Math.min(SHELF_DEPTH - 6, w - 2),
            color,
            light: LIGHT.has(color),
            z: -Math.floor(rnd() * 5),
          })
        }
        items.push({ kind: 'stack', id: `${props.side}-${seed}-stack${idx}`, w, books })
        used += w + 2
        idx++
        continue
      }

      const w = 9 + Math.floor(rnd() * 14)
      if (w > remaining) break
      const color = pickColor(rnd, last)
      last = color
      const hPct = 0.58 + rnd() * 0.33
      items.push({
        kind: 'book',
        id: `${props.side}-${seed}-${idx}`,
        w,
        hPct,
        depth: 16 + Math.floor(rnd() * 14),
        color,
        light: LIGHT.has(color),
        lean: rnd() < 0.08 ? (rnd() < 0.5 ? -7 : 7) : 0,
        z: -Math.floor(rnd() * 7),
        bands: hPct > 0.7 && idx % 3 === 0,
        title: hPct > 0.72 && w > 13 && idx % 2 === 0,
      })
      used += w + 1.5
      idx++
    }
    out.push({ id: `${props.side}-row-${i}`, items })
  }
  return out
})

function uprightStyle(b: Upright): CSSProperties {
  return {
    width: `${b.w}px`,
    height: `${(b.hPct * 100).toFixed(2)}%`,
    '--d': `${b.depth}px`,
    '--col': b.color,
    '--ink-on': b.light ? 'rgba(40,30,20,.5)' : 'rgba(255,255,255,.5)',
    '--band': b.light ? 'rgba(40,30,20,.2)' : 'rgba(255,255,255,.24)',
  } as CSSProperties
}

function flatStyle(f: Flat): CSSProperties {
  return {
    width: '100%',
    height: `${f.h}px`,
    '--d': `${f.depth}px`,
    '--col': f.color,
  } as CSSProperties
}

let mm: gsap.MatchMedia | null = null
let onMove: ((e: PointerEvent) => void) | null = null

onMounted(() => {
  const el = root.value
  const stageEl = stage.value
  if (!el || !stageEl) return

  const boxes = Array.from(el.querySelectorAll<HTMLElement>('.bk-box'))
  const planks = Array.from(el.querySelectorAll<HTMLElement>('.bk-plank'))
  const outward = props.side === 'left' ? -1 : 1

  // Resting pose: lean + how far back each book sits on the shelf.
  boxes.forEach((box) => {
    gsap.set(box, {
      rotationZ: Number(box.dataset.lean || 0),
      z: Number(box.dataset.z || 0),
    })
  })

  mm = gsap.matchMedia()

  // Full motion: entrance, pointer parallax, hover pull-out.
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.from(planks, {
      scaleX: 0,
      duration: 0.7,
      stagger: 0.05,
      transformOrigin: props.side === 'left' ? 'left center' : 'right center',
    }).from(
      boxes,
      {
        // No opacity here on purpose: a non-1 opacity flattens a preserve-3d
        // box, so the faces would briefly render on top of each other.
        scaleY: 0.12,
        duration: 0.7,
        ease: 'back.out(1.7)',
        stagger: { each: 0.012, from: 'start' },
      },
      '-=0.45',
    )

    const ry = gsap.quickTo(stageEl, 'rotationY', { duration: 0.9, ease: 'power3.out' })
    const rx = gsap.quickTo(stageEl, 'rotationX', { duration: 0.9, ease: 'power3.out' })

    onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = (e.clientY / window.innerHeight) * 2 - 1
      ry(nx * 3.5)
      rx(-ny * 2)
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    // Tracked so that moving between two faces of the same book does not
    // re-trigger the pull-out (pointerover/out fire per face).
    let hovered: HTMLElement | null = null

    const enter = (e: Event) => {
      const box = (e.target as HTMLElement)?.closest?.('.bk-box') as HTMLElement | null
      if (!box || !el.contains(box) || box === hovered) return
      hovered = box
      gsap.to(box, {
        z: Number(box.dataset.z || 0) + 26,
        rotationY: outward * 11,
        rotationZ: Number(box.dataset.lean || 0) * 0.4,
        duration: 0.45,
        ease: 'power3.out',
        overwrite: 'auto',
      })
    }
    const leave = (e: Event) => {
      if (!hovered) return
      const to = (e as PointerEvent).relatedTarget as HTMLElement | null
      if (to && to.closest?.('.bk-box') === hovered) return
      const box = hovered
      hovered = null
      gsap.to(box, {
        z: Number(box.dataset.z || 0),
        rotationY: 0,
        rotationZ: Number(box.dataset.lean || 0),
        duration: 0.8,
        ease: 'elastic.out(1, 0.55)',
        overwrite: 'auto',
      })
    }
    el.addEventListener('pointerover', enter)
    el.addEventListener('pointerout', leave)

    // Gentle vertical parallax so the shelf drifts against the hero copy.
    const drift = gsap.fromTo(
      stageEl,
      { y: 40 },
      {
        y: -40,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
      },
    )

    return () => {
      tl.kill()
      drift.scrollTrigger?.kill()
      drift.kill()
      if (onMove) window.removeEventListener('pointermove', onMove)
      onMove = null
      el.removeEventListener('pointerover', enter)
      el.removeEventListener('pointerout', leave)
      gsap.set(stageEl, { rotationX: 0, rotationY: 0, y: 0 })
    }
  })
})

onBeforeUnmount(() => {
  if (onMove) window.removeEventListener('pointermove', onMove)
  mm?.revert()
  mm = null
})
</script>

<style scoped>
.bk {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  perspective: 1200px;
  --shelf-d: 38px;
  /* Vanishing point sits toward the page centre so each shelf is seen at an
     angle — the left unit shows its right-hand faces and vice versa. */
  perspective-origin: 260% 45%;
}
.bk--right { perspective-origin: -160% 45%; }

.bk__stage {
  position: absolute;
  left: 0;
  right: 0;
  top: -48px;
  height: calc(100% + 96px);
  display: flex;
  flex-direction: column;
  transform-style: preserve-3d;
  will-change: transform;
}

.bk__row {
  position: relative;
  flex: 1 1 0;
  min-height: 0;
  transform-style: preserve-3d;
}

/* Dim cabinet interior behind the books. */
.bk__back {
  position: absolute;
  inset: 0;
  transform: translateZ(calc(var(--shelf-d) / -2));
  background: linear-gradient(
    to top,
    rgba(20, 25, 58, 0.26),
    rgba(20, 25, 58, 0.12) 55%,
    rgba(20, 25, 58, 0.05)
  );
}

.bk__items {
  position: absolute;
  left: 3px;
  right: 0;
  bottom: 7px;
  top: 0;
  display: flex;
  align-items: flex-end;
  gap: 1.5px;
  transform-style: preserve-3d;
}
.bk__stack {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  flex: 0 0 auto;
  transform-style: preserve-3d;
}

/* ---- a book is a real box: front, one side, one top ---- */
.bk-box {
  position: relative;
  flex: 0 0 auto;
  transform-style: preserve-3d;
  transform-origin: 50% 100%;
}
.bk-f {
  position: absolute;
  display: block;
  backface-visibility: hidden;
}
.bk-f--front {
  inset: 0;
  transform: translateZ(calc(var(--d) / 2));
  border-radius: 1px 2px 2px 1px;
}
.bk-f--side {
  top: 0;
  width: var(--d);
  height: 100%;
}
.bk-f--top {
  left: 0;
  width: 100%;
  height: var(--d);
  bottom: 100%;
  transform-origin: bottom center;
  transform: translateZ(calc(var(--d) / 2)) rotateX(90deg);
}
/* The visible side face is the one turned toward the page centre. */
.bk--left .bk-f--side {
  left: 100%;
  transform-origin: left center;
  transform: translateZ(calc(var(--d) / 2)) rotateY(90deg);
}
.bk--right .bk-f--side {
  right: 100%;
  transform-origin: right center;
  transform: translateZ(calc(var(--d) / 2)) rotateY(-90deg);
}

/* Upright: coloured spine in front, paper block to the side and on top. */
.bk-box--up > .bk-f--front {
  background:
    linear-gradient(
      to right,
      rgba(0, 0, 0, 0.34),
      rgba(0, 0, 0, 0.06) 14%,
      rgba(255, 255, 255, 0.14) 38%,
      rgba(255, 255, 255, 0.02) 62%,
      rgba(0, 0, 0, 0.3)
    ),
    var(--col);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12), inset 0 -2px 4px rgba(0, 0, 0, 0.22);
}
.bk-box--up > .bk-f--side,
.bk-box--flat > .bk-f--front,
.bk-box--flat > .bk-f--side {
  background:
    repeating-linear-gradient(
      to bottom,
      rgba(20, 25, 58, 0.1) 0 1px,
      rgba(255, 255, 255, 0) 1px 3px
    ),
    linear-gradient(to right, #efe7d6, #d8cdb6);
}
.bk-box--up > .bk-f--top {
  background: linear-gradient(to bottom, #f2ebdb, #cfc3ab);
  box-shadow: inset 0 0 2px rgba(20, 25, 58, 0.16);
}
/* Flat: the cover faces up, the paper block faces out. */
.bk-box--flat > .bk-f--top {
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.16), rgba(0, 0, 0, 0.26)), var(--col);
}

.bk-band {
  position: absolute;
  left: 0;
  right: 0;
  height: 1.5px;
  background: var(--band);
}
.bk-band--top { top: 14%; }
.bk-band--bottom { bottom: 14%; }
.bk-title {
  position: absolute;
  left: 50%;
  top: 24%;
  bottom: 24%;
  width: 1.4px;
  margin-left: -0.7px;
  background: var(--ink-on);
  border-radius: 1px;
}

/* Soft occlusion where the books meet the board. */
.bk__contact {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 6px;
  height: 16px;
  /* Mid-depth, and with no filter: a filtered element is flattened out of the
     3D scene and would paint over the spines in front of it. */
  transform: translateZ(0);
  background: linear-gradient(to top, rgba(20, 25, 58, 0.26), rgba(20, 25, 58, 0));
  pointer-events: none;
}

/* ---- the board ---- */
.bk-plank {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 7px;
  transform-style: preserve-3d;
}
.bk-plank__front,
.bk-plank__top {
  position: absolute;
  display: block;
}
.bk-plank__front {
  inset: 0;
  transform: translateZ(calc(var(--shelf-d) / 2));
  background: linear-gradient(to bottom, #ffffff, #e6ecf6 60%, #cdd8ea);
  box-shadow: 0 4px 10px -4px rgba(20, 25, 58, 0.35);
}
.bk-plank__top {
  left: 0;
  width: 100%;
  height: var(--shelf-d);
  bottom: 100%;
  transform-origin: bottom center;
  transform: translateZ(calc(var(--shelf-d) / 2)) rotateX(90deg);
  background: linear-gradient(to bottom, #ffffff, #dbe3f1);
}

/* Cabinet vignette. */
.bk__frame {
  position: absolute;
  inset: 0;
  pointer-events: none;
  box-shadow: inset 0 0 50px rgba(20, 25, 58, 0.1);
}

.bk-box { cursor: pointer; }
</style>
