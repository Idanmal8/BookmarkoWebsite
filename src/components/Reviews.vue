<template>
  <section class="rv" id="reviews">
    <header class="section-head" data-reveal>
      <span class="section-head__eyebrow">Reviews from Google Play</span>
      <h2 class="section-head__title">Readers <em>said it first.</em></h2>
      <p class="section-head__sub">
        What people wrote after moving their books in.
      </p>
    </header>

    <!-- The reviews burst out of the middle once the section is in view. -->
    <div class="rv-stage" data-reveal>
      <span class="rv-sparks" aria-hidden="true">
        <i v-for="(s, i) in SPARKS" :key="i" :style="s" />
      </span>

      <div class="rv-medal">
        <span class="rv-medal__stars" aria-hidden="true">
          <img v-for="n in 5" :key="n" :src="star" alt="" :style="{ '--n': n }" />
        </span>
        <b>Five stars</b>
        <span>every one of these</span>
      </div>

      <figure
        v-for="(r, i) in REVIEWS"
        :key="r.name"
        class="rv-card"
        :class="{ 'rv-card--emoji': r.emoji }"
        :style="{ '--x': r.x, '--y': r.y, '--r': `${r.tilt}deg`, '--w': `${r.width}px`, '--d': `${i * 70 + 120}ms`, '--f': `${5.2 + (i % 4) * 0.7}s` }"
      >
        <div class="rv-card__in">
          <span class="rv-stars" role="img" aria-label="5 out of 5 stars">
            <svg v-for="n in 5" :key="n" width="15" height="15" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.7 5.6 6.1.8a.6.6 0 0 1 .3 1l-4.4 4.2 1.1 6.1a.6.6 0 0 1-.9.6L12 18.2l-5.4 2.9a.6.6 0 0 1-.9-.6l1.1-6.1L2.4 10.2a.6.6 0 0 1 .3-1l6.1-.8z" fill="currentColor" /></svg>
          </span>
          <blockquote>{{ r.text }}</blockquote>
          <figcaption>
            <span class="rv-avatar" :style="{ background: r.tint, color: r.ink }" aria-hidden="true">{{ r.name[0] }}</span>
            <span><b>{{ r.name }}</b><span>Google Play</span></span>
          </figcaption>
        </div>
      </figure>
    </div>

    <p class="rv-note" data-reveal>
      Real reviews from Google Play, translated into English where they were written in another language.
      Names are changed to protect readers' privacy.
    </p>
  </section>
</template>

<script setup lang="ts">
import { useReveal } from '@/composables/useReveal'
import star from '@/assets/reading-path/star_m.svg'

useReveal()

// Reviews readers left on Google Play (the Play Console, read 2026-11-19), all
// five stars. Shown in English: the Hebrew and Russian ones are translated, and
// one is an excerpt (marked with …). The names are made up on purpose: the
// owner does not want readers named on the site. Never put a real name here.
//
// x, y: where the card's middle lands in the scattered layout, across and down
// the stage. Placed by hand so nothing overlaps at 1100 x 760.
const REVIEWS: { name: string; text: string; emoji?: boolean; x: string; y: string; tilt: number; width: number; tint: string; ink: string }[] = [
  {
    name: 'Noa',
    text: 'This app completely changed my reading routine! The interface is clean, beautiful and very easy to navigate. It keeps me motivated to read consistently every day. The reading experience is smooth and distraction-free. A must-have for any book lover.',
    x: '19.5%', y: '25%', tilt: -3, width: 380, tint: '#E2ECFB', ink: '#3D59E6',
  },
  {
    name: 'Jonah',
    text: 'Excellent app! Exactly what I needed to bring order to the mess of my books. It looks great and runs smoothly. Recommended!',
    x: '80%', y: '21%', tilt: 3, width: 340, tint: '#FFE6EF', ink: '#E0336F',
  },
  {
    name: 'Mila',
    text: 'Excellent app! … A user-friendly, intuitive interface … Everything works smoothly and without glitches. I definitely recommend it! ⭐⭐⭐⭐⭐',
    x: '21%', y: '81%', tilt: 2.5, width: 340, tint: '#DDF5E6', ink: '#1E7A4A',
  },
  {
    name: 'Omer',
    text: 'Amazing app!!! Everyone needs it.',
    x: '79.5%', y: '79%', tilt: -2.5, width: 320, tint: '#FFF0C9', ink: '#9A6A00',
  },
  {
    name: 'Tamar',
    text: 'Wonderful app!',
    x: '50%', y: '10.5%', tilt: 2, width: 220, tint: '#EDE4FB', ink: '#6B3FC4',
  },
  {
    name: 'Leo',
    text: 'Good app 👍👍',
    x: '50%', y: '89.5%', tilt: -2, width: 220, tint: '#E2ECFB', ink: '#3D59E6',
  },
  {
    name: 'Dana',
    text: '💯💯💯',
    emoji: true,
    x: '10.5%', y: '56%', tilt: 5, width: 190, tint: '#FFE6EF', ink: '#E0336F',
  },
  {
    name: 'Yael',
    text: '👌👌👌👌',
    emoji: true,
    x: '89%', y: '51%', tilt: -5, width: 200, tint: '#DDF5E6', ink: '#1E7A4A',
  },
]

