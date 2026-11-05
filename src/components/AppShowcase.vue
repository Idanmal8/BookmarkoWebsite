<template>
  <section
    class="showcase"
    aria-label="Bookmarko on iPhone"
    :style="{ '--tx': tilt.x, '--ty': tilt.y }"
    @pointermove="onMove"
    @pointerleave="onLeave"
  >
    <div class="showcase__stage" data-reveal>
      <!-- Left side: reading streak and a finished quest -->
      <div class="sc-item sc-card-streak" style="--d: 10; --dur: 9s; --delay: -2s">
        <div class="sc-par">
          <div class="sc-card">
            <span class="sc-card__label">Reading streak</span>
            <span class="sc-card__big">12 <small>days</small></span>
            <span class="sc-dots"><i v-for="n in 6" :key="n" class="on" /><i class="today" /></span>
          </div>
          <img class="sc-peek sc-peek--heart" :src="mascotHeart" alt="" />
        </div>
      </div>

      <div class="sc-item sc-card-quest" style="--d: 16; --dur: 8s; --delay: -5s">
        <div class="sc-par">
          <div class="sc-card sc-card--row sc-card--quest">
            <img class="sc-card__badge" :src="badgePerfectWeek" alt="" />
            <span class="sc-card__text">
              <span class="sc-quest__top"><b>Perfect week</b><span class="sc-pill">Done</span></span>
              <span>Read every day this week.</span>
              <span class="sc-progress sc-progress--done"><i style="width: 100%" /></span>
              <span class="sc-quest__count">7 of 7</span>
            </span>
          </div>
        </div>
      </div>

      <div class="sc-item sc-mascot sc-mascot--clover" style="--d: 24; --dur: 6s; --delay: -1s">
        <div class="sc-par"><img :src="mascotClover" alt="" /></div>
      </div>

      <!-- Right side: Ginie and the yearly goal -->
      <div class="sc-item sc-card-ginie" style="--d: 12; --dur: 9.5s; --delay: -4s">
        <div class="sc-par">
          <div class="sc-card sc-card--row">
            <img class="sc-card__ginie" :src="ginieStar" alt="" />
            <span class="sc-card__text">
              <b>Ginie</b>
              <span>Loved Piranesi? <em>The Night Circus</em> is next on your shelf.</span>
            </span>
          </div>
          <img class="sc-peek sc-peek--cupcake" :src="mascotCupcake" alt="" />
        </div>
      </div>

      <div class="sc-item sc-card-goal" style="--d: 18; --dur: 8.5s; --delay: -6s">
        <div class="sc-par">
          <div class="sc-card sc-card--row">
            <img class="sc-card__cover" :src="coverRedRising" alt="" />
            <span class="sc-card__text">
              <span class="sc-card__label">Now reading</span>
              <b>Red Rising</b>
              <span class="sc-progress"><i style="width: 56%" /></span>
              <span>Page 214 of 382</span>
            </span>
          </div>
          <img class="sc-peek sc-peek--triangle" :src="mascotTriangle" alt="" />
        </div>
      </div>

      <div class="sc-item sc-mascot sc-mascot--keycap" style="--d: 26; --dur: 7s; --delay: -3s">
        <div class="sc-par"><img :src="mascotKeycap" alt="" /></div>
      </div>

      <!-- The phones, centred -->
      <div class="showcase__phones">
        <div class="sc-item showcase__phone showcase__phone--left" style="--d: 14; --dur: 7s; --delay: 0s">
          <div class="sc-par"><img :src="phoneLibrary" alt="The Bookmarko library on an iPhone" /></div>
        </div>
        <div class="sc-item showcase__phone showcase__phone--right" style="--d: 22; --dur: 8s; --delay: -3s">
          <div class="sc-par"><img :src="phoneProfile" alt="A reader's Bookmarko profile on an iPhone" /></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useReveal } from '@/composables/useReveal'
