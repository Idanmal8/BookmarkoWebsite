<template>
  <section class="now" id="now-reading">
    <header class="section-head" data-reveal>
      <span class="section-head__eyebrow">Currently on the shelf</span>
      <h2 class="section-head__title">Pick a spine. Pull it out.</h2>
      <p class="section-head__sub">
        This is what an evening on Bookmarko looks like — a real bookshelf,
        held lightly. Hover. Click. Read what's behind a cover that caught your eye.
      </p>
    </header>

    <div class="now__shelf-wrap" data-reveal>
      <div class="now__shelf">
        <button
          v-for="b in books"
          :key="b.id"
          :class="['now__book', { 'now__book--active': active === b.id }]"
          :style="{
            background: b.color,
            height: `${b.height}%`,
            width: `${b.width}px`,
            color: isLight(b.color) ? 'rgba(40,30,20,.7)' : 'rgba(255,255,255,.85)',
          }"
          :aria-label="`${b.title} — ${b.author}`"
          @mouseenter="active = b.id"
          @focus="active = b.id"
          @click="active = b.id"
        >
          <span class="now__book-title">{{ b.title }}</span>
          <span class="now__book-author">{{ b.author }}</span>
        </button>
      </div>
      <div class="now__plank" />
      <div class="now__plank-shadow" />
    </div>

    <div class="now__card" data-reveal v-if="selected">
      <div class="now__card-cover" :style="{ background: selected.color }">
        <div class="now__card-cover-title">{{ selected.title }}</div>
        <div class="now__card-cover-author">{{ selected.author }}</div>
      </div>
      <div class="now__card-body">
        <div class="now__card-eyebrow">From your shelf</div>
        <h3 class="now__card-title">{{ selected.title }}</h3>
        <div class="now__card-author">by {{ selected.author }}</div>
        <p class="now__card-note">{{ selected.note }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useReveal } from '@/composables/useReveal'

useReveal()