// Little gold stars thrown out from the middle with the cards.
const SPARKS = Array.from({ length: 14 }, (_, i) => {
  const turn = (i / 14) * Math.PI * 2 + (i % 2 ? 0.2 : -0.15)
  const far = 250 + (i % 3) * 90
  return {
    '--sx': `${Math.round(Math.cos(turn) * far * 1.5)}px`,
    '--sy': `${Math.round(Math.sin(turn) * far * 0.9)}px`,
    '--ss': `${10 + (i % 4) * 5}px`,
    '--sd': `${(i % 5) * 45}ms`,
  }
})
</script>

<style scoped>
.rv { padding: 130px 36px; background: transparent; overflow: hidden; }

.section-head { max-width: 760px; margin: 0 auto 36px; text-align: center; }
.section-head__eyebrow {
  display: inline-block;
  font-size: 12px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 16px;
}
.section-head__title {
  font-family: 'EB Garamond', serif;
  font-weight: 500;
  font-size: clamp(34px, 4.4vw, 54px);
  line-height: 1.05;
  letter-spacing: -.015em;
  color: var(--ink);
  text-wrap: balance;
}
.section-head__title em { font-style: italic; font-weight: 400; }
.section-head__sub { margin: 18px auto 0; font-size: 17px; line-height: 1.6; color: var(--ink-soft); max-width: 560px; }

/* ---------- The burst ---------- */
.rv-stage { position: relative; max-width: 1100px; height: 760px; margin: 0 auto; }

.rv-medal {
  position: absolute; left: 50%; top: 49%;
  width: 216px; height: 216px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;
  background: #fff;
  border: 1px solid var(--line-soft);
  box-shadow: 0 0 0 14px rgba(255, 179, 206, .22), 0 0 0 30px rgba(165, 194, 244, .16), 0 30px 60px -30px rgba(81, 112, 255, .45);
  text-align: center;
  z-index: 2;
}
.rv-medal b { font-family: 'EB Garamond', serif; font-size: 32px; font-weight: 600; line-height: 1.05; color: var(--ink); }
.rv-medal > span:last-child { font-size: 13px; font-weight: 600; color: var(--ink-mute); }
.rv-medal__stars { display: flex; margin-bottom: 6px; }
.rv-medal__stars img { width: 34px; height: 34px; margin: 0 -3px; transform: scale(0); }
.rv-stage.is-revealed .rv-medal__stars img { animation: rvStar .5s cubic-bezier(.3, 1.8, .5, 1) both; animation-delay: calc(var(--n) * 90ms + 250ms); }
@keyframes rvStar { from { transform: scale(0) rotate(-40deg); } to { transform: scale(1) rotate(0); } }

