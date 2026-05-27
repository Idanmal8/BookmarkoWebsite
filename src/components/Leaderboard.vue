<template>
  <section class="lb" id="leaderboard">
    <header class="section-head" data-reveal>
      <span class="section-head__eyebrow">
        <span class="lb__new">New</span>
        Reading, with quiet stakes
      </span>
      <h2 class="section-head__title">Every page you turn earns its place on the shelf.</h2>
      <p class="section-head__sub">
        EXP for pages read. A gentle bonus when you close a finished book.
        A weekly leaderboard for the readers who keep showing up — no flames,
        no pressure, just a quiet record of the habit.
      </p>
    </header>

    <div class="lb__grid" data-reveal>
      <div class="lb__stage" aria-hidden="true" ref="stage">
        <div class="lb__card">
          <div class="lb__card-head">
            <span class="lb__trophy">🏆</span>
            <div>
              <div class="lb__card-title">This week's readers</div>
              <div class="lb__card-sub">Top of the shelf</div>
            </div>
          </div>

          <ul class="lb__list">
            <li class="lb__row lb__row--1">
              <span class="lb__rank">1</span>
              <span class="lb__name">Maya</span>
              <span class="lb__exp">3,240 EXP</span>
            </li>
            <li class="lb__row lb__row--2">
              <span class="lb__rank">2</span>
              <span class="lb__name">Daniel</span>
              <span class="lb__exp">2,815 EXP</span>
            </li>
            <li class="lb__row lb__row--3">
              <span class="lb__rank">3</span>
              <span class="lb__name">Noa</span>
              <span class="lb__exp">2,402 EXP</span>
            </li>
            <li class="lb__row">
              <span class="lb__rank">4</span>
              <span class="lb__name">Idan</span>
              <span class="lb__exp">1,978 EXP</span>
            </li>
            <li class="lb__row">
              <span class="lb__rank">5</span>
              <span class="lb__name">Sara</span>
              <span class="lb__exp">1,506 EXP</span>
            </li>
          </ul>

          <div class="lb__me">
            <span class="lb__rank lb__rank--me">#12</span>
            <span class="lb__name">You</span>
            <span class="lb__exp">842 EXP</span>
          </div>
        </div>
      </div>

      <div class="lb__copy">
        <ol class="lb__rules">
          <li>
            <span class="lb__rule-num">1×</span>
            <div>
              <div class="lb__rule-title">Every new page counts</div>
              <div class="lb__rule-body">
                Move past where you left off and each page earns full EXP.
                Forward progress is what the leaderboard rewards.
              </div>
            </div>
          </li>
          <li>
            <span class="lb__rule-num lb__rule-num--soft">¼×</span>
            <div>
              <div class="lb__rule-title">Re-reads count, gently</div>
              <div class="lb__rule-body">
                Restarting a book is a real thing readers do — you still earn,
                just at a quarter rate. We never take EXP back.
              </div>
            </div>
          </li>
          <li>
            <span class="lb__rule-num lb__rule-num--bonus">+50</span>
            <div>
              <div class="lb__rule-title">Finish the book, take the bow</div>
              <div class="lb__rule-body">
                Closing the cover on a finished book lands a flat bonus —
                because the last page deserves its own moment.
              </div>
            </div>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useReveal } from '@/composables/useReveal'

useReveal()

// The assembly animation is dramatic — fire it only when the user is
// actually looking at the card, not when its top edge first peeks in.
// Custom observer with a higher threshold (0.45) so ~half the card is
// on-screen before the rows start landing.
const stage = ref<HTMLElement | null>(null)
let io: IntersectionObserver | null = null

onMounted(() => {
  if (!('IntersectionObserver' in window) || !stage.value) {
    stage.value?.classList.add('is-assembled')
    return
  }
  io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-assembled')
          io?.unobserve(entry.target)
        }
      }
    },
    { threshold: 0.45 },
  )
  io.observe(stage.value)
})

onBeforeUnmount(() => {
  io?.disconnect()
  io = null
})
</script>

