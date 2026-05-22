<template>
  <section class="changelog-page">
    <header class="page-head">
      <p class="eyebrow">Internal</p>
      <h1 class="title">Changelog</h1>
      <p class="lede">A running log of changes shipped in the Bookmarko client app.</p>
    </header>

    <ol class="timeline">
      <li v-for="entry in entries" :key="entry.version" class="entry">
        <div class="rail">
          <span class="dot" />
        </div>
        <article class="card">
          <div class="card-head">
            <span class="version">{{ /^\d/.test(entry.version) ? 'v' + entry.version : entry.version }}</span>
            <time class="date">{{ formatDate(entry.date) }}</time>
          </div>
          <h2 v-if="entry.title" class="entry-title">{{ entry.title }}</h2>
          <p v-if="entry.summary" class="summary">{{ entry.summary }}</p>
          <ul v-if="entry.changes.length" class="changes">
            <li v-for="(change, i) in entry.changes" :key="i" class="change">
              <span class="tag" :class="`tag-${change.tag}`">{{ change.tag }}</span>
              <span class="text">{{ change.text }}</span>
            </li>
          </ul>
        </article>
      </li>
    </ol>

    <p v-if="!entries.length" class="empty">No entries yet.</p>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { changelog } from '../data/changelog'

const entries = computed(() =>
  [...changelog].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
)

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

let robotsMeta: HTMLMetaElement | null = null
let prevTitle = ''

onMounted(() => {
  prevTitle = document.title
  document.title = 'Changelog — Bookmarko'
  robotsMeta = document.createElement('meta')
  robotsMeta.name = 'robots'
  robotsMeta.content = 'noindex, nofollow'
  document.head.appendChild(robotsMeta)
})

onBeforeUnmount(() => {
  if (robotsMeta) robotsMeta.remove()
  if (prevTitle) document.title = prevTitle
})
</script>

<style scoped>
.changelog-page {
  max-width: 760px;
  margin: 0 auto;
  padding: 6rem 1.5rem 5rem;
}

.page-head {
  margin-bottom: 3rem;
  text-align: left;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--accent);
  margin-bottom: 0.6rem;
}

.title {
  font-family: 'EB Garamond', serif;
  font-size: clamp(2.4rem, 4vw, 3.2rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--ink);
  margin-bottom: 0.65rem;
}

.lede {
  color: var(--ink-mute);
  font-size: 1.02rem;
  line-height: 1.55;
}

.timeline {
  list-style: none;
  padding: 0;
  margin: 0;
}

.entry {
  display: grid;
  grid-template-columns: 24px 1fr;
  gap: 1rem;
  padding-bottom: 2rem;
  position: relative;
}

.rail {
  position: relative;
  display: flex;
  justify-content: center;
}

.rail::before {
  content: '';
  position: absolute;
  top: 14px;
  bottom: -2rem;
  width: 2px;
  background: var(--line);
}

.entry:last-child .rail::before {
  display: none;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--accent);
  margin-top: 8px;
  box-shadow: 0 0 0 4px var(--accent-tint);
  position: relative;
  z-index: 1;
}

.card {
  background: var(--white);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 1.4rem 1.5rem;
  box-shadow: var(--shadow-soft);
}

.card-head {
  display: flex;
  align-items: baseline;
  gap: 0.85rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
}

.version {
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--accent-deep);
  background: var(--accent-tint);
  padding: 0.18rem 0.55rem;
  border-radius: 6px;
}

.date {
  font-size: 0.82rem;
  color: var(--ink-mute);
}

.entry-title {
  font-size: 1.18rem;
  font-weight: 700;
  color: var(--ink);
  margin: 0.2rem 0 0.45rem;
  letter-spacing: -0.01em;
}

.summary {
  color: var(--ink-soft);
  font-size: 0.96rem;
  line-height: 1.55;
  margin-bottom: 1rem;
}

.changes {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.change {
  display: flex;
  gap: 0.7rem;
  align-items: baseline;
  font-size: 0.94rem;
  line-height: 1.5;
  color: var(--ink);
}

.tag {
  flex-shrink: 0;
  font-size: 0.66rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.18rem 0.5rem;
  border-radius: 4px;
  line-height: 1;
  position: relative;
  top: -1px;
}

.tag-feature     { background: #E0F2FE; color: #0369A1; }
.tag-improvement { background: var(--accent-tint); color: var(--accent-deep); }
.tag-fix         { background: #FEF3C7; color: #92400E; }
.tag-chore       { background: #F1F5F9; color: #475569; }

.text {
  flex: 1;
}

.empty {
  color: var(--ink-mute);
  text-align: center;
  padding: 3rem 0;
}

@media (max-width: 560px) {
  .changelog-page { padding: 4.5rem 1.1rem 3.5rem; }
  .card { padding: 1.1rem 1.15rem; }
}
</style>
