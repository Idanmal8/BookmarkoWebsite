<template>
  <div ref="host" class="gvoid" :class="{ 'is-on': on }" v-html="markup" />
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import markup from './ginie-void/ginie-void.svg?raw'
import { mountGinieVoid } from './ginie-void/ginieVoid'

const host = ref<HTMLElement | null>(null)
const on = ref(false)
let io: IntersectionObserver | null = null

onMounted(() => {
  const anim = mountGinieVoid(host.value!.querySelector('svg')!)
  // Reduced motion renders the final frame straight away, so there is nothing to wait for.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    on.value = true
    return
  }
  io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return
    on.value = true
    anim.play()
    io?.disconnect()
  }, { threshold: 0.45 })
  io.observe(host.value!)
})

onBeforeUnmount(() => io?.disconnect())
</script>

<style scoped>
/* Hidden until it plays, so the final frame never flashes before the portal opens */
.gvoid { opacity: 0; transition: opacity .3s; }
.gvoid.is-on { opacity: 1; }
.gvoid :deep(svg) { display: block; width: 100%; height: auto; overflow: visible; cursor: pointer; }
</style>
