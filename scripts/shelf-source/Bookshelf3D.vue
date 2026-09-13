<template>
  <div
    ref="root"
    class="bk"
    :class="`bk--${side}`"
    :style="rootStyle"
    aria-hidden="true"
  >
    <!-- The wall is a single plane turned away from the viewer, so its boards
         converge toward a vanishing point past the inner edge — a corridor. -->
    <div class="bk__wall">
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

            <!-- books lying flat -->
            <div v-else-if="item.kind === 'stack'" class="bk__stack" :style="{ width: `${item.w}px` }">
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

            <!-- upright panel between bays -->
            <div v-else class="bk-divider" :style="{ width: `${item.w}px` }">
              <span class="bk-f bk-f--front" />
              <span class="bk-f bk-f--side" />
            </div>
          </template>
        </div>

        <div class="bk__contact" />

        <div class="bk-plank">
          <span class="bk-plank__top" />
          <span class="bk-plank__front" />
          <span class="bk-plank__under" />
        </div>
      </div>
    </div>

    <!-- Light at the end of the corridor: hides where the wall stops. -->
    <div class="bk__haze" />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, type CSSProperties } from 'vue'
import gsap from 'gsap'

const props = withDefaults(
  defineProps<{
    side?: 'left' | 'right'
    shelves?: number
  }>(),
  { side: 'left', shelves: 7 },
)

const root = ref<HTMLElement | null>(null)

/* ---- corridor geometry ---------------------------------------------------
   The wall is BAYS bays long in its own flat space, then turned WALL_ANGLE
   degrees about its near (outer) edge. The viewer sits at ORIGIN_X across the
   column, so everything converges just past the column's inner edge. */
const WALL_ANGLE = 60
const PERSPECTIVE = 600
const ORIGIN_X = 45 // % of the column width
const BAY = 112 // wall-space px between dividers
const BAYS = 7
const DIVIDER = 6
const WALL_LEN = BAYS * (BAY + DIVIDER)
/** Cabinet depth in wall-space px. */
const SHELF_DEPTH = 30