// Renders of the iPhone 18 Pro Max model, not the model itself: its licence forbids shipping the
// .glb to visitors. Re-render with BookmarkoAssets/marketing/social/phone3d_2026-11-05 (?bare mode).
import phoneLibrary from '@/assets/showcase/phone-library.webp'
import phoneProfile from '@/assets/showcase/phone-profile.webp'
// The app's sticker mascots (Bookmarko/assets/images/login_mountain) and quest badge art.
import mascotHeart from '@/assets/showcase/mascot-heart.svg'
import mascotClover from '@/assets/showcase/mascot-clover.svg'
import mascotCupcake from '@/assets/showcase/mascot-cupcake.svg'
import mascotTriangle from '@/assets/showcase/mascot-triangle.svg'
import mascotKeycap from '@/assets/showcase/mascot-keycap.svg'
import badgePerfectWeek from '@/assets/showcase/badge-perfect-week.webp'
import ginieStar from '@/assets/ginie-star.svg'
import coverRedRising from '@/assets/Books/RedRising.webp'

useReveal()

const tilt = reactive({ x: 0, y: 0 })
const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches

function onMove(e: PointerEvent) {
  if (still || e.pointerType !== 'mouse') return
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
  tilt.x = ((e.clientX - r.left) / r.width) * 2 - 1
  tilt.y = ((e.clientY - r.top) / r.height) * 2 - 1
}

function onLeave() {
  tilt.x = 0
  tilt.y = 0
}
</script>

<style scoped>
.showcase {
  --tx: 0;
  --ty: 0;
  padding: 24px 24px 96px;
  overflow: hidden;
}

/* An invisible frame; everything floats straight on the page gradient */
.showcase__stage {
  position: relative;
  max-width: 1280px;
  height: clamp(420px, 50vw, 640px);
  margin: 0 auto;
}

/* Every floating thing is two layers: the outer one bobs, the inner one follows the pointer by
   its depth --d, so nearer things (bigger --d) drift further. */
.sc-item {
  position: absolute;
  animation: scFloat var(--dur, 8s) ease-in-out var(--delay, 0s) infinite;
}
.sc-par {
  position: relative;
  height: 100%;
  transform: translate3d(calc(var(--tx) * var(--d) * 1px), calc(var(--ty) * var(--d) * .7px), 0);
  transition: transform .6s cubic-bezier(.16, .84, .44, 1);
}
@keyframes scFloat {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-12px); }
}

/* Phones: a centred group sized from the stage height */
.showcase__phones {
  position: absolute;
  top: 0;
  left: 50%;
  height: 100%;
  aspect-ratio: .95;
  transform: translateX(-50%);
}
.showcase__phone { height: 92%; top: 6%; left: 0; }
.showcase__phone--right { height: 89%; top: 0; left: 40%; }
.showcase__phone img {
  display: block;
  height: 100%;
  width: auto;
  filter: drop-shadow(0 30px 34px rgba(20, 25, 58, .22)) drop-shadow(0 8px 12px rgba(20, 25, 58, .14));
}

