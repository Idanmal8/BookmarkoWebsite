<template>
  <section class="quote">
    <div class="quote__inner" data-reveal>
      <div class="quote__mark">"</div>
      <blockquote class="quote__text">
        A reader lives a thousand lives before she dies.
        <br />
        The man who never reads lives only one.
      </blockquote>
      <div class="quote__attr">— a reader, on a rainy Sunday</div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useReveal } from '@/composables/useReveal'
useReveal()
</script>

<style scoped>
.quote {
  background: transparent;
  padding: 140px 36px;
  text-align: center;
}
.quote__inner { max-width: 760px; margin: 0 auto; position: relative; }
.quote__mark {
  font-family: 'EB Garamond', serif;
  font-size: 200px;
  line-height: .8;
  color: var(--accent);
  opacity: .25;
  margin-bottom: -40px;
}
.quote__text {
  font-family: 'EB Garamond', serif;
  font-style: italic;
  font-weight: 400;
  font-size: clamp(28px, 3.5vw, 40px);
  line-height: 1.3;
  letter-spacing: -.01em;
  color: var(--ink);
  text-wrap: balance;
}
.quote__attr {
  margin-top: 28px;
  font-size: 13px;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--ink-mute);
}
</style>