const rootStyle = computed<CSSProperties>(
  () =>
    ({
      '--wall-w': `${WALL_LEN}px`,
      '--wall-a': `${WALL_ANGLE}deg`,
      '--persp': `${PERSPECTIVE}px`,
      '--origin-x': `${ORIGIN_X}%`,
      '--shelf-d': `${SHELF_DEPTH}px`,
    }) as CSSProperties,
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
type Flat = { id: string; h: number; depth: number; color: string; z: number }
type Stack = { kind: 'stack'; id: string; w: number; books: Flat[] }
type Divider = { kind: 'divider'; id: string; w: number }
type Row = { id: string; items: (Upright | Stack | Divider)[] }

const rows = computed<Row[]>(() => {
  const out: Row[] = []
  for (let i = 0; i < props.shelves; i++) {
    const seed = (props.side === 'left' ? 7 : 31) * (i + 1) * 11
    const rnd = mulberry32(seed)
    const items: (Upright | Stack | Divider)[] = []
    let last: string | null = null
    let idx = 0

    // Bay by bay, so the dividers line up from shelf to shelf.
    for (let bay = 0; bay < BAYS; bay++) {
      let used = 0
      while (used < BAY) {
        const remaining = BAY - used

        // Now and then a bay ends with a few books lying flat.
        if (remaining > 30 && remaining < 56 && rnd() < 0.45) {
          const w = Math.min(remaining - 2, 26 + Math.floor(rnd() * 10))
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
              z: -Math.floor(rnd() * 4),
            })
          }
          items.push({ kind: 'stack', id: `${props.side}-${seed}-stack${idx}`, w, books })
          used += w + 1.5
          idx++
          continue
        }

        // Clamp to what is left so a bay packs out instead of ending in a gap.
        const w = Math.min(14 + Math.floor(rnd() * 17), Math.floor(remaining))
        if (w < 7) break
        const color = pickColor(rnd, last)
        last = color
        const hPct = 0.64 + rnd() * 0.3
        items.push({
          kind: 'book',
          id: `${props.side}-${seed}-${idx}`,
          w,
          hPct,
          depth: 10 + Math.floor(rnd() * 9),
          color,
          light: LIGHT.has(color),
          lean: rnd() < 0.07 ? (rnd() < 0.5 ? -6 : 6) : 0,
          z: -Math.floor(rnd() * 6),
          bands: hPct > 0.78 && idx % 3 === 0,
          title: hPct > 0.8 && w > 16 && idx % 2 === 0,
        })
        used += w + 1.5
        idx++
      }
      items.push({ kind: 'divider', id: `${props.side}-${seed}-div${bay}`, w: DIVIDER })
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
    '--ink-on': b.light ? 'rgba(40,30,20,.45)' : 'rgba(255,255,255,.45)',
    '--band': b.light ? 'rgba(40,30,20,.18)' : 'rgba(255,255,255,.2)',
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

onMounted(() => {
  const el = root.value
  if (!el) return

  const boxes = Array.from(el.querySelectorAll<HTMLElement>('.bk-box'))
  const planks = Array.from(el.querySelectorAll<HTMLElement>('.bk-plank'))
  // The viewer stands off the near end of the wall, so turning the spine
  // toward them means rotating away from the wall's far end.
  const outward = props.side === 'left' ? -1 : 1

  // Resting pose: lean, and how far back each book sits on the shelf.
  boxes.forEach((box) => {
    gsap.set(box, {
      rotationZ: Number(box.dataset.lean || 0),
      z: Number(box.dataset.z || 0),
    })
  })

  mm = gsap.matchMedia()

  // The shelf itself never drifts — only the one-off entrance and the hover
  // respond, so nothing moves under the reader while they read.
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.from(planks, {
      scaleX: 0,
      duration: 0.8,
      stagger: 0.05,
      transformOrigin: props.side === 'left' ? 'left center' : 'right center',
    }).from(
      boxes,
      {
        // No opacity here on purpose: a non-1 opacity flattens a preserve-3d
        // box, so its faces would briefly render on top of each other.
        scaleY: 0.12,
        duration: 0.7,
        ease: 'back.out(1.6)',
        stagger: { amount: 1, from: 'start' },
      },
      '-=0.5',
    )

    // Tracked so that crossing between two faces of one book does not
    // re-trigger the pull-out (pointerover/out fire per face).
    let hovered: HTMLElement | null = null

    const enter = (e: Event) => {
      const box = (e.target as HTMLElement)?.closest?.('.bk-box') as HTMLElement | null
      if (!box || !el.contains(box) || box === hovered) return
      hovered = box
      gsap.to(box, {
        z: Number(box.dataset.z || 0) + 22,
        rotationY: outward * 10,
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

    return () => {
      tl.kill()
      el.removeEventListener('pointerover', enter)
      el.removeEventListener('pointerout', leave)
    }
  })
})

onBeforeUnmount(() => {
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
  perspective: var(--persp);
  perspective-origin: var(--origin-x) 50%;
}
.bk--right { perspective-origin: calc(100% - var(--origin-x)) 50%; }

/* The wall pivots on its near edge — the one at the outside of the page. */
.bk__wall {
  position: absolute;
  top: 0;
  height: 100%;
  width: var(--wall-w);
  display: flex;
  flex-direction: column;
  transform-style: preserve-3d;
}
.bk--left .bk__wall {
  left: 0;
  transform-origin: left center;
  transform: rotateY(var(--wall-a));
}
.bk--right .bk__wall {
  right: 0;
  transform-origin: right center;
  transform: rotateY(calc(var(--wall-a) * -1));
}

.bk__row {
  position: relative;
  flex: 1 1 0;
  min-height: 0;
  transform-style: preserve-3d;
}

/* Back of the cabinet. */
.bk__back {
  position: absolute;
  inset: 0;
  transform: translateZ(calc(var(--shelf-d) / -2));
  background: linear-gradient(to top, #c9d4e6, #e4eaf4);
}

.bk__items {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 6px;
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

/* ---- a book is a box: spine, one side, one top ---- */
.bk-box,
.bk-divider {
  position: relative;
  flex: 0 0 auto;
  transform-style: preserve-3d;
  transform-origin: 50% 100%;
}
.bk-divider {
  align-self: stretch;
  --d: var(--shelf-d);
}
.bk-f {
  position: absolute;
  display: block;
  backface-visibility: hidden;
}
.bk-f--front {
  inset: 0;
  transform: translateZ(calc(var(--d) / 2));
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
/* The visible side is the one turned back toward the near end of the wall. */
.bk--left .bk-f--side {
  right: 100%;
  transform-origin: right center;
  transform: translateZ(calc(var(--d) / 2)) rotateY(-90deg);
}
.bk--right .bk-f--side {
  left: 100%;
  transform-origin: left center;
  transform: translateZ(calc(var(--d) / 2)) rotateY(90deg);
}

/* Upright: flat spine in front, paper block to the side and on top. */
.bk-box--up > .bk-f--front {
  background:
    linear-gradient(
      to right,
      rgba(0, 0, 0, 0.28),
      rgba(0, 0, 0, 0) 26%,
      rgba(255, 255, 255, 0.08) 55%,
      rgba(0, 0, 0, 0.22)
    ),
    var(--col);
}
.bk-box--up > .bk-f--side,
.bk-box--flat > .bk-f--front,
.bk-box--flat > .bk-f--side {
  background: linear-gradient(to bottom, #f1ead9, #ded3bd);
}
.bk-box--up > .bk-f--top {
  background: #e7dfcc;
}
/* Flat: the cover faces up, the paper block faces out. */
.bk-box--flat > .bk-f--top {
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.12), rgba(0, 0, 0, 0.2)), var(--col);
}

/* Bay panel. */
.bk-divider > .bk-f--front { background: linear-gradient(to bottom, #ffffff, #e8eef8); }
.bk-divider > .bk-f--side { background: linear-gradient(to bottom, #eef2fa, #d7e0ee); }

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
  top: 26%;
  bottom: 26%;
  width: 1.4px;
  margin-left: -0.7px;
  background: var(--ink-on);
}

/* Occlusion where the books meet the board. */
.bk__contact {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 5px;
  height: 14px;
  /* Mid-depth and unfiltered: a filtered element drops out of the 3D scene
     and would paint over the spines in front of it. */
  transform: translateZ(0);
  background: linear-gradient(to top, rgba(20, 25, 58, 0.22), rgba(20, 25, 58, 0));
  pointer-events: none;
}

/* ---- the board ---- */
.bk-plank {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 5px;
  transform-style: preserve-3d;
}
.bk-plank__front,
.bk-plank__top,
.bk-plank__under {
  position: absolute;
  display: block;
}
.bk-plank__front {
  inset: 0;
  transform: translateZ(calc(var(--shelf-d) / 2));
  background: linear-gradient(to bottom, #ffffff, #dde5f2);
}
.bk-plank__top,
.bk-plank__under {
  left: 0;
  width: 100%;
  height: var(--shelf-d);
  transform-origin: bottom center;
  transform: translateZ(calc(var(--shelf-d) / 2)) rotateX(90deg);
}
.bk-plank__top { bottom: 100%; background: #f4f7fc; }
/* Seen from below on the shelves above eye level. */
.bk-plank__under { bottom: 0; background: #c6d2e6; }

/* A hint of light down the corridor. The dissolve into the page is a mask on
   the baked image, not a wash of white — white leaves a visible rectangle. */
.bk__haze {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.bk--left .bk__haze {
  background: linear-gradient(to right, rgba(255, 255, 255, 0) 58%, rgba(255, 255, 255, 0.5) 100%);
}
.bk--right .bk__haze {
  background: linear-gradient(to left, rgba(255, 255, 255, 0) 58%, rgba(255, 255, 255, 0.5) 100%);
}

.bk-box { cursor: pointer; }
</style>