/* Frosted cards, like a glass sticker resting on the page */
.sc-card {
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 230px;
  padding: 16px 18px;
  border-radius: 22px;
  background: rgba(255, 255, 255, .58);
  border: 1px solid rgba(255, 255, 255, .75);
  -webkit-backdrop-filter: blur(14px) saturate(1.3);
  backdrop-filter: blur(14px) saturate(1.3);
  box-shadow: 0 18px 40px -18px rgba(20, 25, 58, .25), 0 2px 6px rgba(20, 25, 58, .05);
  color: var(--ink);
}
.sc-card--row { flex-direction: row; align-items: center; gap: 12px; width: 270px; }
.sc-card__label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: var(--ink-mute);
}
.sc-card__big { font-family: 'EB Garamond', serif; font-size: 34px; font-weight: 600; line-height: 1.05; }
.sc-card__big small { font-size: 16px; font-weight: 500; color: var(--ink-soft); }
.sc-card__text { display: flex; flex-direction: column; gap: 2px; font-size: 12.5px; line-height: 1.35; color: var(--ink-soft); min-width: 0; }
.sc-card__text b { font-family: 'EB Garamond', serif; font-size: 18px; font-weight: 600; color: var(--ink); line-height: 1.1; }
.sc-card__text em { font-family: 'EB Garamond', serif; font-size: 14px; color: var(--ink); }
.sc-card__badge { width: 52px; height: 52px; flex: none; object-fit: contain; }
.sc-card--quest { width: 300px; align-items: flex-start; gap: 14px; }
.sc-card--quest .sc-card__badge { width: 72px; height: 72px; margin: -6px 0 -6px -4px; }
.sc-card--quest .sc-card__text { flex: 1; }
.sc-quest__top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.sc-quest__count { font-size: 11px; font-weight: 700; color: var(--ink-mute); }
.sc-progress.sc-progress--done i { background: #2BB573; }
.sc-card__ginie { width: 50px; height: 50px; flex: none; object-fit: contain; }

.sc-dots { display: flex; gap: 6px; margin-top: 8px; }
.sc-dots i { width: 14px; height: 14px; border-radius: 50%; background: rgba(20, 25, 58, .08); }
.sc-dots i.on { background: #FF8A3D; }
.sc-dots i.today { background: transparent; box-shadow: inset 0 0 0 2px #FF8A3D; }

/* Same sticker chip as the app's QuestRewardPill, in its done state */
.sc-pill {
  flex: none;
  font-size: 12px;
  font-weight: 800;
  color: #111114;
  background: #B9E8AE;
  border: 2px solid #111114;
  box-shadow: 0 2px 0 #111114;
  padding: 3px 10px;
  border-radius: 999px;
}
.sc-card__cover {
  width: 48px;
  height: 72px;
  flex: none;
  object-fit: cover;
  border-radius: 6px;
  box-shadow: 0 6px 14px -6px rgba(20, 25, 58, .45);
}
.sc-progress { display: block; height: 6px; margin: 6px 0 2px; border-radius: 999px; background: rgba(20, 25, 58, .08); overflow: hidden; }
.sc-progress i { display: block; height: 100%; border-radius: inherit; background: var(--accent); }

/* Mascots peeking over a card's corner */
.sc-peek { position: absolute; width: 74px; height: auto; pointer-events: none; }
.sc-peek--heart { top: -38px; right: -24px; transform: rotate(14deg); }
.sc-peek--cupcake { bottom: -40px; left: -30px; transform: rotate(-12deg); }
.sc-peek--triangle { top: -42px; right: -18px; transform: rotate(10deg); }

/* Loose mascots */
.sc-mascot img { display: block; width: 100%; height: auto; }
.sc-mascot--clover { width: 96px; left: 13%; bottom: 4%; }
.sc-mascot--keycap { width: 84px; right: 10%; bottom: 10%; }
.sc-mascot--clover .sc-par { transform: translate3d(calc(var(--tx) * var(--d) * 1px), calc(var(--ty) * var(--d) * .7px), 0) rotate(-10deg); }
.sc-mascot--keycap .sc-par { transform: translate3d(calc(var(--tx) * var(--d) * 1px), calc(var(--ty) * var(--d) * .7px), 0) rotate(12deg); }

/* Card positions */
.sc-card-streak { left: 3%; top: 12%; }
.sc-card-quest { left: 7%; top: 54%; }
.sc-card-ginie { right: 2%; top: 9%; }
.sc-card-goal { right: 6%; top: 48%; }

/* Below this the sides are too narrow for cards; a couple of mascots keep the edges lively */
@media (max-width: 1180px) {
  .sc-card-streak, .sc-card-quest, .sc-card-ginie, .sc-card-goal { display: none; }
  .sc-mascot--clover { left: 4%; bottom: 10%; }
  .sc-mascot--keycap { right: 4%; bottom: auto; top: 14%; }
}
@media (max-width: 700px) {
  .sc-mascot--clover { width: 64px; left: 0; }
  .sc-mascot--keycap { width: 58px; right: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .sc-item { animation: none; }
  .sc-par { transition: none; }
}
</style>