<style scoped>
.lb { padding: 130px 36px; background: transparent; }

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
.lb__new {
  display: inline-flex;
  align-items: center;
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: .16em;
  color: #fff;
  background: linear-gradient(135deg, var(--accent) 0%, var(--accent-deep) 100%);
  padding: 4px 9px;
  border-radius: 999px;
  box-shadow: 0 4px 12px -2px rgba(81,112,255,.45), 0 0 0 3px rgba(81,112,255,.12);
  animation: lbNewGlow 2.6s ease-in-out infinite;
}
@keyframes lbNewGlow {
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

.lb__grid {
  max-width: 1080px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: 56px;
  align-items: center;
}

.lb__copy { padding: 8px 0; }
.lb__rules {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.lb__rules li {
  display: flex;
  gap: 18px;
  align-items: flex-start;
}
.lb__rule-num {
  flex-shrink: 0;
  min-width: 52px;
  height: 36px;
  padding: 0 12px;
  border-radius: 18px;
  background: var(--accent-tint);
  color: var(--accent-deep);
  display: inline-flex; align-items: center; justify-content: center;
  font-family: 'EB Garamond', serif;
  font-weight: 600;
  font-size: 18px;
  letter-spacing: .01em;
}
.lb__rule-num--soft {
  background: rgba(165, 194, 244, .35);
  color: #4459b8;
}
.lb__rule-num--bonus {
  background: linear-gradient(135deg, #FFE9A8 0%, #FFD06B 100%);
  color: #6b4a14;
  box-shadow: 0 4px 12px -4px rgba(255, 188, 89, .55);
}
.lb__rule-title {
  font-family: 'EB Garamond', serif;
  font-weight: 600;
  font-size: 20px;
  color: var(--ink);
  margin-bottom: 4px;
  letter-spacing: -.01em;
}
.lb__rule-body {
  font-size: 14.5px;
  line-height: 1.55;
  color: var(--ink-soft);
}

/* Stage: mocked leaderboard card */
.lb__stage {
  position: relative;
  display: flex;
  justify-content: center;
}
.lb__card {
  width: 100%;
  max-width: 380px;
  background: #fff;
  border-radius: 24px;
  border: 1px solid var(--line);
  box-shadow: var(--shadow-warm);
  padding: 24px;
  position: relative;
  overflow: hidden;
}
.lb__card::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 80% -10%, rgba(255,244,214,.55) 0%, transparent 50%),
    radial-gradient(circle at -10% 110%, rgba(226,236,251,.6) 0%, transparent 55%);
  pointer-events: none;
  z-index: 0;
}
.lb__card > * { position: relative; z-index: 1; }

.lb__card-head {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
}
.lb__trophy {
  font-size: 32px;
  filter: drop-shadow(0 4px 10px rgba(255, 188, 89, .35));
}
.lb__card-title {
  font-family: 'EB Garamond', serif;
  font-weight: 600;
  font-size: 22px;
  color: var(--ink);
  letter-spacing: -.01em;
}
.lb__card-sub {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--ink-mute);
  margin-top: 2px;
}

.lb__list {
  list-style: none;
  padding: 0;
  margin: 0 0 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.lb__row {
  display: grid;
  grid-template-columns: 36px 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: var(--paper);
  border-radius: 14px;
  border: 1px solid var(--line-soft);

  /* Assembly animation: rows fly in from the left and settle into the card.
     Initial state — start far left, faded, slightly tilted.
     `.is-revealed` is set on the parent .lb__grid when the section scrolls
     into view (see useReveal composable). */
  opacity: 0;
  transform: translateX(-160px) rotate(-4deg);
  transition:
    opacity .55s ease-out,
    transform .7s cubic-bezier(.18, .89, .32, 1.18);
}
.lb__row:hover { transform: translateX(2px); }

/* The sticky "you" pill flies in from the right for contrast. */
.lb__me {
  opacity: 0;
  transform: translateX(160px);
  transition:
    opacity .55s ease-out,
    transform .7s cubic-bezier(.18, .89, .32, 1.18);
}

/* Staggered entry: each row lands after the previous one settles. */
.is-assembled .lb__row {
  opacity: 1;
  transform: translateX(0) rotate(0);
}
.is-assembled .lb__row:nth-child(1) { transition-delay: .05s; }
.is-assembled .lb__row:nth-child(2) { transition-delay: .18s; }
.is-assembled .lb__row:nth-child(3) { transition-delay: .31s; }
.is-assembled .lb__row:nth-child(4) { transition-delay: .44s; }
.is-assembled .lb__row:nth-child(5) { transition-delay: .57s; }
.is-assembled .lb__me {
  opacity: 1;
  transform: translateX(0);
  transition-delay: .75s;
}

/* The card itself gets a subtle scale-in so the rows feel like they're
   landing into something solid. */
.lb__card {
  transform: scale(.96);
  opacity: 0;
  transition:
    opacity .5s ease-out,
    transform .6s cubic-bezier(.18, .89, .32, 1.12);
}
.is-assembled .lb__card {
  opacity: 1;
  transform: scale(1);
}
.lb__rank {
  font-family: 'EB Garamond', serif;
  font-weight: 700;
  font-size: 18px;
  color: var(--accent-deep);
  text-align: center;
}
.lb__name {
  font-weight: 600;
  font-size: 15px;
  color: var(--ink);
}
.lb__exp {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: .04em;
  color: var(--ink-soft);
}

.lb__row--1, .lb__row--2, .lb__row--3 {
  border-color: rgba(255, 188, 89, .25);
}
.lb__row--1 .lb__rank { color: #b87a14; }
.lb__row--1 {
  background: linear-gradient(135deg, #FFF6E0 0%, #FFEAB0 100%);
  border-color: rgba(255, 188, 89, .45);
}
.lb__row--2 .lb__rank { color: #6f7681; }
.lb__row--2 {
  background: linear-gradient(135deg, #F4F5F8 0%, #DDE2EA 100%);
}
.lb__row--3 .lb__rank { color: #9b6240; }
.lb__row--3 {
  background: linear-gradient(135deg, #FAEDDD 0%, #F0D5B6 100%);
}

.lb__me {
  display: grid;
  grid-template-columns: 36px 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 14px 14px;
  background: linear-gradient(135deg, var(--accent) 0%, var(--accent-deep) 100%);
  border-radius: 14px;
  color: #fff;
  box-shadow: 0 14px 30px -16px rgba(81,112,255,.55);
}
.lb__me .lb__rank--me {
  color: #fff;
  font-size: 16px;
}
.lb__me .lb__name { color: #fff; }
.lb__me .lb__exp { color: rgba(255,255,255,.85); }

@media (max-width: 860px) {
  .lb__grid {
    grid-template-columns: 1fr;
    gap: 36px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .lb__new { animation: none; }
  .lb__row,
  .lb__me,
  .lb__card {
    transition: none;
    transform: none;
    opacity: 1;
  }
}
</style>
