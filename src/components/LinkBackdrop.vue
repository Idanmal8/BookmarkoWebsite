<template>
  <!-- Shared backdrop for /idan and /idan/picks: soft blobs, abstract shapes, floating mascots. -->
  <span class="blob b1" aria-hidden="true" />
  <span class="blob b2" aria-hidden="true" />

  <!-- ── Abstract shapes + background mascots ── -->
  <div class="bg" aria-hidden="true">
    <svg class="shape ring" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" /></svg>
    <svg class="shape squiggle" viewBox="0 0 120 30"><path d="M4 18 C 20 2, 34 2, 48 16 S 76 30, 90 14 S 112 4, 116 12" /></svg>
    <svg class="shape dots" viewBox="0 0 60 60"><pattern id="lp-dot" width="12" height="12" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="2.2" /></pattern><rect width="60" height="60" fill="url(#lp-dot)" /></svg>
    <svg class="shape half" viewBox="0 0 100 50"><path d="M0 50 A50 50 0 0 1 100 50 Z" /></svg>
    <svg class="shape spark s-a" viewBox="0 0 40 40"><path d="M20 0 C22 14 26 18 40 20 C26 22 22 26 20 40 C18 26 14 22 0 20 C14 18 18 14 20 0 Z" /></svg>
    <svg class="shape spark s-b" viewBox="0 0 40 40"><path d="M20 0 C22 14 26 18 40 20 C26 22 22 26 20 40 C18 26 14 22 0 20 C14 18 18 14 20 0 Z" /></svg>
    <span class="shape pill" />
    <span class="shape tri" />
    <img class="float clover" :src="clover" alt="" />
    <img class="float triangle" :src="triangle" alt="" />
  </div>
</template>

<script setup lang="ts">
import clover from '@/assets/showcase/mascot-clover.svg'
import triangle from '@/assets/showcase/mascot-triangle.svg'
</script>

<style scoped>
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.55;
  pointer-events: none;
}
.b1 { width: 420px; height: 420px; background: var(--accent-soft); top: -160px; left: -140px; }
.b2 { width: 360px; height: 360px; background: var(--pink-soft); top: -120px; right: -150px; }

/* ── Background layer ── */
.bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.shape {
  position: absolute;
  animation: bob 9s ease-in-out infinite;
}
.ring { width: 90px; top: 210px; left: -28px; fill: none; stroke: var(--accent-soft); stroke-width: 9; }
.squiggle { width: 110px; top: 120px; right: 6%; fill: none; stroke: var(--pink); stroke-width: 5; stroke-linecap: round; opacity: 0.55; animation-delay: -2s; }
.dots { width: 90px; top: 560px; right: -20px; fill: var(--ink); opacity: 0.09; animation: none; }
.half { width: 120px; bottom: 260px; left: -40px; fill: #F5B83D; opacity: 0.35; transform: rotate(28deg); animation: none; }
.spark { fill: var(--accent); opacity: 0.5; }
.s-a { width: 22px; top: 70px; left: 14%; animation-delay: -4s; }
.s-b { width: 16px; top: 760px; right: 9%; fill: var(--pink); animation-delay: -6s; }
.pill { width: 70px; height: 26px; border-radius: 999px; background: #BDEBD4; top: 430px; left: 6%; transform: rotate(-24deg); opacity: 0.8; animation-delay: -3s; }
.tri { width: 0; height: 0; border-left: 22px solid transparent; border-right: 22px solid transparent; border-bottom: 38px solid var(--pink-soft); bottom: 120px; right: 10%; transform: rotate(14deg); opacity: 0.8; animation-delay: -5s; }

.float {
  position: absolute;
  width: 92px;
  animation: drift 7s ease-in-out infinite;
}
.clover { top: 40px; left: max(-20px, calc(50% - 400px)); width: 84px; }
.triangle { bottom: 330px; right: max(-26px, calc(50% - 420px)); width: 90px; animation-delay: -3.5s; }

/* On phones the edge mascots tuck half off-screen and fade back, so they never sit on top of a link. */
@media (max-width: 640px) {
  .float { width: 64px; opacity: 0.55; }
  .clover { left: -18px; top: 260px; }
  .triangle { right: -22px; }
  .squiggle { top: 330px; right: -30px; }
}


@keyframes bob {
  0%, 100% { translate: 0 0; }
  50% { translate: 0 -10px; }
}
@keyframes drift {
  0%, 100% { translate: 0 0; rotate: -4deg; }
  50% { translate: 0 -14px; rotate: 4deg; }
}

@media (prefers-reduced-motion: reduce) {
  .shape,
  .float { animation: none; }
}
</style>
