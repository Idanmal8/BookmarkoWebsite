<template>
  <section class="gr" id="goodreads">
    <header class="section-head" data-reveal>
      <span class="section-head__eyebrow">
        <span class="gr__new">New</span>
        Bring your shelves with you
      </span>
      <h2 class="section-head__title">Pour your Goodreads library straight onto your Bookmarko shelf.</h2>
      <p class="section-head__sub">
        Export the CSV from Goodreads, drop it into Bookmarko, and watch every
        book — read, currently-reading, want-to-read — land softly where it belongs.
      </p>
    </header>

    <div class="gr__grid" data-reveal>
      <div class="gr__copy">
        <ol class="gr__steps">
          <li>
            <span class="gr__step-num">1</span>
            <div>
              <div class="gr__step-title">Export from Goodreads</div>
              <div class="gr__step-body">My Books → Import and export → Export Library. You'll get a CSV.</div>
            </div>
          </li>
          <li>
            <span class="gr__step-num">2</span>
            <div>
              <div class="gr__step-title">Drop it into Bookmarko</div>
              <div class="gr__step-body">Profile → Import from Goodreads. Pick the file. We'll do the rest.</div>
            </div>
          </li>
          <li>
            <span class="gr__step-num">3</span>
            <div>
              <div class="gr__step-title">Your shelves, intact</div>
              <div class="gr__step-body">Read, reading, want-to-read — all sorted, covers fetched, ratings kept.</div>
            </div>
          </li>
        </ol>
      </div>

      <div class="gr__stage" aria-hidden="true">
        <svg class="gr__path" viewBox="0 0 360 320" preserveAspectRatio="none">
          <path
            d="M 80 200 C 140 100, 180 260, 170 150 S 200 70, 280 60"
            fill="none"
            stroke="var(--accent)"
            stroke-width="2.2"
            stroke-linecap="round"
            stroke-dasharray="2 8"
            class="gr__path-line"
          />
        </svg>

        <figure class="gr__chip gr__chip--good">
          <img src="/src/assets/goodL.png" alt="Goodreads" />
          <figcaption>Goodreads</figcaption>
        </figure>

        <figure class="gr__chip gr__chip--book">
          <img src="/src/assets/bookL.png" alt="Bookmarko" />
          <figcaption>Bookmarko</figcaption>
        </figure>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useReveal } from '@/composables/useReveal'
useReveal()
</script>

<style scoped>
.gr { padding: 130px 36px; background: transparent; }

.section-head {
  max-width: 760px;
  margin: 0 auto 64px;
  text-align: center;
}
.section-head__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 12px; font-weight: 700;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 16px;
}
.gr__new {
  display: inline-flex;
  align-items: center;
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: .16em;
  color: #fff;
  background: linear-gradient(135deg, var(--accent) 0%, var(--accent-deep) 100%);
  padding: 4px 9px 4px 9px;
  border-radius: 999px;
  box-shadow: 0 4px 12px -2px rgba(81,112,255,.45), 0 0 0 3px rgba(81,112,255,.12);
  position: relative;
  animation: grNewGlow 2.6s ease-in-out infinite;
}
@keyframes grNewGlow {
  0%, 100% { box-shadow: 0 4px 12px -2px rgba(81,112,255,.45), 0 0 0 3px rgba(81,112,255,.12); }
  50%      { box-shadow: 0 6px 16px -2px rgba(81,112,255,.55), 0 0 0 6px rgba(81,112,255,.06); }
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
.section-head__sub {
  margin: 18px auto 0;
  font-size: 17px;
  line-height: 1.6;
  color: var(--ink-soft);
  max-width: 560px;
}

.gr__grid {
  max-width: 1080px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: 56px;
  align-items: center;
}

.gr__copy { padding: 8px 0; }
.gr__steps {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 22px;
}
.gr__steps li {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}
.gr__step-num {
  flex-shrink: 0;
  width: 32px; height: 32px;
  border-radius: 50%;
  background: var(--accent-tint);
  color: var(--accent-deep);
  display: flex; align-items: center; justify-content: center;
  font-family: 'EB Garamond', serif;
  font-weight: 600;
  font-size: 17px;
}
.gr__step-title {
  font-family: 'EB Garamond', serif;
  font-weight: 600;
  font-size: 20px;
  color: var(--ink);
  margin-bottom: 4px;
  letter-spacing: -.01em;
}
.gr__step-body {
  font-size: 14.5px;
  line-height: 1.55;
  color: var(--ink-soft);
}

/* Stage with floating logos + dotted path */
.gr__stage {
  position: relative;
  height: 360px;
  background:
    radial-gradient(circle at 30% 80%, rgba(226,236,251,.7) 0%, transparent 55%),
    radial-gradient(circle at 75% 25%, rgba(255,244,214,.55) 0%, transparent 50%);
  border-radius: 28px;
  overflow: hidden;
}
.gr__path {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}
.gr__path-line {
  animation: grDash 14s linear infinite;
}
@keyframes grDash {
  to { stroke-dashoffset: -200; }
}

.gr__chip {
  position: absolute;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  z-index: 2;
}
.gr__chip img {
  width: 112px;
  height: 112px;
  object-fit: cover;
  border-radius: 22px;
  background: #fff;
  box-shadow:
    0 1px 0 rgba(255,255,255,.7) inset,
    0 20px 40px -18px rgba(20,25,58,.35),
    0 8px 20px -10px rgba(20,25,58,.18);
  border: 1px solid var(--line);
}
.gr__chip figcaption {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--ink-mute);
}

.gr__chip--good {
  left: 8%;
  bottom: 14%;
  animation: grFloatA 6s ease-in-out infinite;
}
.gr__chip--book {
  right: 10%;
  top: 8%;
  animation: grFloatB 7s ease-in-out infinite;
}
.gr__chip--good img {
  background: linear-gradient(135deg, #EEF3FF 0%, #DDE8FB 100%);
}

@keyframes grFloatA {
  0%, 100% { transform: translateY(0) rotate(-2deg); }
  50%      { transform: translateY(-14px) rotate(-2deg); }
}
@keyframes grFloatB {
  0%, 100% { transform: translateY(0) rotate(3deg); }
  50%      { transform: translateY(-12px) rotate(3deg); }
}

@media (max-width: 860px) {
  .gr__grid {
    grid-template-columns: 1fr;
    gap: 36px;
  }
  .gr__stage {
    height: 300px;
    order: -1;
  }
  .gr__chip img { width: 92px; height: 92px; }
}

@media (prefers-reduced-motion: reduce) {
  .gr__chip--good,
  .gr__chip--book,
  .gr__path-line,
  .gr__new { animation: none; }
}
</style>
