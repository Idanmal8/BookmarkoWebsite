<template>
  <section class="finale">
    <div class="finale__inner" data-reveal>
      <div class="finale__lamp" aria-hidden="true">
        <div class="finale__lamp-glow" />
        <div class="finale__lamp-arm" />
        <div class="finale__lamp-shade" />
      </div>
      <h2 class="finale__title">
        The kettle's on.<br />
        The chair is yours.
      </h2>
      <p class="finale__sub">
        Join the journey and we'll save you a quiet seat by the window.
      </p>
      <a href="#waitlist" class="finale__cta">
        Take me to the shelf
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useReveal } from '@/composables/useReveal'
useReveal()
</script>

<style scoped>
.finale {
  background: transparent;
  color: var(--paper);
  padding: 140px 36px 100px;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.finale__inner { max-width: 640px; margin: 0 auto; position: relative; }
.finale__lamp {
  position: relative;
  width: 80px; height: 80px;
  margin: 0 auto 36px;
}
.finale__lamp-glow {
  position: absolute;
  top: 60%; left: 50%;
  transform: translate(-50%, 0);
  width: 380px; height: 380px;
  background: radial-gradient(ellipse at center, rgba(255, 207, 119, .25) 0%, transparent 60%);
  border-radius: 50%;
  pointer-events: none;
  animation: lampPulse 4s ease-in-out infinite;
}
@keyframes lampPulse {
  0%, 100% { opacity: .8; }
  50% { opacity: 1; }
}
.finale__lamp-arm {
  position: absolute;
  top: -120px; left: 50%;
  transform: translateX(-50%);
  width: 2px; height: 120px;
  background: rgba(250,245,235,.4);
}
.finale__lamp-shade {
  position: absolute;
  top: 0; left: 50%;
  transform: translateX(-50%);
  width: 80px; height: 40px;
  background: linear-gradient(to bottom, #5a4a36 0%, #3a2e22 100%);
  border-radius: 50% 50% 8px 8px / 100% 100% 8px 8px;
  box-shadow: inset 0 -6px 12px rgba(255, 207, 119, .35);
}
.finale__lamp-shade::after {
  content: "";
  position: absolute;
  bottom: -2px; left: 6px; right: 6px;
  height: 8px;
  background: radial-gradient(ellipse at center top, rgba(255, 207, 119, .85), transparent 70%);
  border-radius: 50%;
}
.finale__title {
  font-family: 'EB Garamond', serif;
  font-weight: 500;
  font-size: clamp(40px, 5vw, 62px);
  line-height: 1.05;
  letter-spacing: -.015em;
  margin-bottom: 22px;
}
.finale__sub {
  font-size: 17px;
  color: rgba(250,245,235,.7);
  margin: 0 auto 36px;
  max-width: 440px;
  line-height: 1.6;
}
.finale__cta {
  display: inline-flex; align-items: center; gap: 10px;
  background: var(--accent);
  color: #fff;
  text-decoration: none;
  padding: 14px 26px;
  font-size: 15px; font-weight: 600;
  border-radius: 999px;
  transition: background .2s, transform .2s, box-shadow .2s;
  box-shadow: 0 14px 30px -10px rgba(81,112,255,.6);
}
.finale__cta:hover {
  background: var(--accent-deep);
  transform: translateY(-2px);
  box-shadow: 0 18px 36px -10px rgba(81,112,255,.7);
}
</style>
