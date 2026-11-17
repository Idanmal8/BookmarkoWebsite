<template>
  <!-- Idan's Amazon picks (`/idan/picks`). Content lives in `src/data/picks.ts`. -->
  <div class="pk">
    <LinkBackdrop />

    <div class="col">
      <nav class="top">
        <a class="back" href="/idan">← Idan's links</a>
      </nav>

      <header class="head">
        <img class="avatar" :src="profile.avatar" width="72" height="72" alt="" />
        <img class="sticker" :src="cupcake" alt="" aria-hidden="true" />
        <h1 class="title">My Amazon picks</h1>
        <p class="sub">The books I loved and keep recommending. Tap a cover to see it on Amazon.</p>
        <!-- Required by the Amazon Associates Operating Agreement: clear and near the links. -->
        <p class="disclosure">As an Amazon Associate I earn from qualifying purchases.</p>
      </header>

      <div class="filters">
        <input
          id="picks-search"
          v-model="query"
          class="search"
          type="search"
          placeholder="Search title or author"
          aria-label="Search title or author"
        />
        <div class="chips" role="group" aria-label="Filter by genre">
          <button
            v-for="g in genreList"
            :key="g.name"
            type="button"
            class="chip"
            :aria-pressed="g.name === activeGenre"
            @click="selectGenre(g.name)"
          >
            {{ g.name }}<span class="chip-count">{{ g.count }}</span>
          </button>
        </div>
      </div>

      <p v-if="!visibleShelves.length" class="empty">
        No books match.
        <button type="button" class="reset" @click="resetFilters">Show all</button>
      </p>

      <section v-for="shelf in visibleShelves" :key="shelf.id" class="shelf" :aria-labelledby="`shelf-${shelf.id}`">
        <h2 :id="`shelf-${shelf.id}`" class="shelf-title">{{ shelf.title }}</h2>
        <p v-if="shelf.subtitle" class="shelf-sub">{{ shelf.subtitle }}</p>

        <ul class="rack">
          <li v-for="pick in shelf.picks" :key="pick.asin" class="pick">
            <a
              :href="amazonUrl(pick.asin)"
              target="_blank"
              rel="sponsored noopener"
              @click="track(pick, shelf.id)"
            >
              <span class="cover">
                <img :src="`/links/covers/${pick.cover}`" width="128" height="192" :alt="`${pick.title} cover`" loading="lazy" />
                <span v-if="pick.format" class="format">{{ pick.format }}</span>
              </span>
              <span class="pick-title">{{ pick.title }}</span>
              <span class="pick-author">{{ pick.author }}</span>
              <span class="pick-tags">
                <span v-for="g in pick.genres" :key="g" class="pick-tag">{{ g }}</span>
              </span>
              <span class="pick-note">{{ pick.note }}</span>
              <span class="cta">View on Amazon →</span>
            </a>
          </li>
        </ul>
      </section>

      <a class="made" href="/">
        <img src="/favicon.ico" width="16" height="16" alt="" />
        Tracking what you read? Try <strong>Bookmarko</strong>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import LinkBackdrop from './LinkBackdrop.vue'
import cupcake from '@/assets/showcase/mascot-cupcake.svg'
import { profile } from '@/data/links'
import { computed, ref } from 'vue'
import { amazonUrl, shelves, type Pick } from '@/data/picks'

const ALL = 'All'
const activeGenre = ref(ALL)
const query = ref('')

const allPicks = shelves.flatMap((s) => s.picks)

/** "All" first, then genres by how many books they have (ties alphabetical). */
const genreList = (() => {
  const counts = new Map<string, number>()
  for (const p of allPicks) for (const g of p.genres) counts.set(g, (counts.get(g) ?? 0) + 1)
  const sorted = [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  return [{ name: ALL, count: allPicks.length }, ...sorted.map(([name, count]) => ({ name, count }))]
})()

/** Shelves with only the matching picks; shelves left empty are dropped. */
const visibleShelves = computed(() => {
  const q = query.value.trim().toLowerCase()
  return shelves
    .map((shelf) => ({
      ...shelf,
      picks: shelf.picks.filter(
        (p) =>
          (activeGenre.value === ALL || p.genres.includes(activeGenre.value)) &&
          (!q || `${p.title} ${p.author}`.toLowerCase().includes(q)),
      ),
    }))
    .filter((shelf) => shelf.picks.length > 0)
})

function selectGenre(name: string) {
  activeGenre.value = name
  if (name !== ALL) window.gtag?.('event', 'picks_filter', { genre: name })
}

function resetFilters() {
  activeGenre.value = ALL
  query.value = ''
}

function track(pick: Pick, shelf: string) {
  window.gtag?.('event', 'affiliate_click', {
    asin: pick.asin,
    title: pick.title,
    shelf,
    surface: 'idan_picks',
  })
}
</script>

<style scoped>
.pk {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: var(--paper);
  padding: 20px 16px 40px;
}
.col {
  position: relative;
  z-index: 1;
  max-width: 720px;
  margin: 0 auto;
}

.back {
  display: inline-block;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-soft);
  color: var(--ink);
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
}
.back:hover { color: var(--accent); }

/* ── Header ── */
.head {
  position: relative;
  text-align: center;
  margin-top: 20px;
}
.avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #fff;
  box-shadow: var(--shadow-warm);
}
.sticker {
  position: absolute;
  top: -10px;
  left: calc(50% + 22px);
  width: 46px;
  transform: rotate(14deg);
}
.title {
  margin-top: 12px;
  font-family: 'EB Garamond', Georgia, serif;
  font-size: 2.2rem;
  font-weight: 600;
  line-height: 1.1;
}
.sub {
  margin: 8px auto 0;
  max-width: 36ch;
  color: var(--ink-soft);
}
.disclosure {
  display: inline-block;
  margin-top: 14px;
  padding: 5px 12px;
  border-radius: 999px;
  background: #fff;
  border: 1px dashed var(--line);
  font-size: 0.75rem;
  color: var(--ink-mute);
}

