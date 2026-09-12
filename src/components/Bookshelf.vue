<template>
  <!-- Decorative corridor of shelves. This was ~1,800 live 3D elements, which
       made the compositor re-rasterise the whole scene on every scroll frame
       (~54ms per frame). It is now one baked image per side. The scene that
       produced them is kept in scripts/shelf-source/ — see scripts/bake-shelves.md. -->
  <img
    ref="img"
    class="bk"
    :class="`bk--${side}`"
    :src="side === 'left' ? shelfLeft : shelfRight"
    alt=""
    aria-hidden="true"
    decoding="async"
    loading="lazy"
  />
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import gsap from 'gsap'
import shelfLeft from '@/assets/shelf-left.webp'
import shelfRight from '@/assets/shelf-right.webp'

withDefaults(defineProps<{ side?: 'left' | 'right' }>(), { side: 'left' })

const img = ref<HTMLImageElement | null>(null)
let mm: gsap.MatchMedia | null = null

onMounted(() => {
  const el = img.value
  if (!el) return
  mm = gsap.matchMedia()
  // One tween on one element, so nothing is animating once the hero settles.
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const tween = gsap.from(el, { opacity: 0, yPercent: 2, duration: 1.1, ease: 'power3.out' })
    return () => tween.kill()
  })
})

onBeforeUnmount(() => {
  mm?.revert()
  mm = null
})
</script>

<style scoped>
.bk {
  /* Out of flow: the source art is 4800px tall, and in flow that intrinsic
     height stretches the hero's grid row instead of filling it. */
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  /* Baked far taller than any viewport, so it crops instead of stretching and
     the corridor's horizon stays on the centre line. */
  object-fit: cover;
  object-position: center center;
  user-select: none;
  pointer-events: none;
}
</style>
