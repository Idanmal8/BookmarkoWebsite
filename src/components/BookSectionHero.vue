<template>
  <section class="bsh" id="endless-shelf">
    <header class="bsh__head" data-reveal>
      <span class="bsh__eyebrow">An endless shelf</span>
      <h2 class="bsh__title">
        Of every book you've ever loved.
      </h2>
    </header>

    <div class="bsh__stage" aria-hidden="true">
      <div class="bsh__glow" />
      <div class="bsh__lane">
        <div class="bsh__track">
          <figure v-for="(b, i) in topRow" :key="'t' + i" class="bsh__cover">
            <img :src="b.src" :alt="''" loading="lazy" />
          </figure>
        </div>
      </div>
      <div class="bsh__lane">
        <div class="bsh__track bsh__track--reverse">
          <figure v-for="(b, i) in botRow" :key="'b' + i" class="bsh__cover">
            <img :src="b.src" :alt="''" loading="lazy" />
          </figure>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useReveal } from '@/composables/useReveal'
import acourt from '@/assets/Books/ACourt.jpg'
import deadDebbie from '@/assets/Books/DeadDebbie.jpg'
import direBound from '@/assets/Books/DireBound.jpg'
import dungeon from '@/assets/Books/Dungeon.jpg'
import heart from '@/assets/Books/Heart.jpg'
import heated from '@/assets/Books/Heated.jpg'
import houseMain from '@/assets/Books/HouseMain.jpg'
import inHerOwnZone from '@/assets/Books/InHerOwnZone.jpg'
import onyxStorm from '@/assets/Books/OnyxStorm.jpg'
import phm from '@/assets/Books/PHM.jpg'
import redRising from '@/assets/Books/RedRising.jpg'
import strangePictures from '@/assets/Books/StrangePictures.jpg'
import tatat from '@/assets/Books/TATAT.jpg'
import weddingPeople from '@/assets/Books/TWeddingPepole.jpg'
import deal from '@/assets/Books/TheDeal.jpg'
import yesteryear from '@/assets/Books/Yesteryear.jpg'

useReveal()

type Cover = { src: string }

// Interleave so neighbours in the same row never repeat and the two
// rows show different books at any given moment.
const topCovers = [phm, redRising, heart, houseMain, onyxStorm, strangePictures, dungeon, direBound]
const botCovers = [deal, acourt, heated, inHerOwnZone, yesteryear, deadDebbie, tatat, weddingPeople]

function makeRow(list: string[]): Cover[] {
  const row = list.map((src) => ({ src }))
  return [...row, ...row]
}

const topRow = makeRow(topCovers)
const botRow = makeRow(botCovers)
</script>

<style scoped>
.bsh {
  position: relative;
  padding: 120px 24px 60px;
  overflow: hidden;
}

.bsh__head {
  max-width: 760px;
  margin: 0 auto 64px;
  text-align: center;
}
.bsh__eyebrow {
  display: inline-block;
  font-size: 12px; font-weight: 700;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 16px;
}
.bsh__title {
  font-family: 'EB Garamond', serif;
  font-weight: 500;
  font-size: clamp(34px, 4.4vw, 54px);
  line-height: 1.05;
  letter-spacing: -.015em;
  color: var(--ink);
  text-wrap: balance;
  margin-bottom: 18px;
}
.bsh__sub {
  font-size: 16px;
  line-height: 1.65;
  color: var(--ink-soft);
  max-width: 560px;
  margin: 0 auto;
  text-wrap: balance;
}

.bsh__stage {
  position: relative;
  padding: 56px 0 36px;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 14%, #000 86%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 14%, #000 86%, transparent);
}

.bsh__glow {
  position: absolute;
  inset: 8% 18%;
  background: radial-gradient(ellipse at center,
    rgba(81,112,255,.22) 0%,
    rgba(81,112,255,.08) 35%,
    transparent 70%);
  filter: blur(50px);
  pointer-events: none;
  z-index: 0;
}

.bsh__lane {
  position: relative;
  z-index: 1;
  display: flex;
  margin: 28px 0;
  overflow: hidden;
}

.bsh__track {
  display: flex;
  width: max-content;
  animation: bshScroll 60s linear infinite;
  will-change: transform;
}
.bsh__track--reverse {
  animation-direction: reverse;
  animation-duration: 72s;
}

@keyframes bshScroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

/* margin-right on every cover (last one too) so the duplicated track
   has a perfectly uniform pitch — translateX(-50%) lands exactly on the
   start of the second copy with no seam. */
.bsh__cover {
  flex: 0 0 auto;
  width: 168px;
  margin-right: 28px;
  aspect-ratio: 2 / 3;
  border-radius: 8px;
  overflow: hidden;
  background: var(--paper-deep);
  box-shadow:
    0 1px 2px rgba(20,25,58,.18),
    0 8px 18px -8px rgba(20,25,58,.28),
    0 28px 48px -22px rgba(20,25,58,.42),
    inset 1.5px 0 0 rgba(255,255,255,.22),
    inset -1.5px 0 0 rgba(0,0,0,.22);
  transition: transform .5s ease;
}
.bsh__cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

@media (max-width: 720px) {
  .bsh { padding: 90px 16px 40px; }
  .bsh__cover { width: 112px; margin-right: 18px; }
  .bsh__lane { margin: 18px 0; }
}

@media (prefers-reduced-motion: reduce) {
  .bsh__track { animation: none; }
}
</style>