.rv-card {
  position: absolute;
  left: 50%; top: 49%;
  width: var(--w);
  opacity: 0;
  transform: translate(-50%, -50%) rotate(0deg) scale(.2);
  transition:
    left .95s cubic-bezier(.2, 1.25, .35, 1) var(--d),
    top .95s cubic-bezier(.2, 1.25, .35, 1) var(--d),
    transform .95s cubic-bezier(.2, 1.25, .35, 1) var(--d),
    opacity .3s ease var(--d);
  z-index: 1;
}
.rv-stage.is-revealed .rv-card {
  left: var(--x); top: var(--y);
  opacity: 1;
  transform: translate(-50%, -50%) rotate(var(--r)) scale(1);
}
.rv-card:hover { z-index: 3; }
.rv-card__in {
  padding: 20px 22px;
  border-radius: 24px;
  background: #fff;
  border: 1px solid var(--line-soft);
  box-shadow: 0 30px 60px -36px rgba(81, 112, 255, .4), 0 10px 26px -18px rgba(20, 25, 58, .2);
  animation: rvFloat var(--f) ease-in-out infinite;
  transition: transform .25s;
}
@keyframes rvFloat { 0%, 100% { translate: 0 0; } 50% { translate: 0 -6px; } }
.rv-card:hover .rv-card__in { transform: scale(1.03); }

.rv-stars { display: flex; gap: 1px; color: #FFC02E; }
.rv-card blockquote { margin: 10px 0 14px; font-size: 16px; line-height: 1.5; color: var(--ink); }
.rv-card--emoji .rv-card__in { padding: 16px 18px; }
.rv-card--emoji blockquote { font-size: 30px; line-height: 1.2; letter-spacing: .04em; margin: 8px 0 10px; }
.rv-card figcaption { display: flex; align-items: center; gap: 10px; }
.rv-card figcaption > span:last-child { display: flex; flex-direction: column; font-size: 12px; color: var(--ink-mute); line-height: 1.3; }
.rv-card figcaption b { font-size: 14px; color: var(--ink); }
.rv-avatar {
  width: 34px; height: 34px; flex: none;
  border-radius: 50%;
  display: grid; place-items: center;
  font-family: 'EB Garamond', serif; font-size: 18px; font-weight: 600;
}

.rv-sparks { position: absolute; left: 50%; top: 49%; width: 0; height: 0; }
.rv-sparks i {
  position: absolute;
  left: calc(var(--ss) / -2); top: calc(var(--ss) / -2);
  width: var(--ss); height: var(--ss);
  background: #FFC02E;
  clip-path: polygon(50% 0, 62% 36%, 100% 38%, 70% 60%, 80% 100%, 50% 76%, 20% 100%, 30% 60%, 0 38%, 38% 36%);
  opacity: 0;
}
.rv-stage.is-revealed .rv-sparks i { animation: rvSpark 1.3s cubic-bezier(.15, .8, .3, 1) var(--sd) both; }
@keyframes rvSpark {
  0%   { opacity: 0; transform: translate(0, 0) scale(.3) rotate(0); }
  15%  { opacity: 1; }
  100% { opacity: 0; transform: translate(var(--sx), var(--sy)) scale(1) rotate(160deg); }
}

.rv-note { max-width: 620px; margin: 30px auto 0; text-align: center; font-size: 13.5px; line-height: 1.55; color: var(--ink-mute); }

/* Narrower than the scattered layout needs: the cards stand in rows. */
@media (max-width: 1100px) {
  .rv-stage { height: auto; max-width: 760px; display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 18px; }
  .rv-medal { position: relative; left: auto; top: auto; transform: none; flex: none; margin: 30px 100% 34px; margin-inline: calc(50% - 108px); }
  .rv-card, .rv-stage.is-revealed .rv-card { position: relative; left: auto; top: auto; width: min(100%, var(--w)); }
  .rv-card { transform: translateY(26px) scale(.86); transition: transform .7s cubic-bezier(.2, 1.25, .35, 1) var(--d), opacity .3s ease var(--d); }
  .rv-stage.is-revealed .rv-card { transform: rotate(calc(var(--r) * .6)); }
  .rv-sparks { top: 140px; }
}
@media (max-width: 720px) {
  .rv { padding: 100px 18px; }
}
@media (prefers-reduced-motion: reduce) {
  .rv-card { transition: none; }
  .rv-card__in { animation: none; }
  .rv-stage.is-revealed .rv-medal__stars img { animation: none; transform: none; }
  .rv-sparks { display: none; }
}
</style>