/* ── Filters ── */
.filters {
  display: grid;
  gap: 10px;
  margin-top: 28px;
}
.search {
  width: 100%;
  padding: 10px 16px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.9);
  box-shadow: var(--shadow-soft);
  color: var(--ink);
  font: inherit;
  font-size: 0.9rem;
}
.search:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
/* One row that scrolls sideways, so 15 genres don't wrap into a wall of buttons. */
.chips {
  display: flex;
  gap: 8px;
  margin: 0 -16px;
  padding: 2px 16px 4px;
  overflow-x: auto;
  scrollbar-width: none;
}
.chips::-webkit-scrollbar { display: none; }
.chip {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: #fff;
  color: var(--ink);
  font: inherit;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
}
.chip:hover { border-color: var(--accent); }
.chip:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.chip[aria-pressed='true'] { background: var(--ink); border-color: var(--ink); color: #fff; }
.chip-count { font-weight: 500; color: var(--ink-mute); }
.chip[aria-pressed='true'] .chip-count { color: #A5C2F4; }
@media (min-width: 760px) {
  .chips { margin: 0; padding: 2px 0 4px; flex-wrap: wrap; }
}

.empty {
  margin-top: 32px;
  text-align: center;
  color: var(--ink-mute);
}
.reset {
  margin-left: 6px;
  border: 0;
  background: none;
  color: var(--accent-deep);
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  text-decoration: underline;
}

/* ── Shelves ── */
.shelf { margin-top: 40px; }
.shelf-title {
  font-family: 'EB Garamond', Georgia, serif;
  font-size: 1.6rem;
  font-weight: 600;
  line-height: 1.15;
}
.shelf-sub {
  margin-top: 2px;
  font-size: 0.9rem;
  color: var(--ink-mute);
}

/*
 * Covers stand face-out on a wooden plank. The plank is a background on the
 * scrolling track (attachment: local) so it scrolls with the books. Its top
 * edge sits at padding (14px) + cover height (192px).
 */
.rack {
  --cover-h: 192px;
  list-style: none;
  display: flex;
  gap: 18px;
  margin: 14px -16px 0;
  padding: 14px 16px 6px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  /* without this, snapping pins the first cover flush to the screen edge */
  scroll-padding-inline: 16px;
  scrollbar-width: none;
  background:
    linear-gradient(180deg, #C9A57A, #A47C52) no-repeat 0 calc(14px + var(--cover-h)) / 100% 12px,
    linear-gradient(180deg, rgba(80, 50, 20, 0.18), transparent) no-repeat 0 calc(26px + var(--cover-h)) / 100% 10px;
  background-attachment: local;
}
.rack::-webkit-scrollbar { display: none; }

.pick {
  flex: 0 0 140px;
  scroll-snap-align: start;
}
.pick a {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: var(--ink);
}

.cover {
  position: relative;
  height: var(--cover-h);
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
.cover img {
  max-width: 128px;
  max-height: var(--cover-h);
  width: auto;
  height: auto;
  border-radius: 2px 6px 6px 2px;
  box-shadow:
    inset 3px 0 0 rgba(255, 255, 255, 0.2),
    0 2px 0 rgba(20, 25, 58, 0.15),
    0 14px 22px -12px rgba(20, 25, 58, 0.55);
  transform-origin: bottom center;
  transition: transform 0.25s cubic-bezier(0.2, 1.3, 0.4, 1), box-shadow 0.25s;
}
.pick a:hover .cover img,
.pick a:focus-visible .cover img {
  transform: translateY(-8px) rotate(-2deg);
  box-shadow: 0 2px 0 rgba(20, 25, 58, 0.15), 0 24px 30px -14px rgba(20, 25, 58, 0.55);
}
.pick a:focus-visible { outline: none; }
.pick a:focus-visible .pick-title { text-decoration: underline; }

.format {
  position: absolute;
  top: 8px;
  right: 2px;
  padding: 3px 8px;
  border-radius: 999px;
  background: var(--ink);
  color: #fff;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  transform: rotate(6deg);
}

.pick-title {
  margin-top: 22px;
  font-family: 'EB Garamond', Georgia, serif;
  font-size: 1.05rem;
  font-weight: 600;
  line-height: 1.2;
}
.pick-author {
  font-size: 0.78rem;
  color: var(--ink-mute);
}
.pick-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 4px;
}
.pick-tag {
  padding: 1px 6px;
  border-radius: 4px;
  background: #EAF0FF;
  color: var(--accent-deep);
  font-size: 0.66rem;
  font-weight: 600;
}
.pick-note {
  margin-top: 4px;
  font-size: 0.8rem;
  line-height: 1.35;
  color: var(--ink-soft);
}
.cta {
  margin-top: 6px;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--accent-deep);
}

/* Wide screens: no need to scroll, let the shelf breathe. */
@media (min-width: 760px) {
  .rack { margin: 14px 0 0; padding: 14px 8px 6px; overflow: visible; }
  .pick { flex-basis: 150px; }
}

.made {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin: 48px auto 0;
  font-size: 0.85rem;
  color: var(--ink-mute);
  text-decoration: none;
}
.made:hover { color: var(--accent); }
.made img { border-radius: 4px; }

@media (prefers-reduced-motion: reduce) {
  .cover img { transition: none; }
}
</style>