const books = [
  { id: 'gatsby', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', color: '#6B2737', height: 92, width: 30, note: 'A green light, a yellow car, a borrowed dream — every page glitters with longing.' },
  { id: '1984', title: '1984', author: 'George Orwell', color: '#1F2E54', height: 82, width: 24, note: 'Quiet, slow-burning, and uncomfortably relevant the second time around.' },
  { id: 'austen', title: 'Pride and Prejudice', author: 'Jane Austen', color: '#C4933D', height: 90, width: 30, note: 'Wit, long walks, and the slow defrost of two stubborn hearts.' },
  { id: 'mockingbird', title: 'To Kill a Mockingbird', author: 'Harper Lee', color: '#2F5D44', height: 94, width: 34, note: 'A summer in Maycomb. A father quietly at the centre of it.' },
  { id: 'hobbit', title: 'The Hobbit', author: 'J. R. R. Tolkien', color: '#A04A2C', height: 86, width: 28, note: 'A small door, a long road, eleven nights by the fire.' },
  { id: 'beloved', title: 'Beloved', author: 'Toni Morrison', color: '#4E342E', height: 84, width: 26, note: 'Memory as a haunting. Morrison at her most luminous.' },
  { id: 'norwegian', title: 'Norwegian Wood', author: 'Haruki Murakami', color: '#7E9982', height: 82, width: 30, note: 'A Tokyo autumn. Quiet rooms. Songs you half-remember.' },
  { id: 'stranger', title: 'The Stranger', author: 'Albert Camus', color: '#E8DCC4', height: 78, width: 26, note: 'Sunlight, salt, and a man who refuses to perform.' },
  { id: 'crime', title: 'Crime and Punishment', author: 'F. Dostoyevsky', color: '#264653', height: 94, width: 34, note: "A long, feverish walk through one man's conscience." },
  { id: 'alchemist', title: 'The Alchemist', author: 'Paulo Coelho', color: '#B47B7B', height: 82, width: 28, note: 'A boy, a desert, a treasure that is never quite the treasure.' },
]

const active = ref('austen')
const selected = computed(() => books.find((b) => b.id === active.value))
const isLight = (c: string) => ['#E8DCC4', '#D9B382', '#C4933D'].includes(c)
</script>

<style scoped>
.now { padding: 130px 36px; background: transparent; }
.section-head {
  max-width: 720px;
  margin: 0 auto 64px;
  text-align: center;
}
.section-head__eyebrow {
  display: inline-block;
  font-size: 12px; font-weight: 700;
  letter-spacing: .14em;
  text-transform: uppercase;
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
.section-head__sub {
  margin: 18px auto 0;
  font-size: 17px;
  line-height: 1.6;
  color: var(--ink-soft);
  max-width: 560px;
}

.now__shelf-wrap {
  max-width: 980px;
  margin: 56px auto 0;
  position: relative;
}
.now__shelf {
  display: flex; align-items: flex-end; justify-content: center;
  gap: 3px;
  height: 240px;
  padding: 0 20px;
}
.now__book {
  position: relative;
  border: 0;
  border-radius: 2px 2px 0 0;
  padding: 14px 4px 18px;
  cursor: pointer;
  box-shadow:
    inset 1.5px 0 0 rgba(255,255,255,.18),
    inset -2px 0 0 rgba(0,0,0,.22),
    inset 0 1.5px 0 rgba(255,255,255,.12);
  transition: transform .35s cubic-bezier(.2,.7,.3,1.4);
  display: flex; flex-direction: column; align-items: center; justify-content: space-between;
  font: inherit;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  overflow: hidden;
}
.now__book::before,
.now__book::after {
  content: "";
  position: absolute;
  left: 4px; right: 4px;
  height: 1.5px;
  background: currentColor;
  opacity: .35;
  pointer-events: none;
}
.now__book::before { top: 8px; }
.now__book::after  { bottom: 8px; }
.now__book:hover, .now__book:focus, .now__book--active {
  transform: translateY(-22px);
  outline: none;
}
.now__book-title {
  font-family: 'EB Garamond', serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: .015em;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  max-height: 170px;
  line-height: 1;
}
.now__book-author {
  font-size: 9px;
  font-weight: 600;
  letter-spacing: .08em;
  text-transform: uppercase;
  opacity: .65;
  white-space: nowrap;
  overflow: hidden;
  max-height: 80px;
  line-height: 1;
}
.now__plank {
  height: 16px;
  background: #FFFFFF;
  border-radius: 2px;
  box-shadow:
    0 1px 0 rgba(255,255,255,.6) inset,
    0 -1px 0 rgba(20,25,58,.08) inset,
    0 6px 14px rgba(20,25,58,.1);
}
.now__plank-shadow {
  height: 24px;
  margin: 0 40px;
  background: radial-gradient(ellipse at center top, rgba(20,25,58,.12), transparent 70%);
}

.now__card {
  max-width: 720px;
  margin: 56px auto 0;
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 28px;
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 22px;
  overflow: hidden;
  box-shadow: var(--shadow-warm);
  transition: opacity .4s;
}
.now__card-cover {
  padding: 28px 20px;
  display: flex; flex-direction: column; justify-content: space-between;
  color: rgba(255,255,255,.9);
  min-height: 200px;
  position: relative;
}
.now__card-cover::after {
  content: "";
  position: absolute; left: 0; top: 0; bottom: 0;
  width: 4px;
  background: rgba(0,0,0,.18);
}
.now__card-cover-title {
  font-family: 'EB Garamond', serif;
  font-size: 22px;
  font-weight: 500;
  line-height: 1.1;
}
.now__card-cover-author {
  font-size: 11px;
  letter-spacing: .08em;
  text-transform: uppercase;
  opacity: .8;
}
.now__card-body { padding: 28px 32px 28px 0; }
.now__card-eyebrow {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 10px;
}
.now__card-title {
  font-family: 'EB Garamond', serif;
  font-weight: 500;
  font-size: 28px;
  line-height: 1.1;
  letter-spacing: -.01em;
  color: var(--ink);
  margin-bottom: 4px;
}
.now__card-author {
  font-size: 13px;
  color: var(--ink-mute);
  letter-spacing: .02em;
  margin-bottom: 14px;
}
.now__card-note {
  font-family: 'EB Garamond', serif;
  font-style: italic;
  font-size: 17px;
  line-height: 1.5;
  color: var(--ink-soft);
  margin-bottom: 22px;
}
.now__card-actions { display: flex; gap: 10px; flex-wrap: wrap; }
.now__card-cta {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--ink);
  color: var(--paper);
  border: 0;
  padding: 10px 18px;
  font: inherit; font-size: 14px; font-weight: 600;
  border-radius: 999px;
  cursor: pointer;
  transition: background .2s, transform .2s;
}
.now__card-cta:hover { background: var(--accent); transform: translateY(-1px); }
.now__card-secondary {
  background: transparent;
  border: 1px solid var(--line);
  padding: 10px 18px;
  font: inherit; font-size: 14px; font-weight: 600;
  color: var(--ink-soft);
  border-radius: 999px;
  cursor: pointer;
  transition: background .2s, color .2s;
}
.now__card-secondary:hover { background: rgba(40,30,20,.04); color: var(--ink); }

@media (max-width: 720px) {
  .now__card { grid-template-columns: 1fr; }
  .now__card-body { padding: 0 28px 28px; }
  .now__book { padding: 12px 3px 14px; }
}
</style>
