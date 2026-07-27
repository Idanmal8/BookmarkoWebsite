<template>
  <div class="blog">
    <!-- Small home + back tabs replace the global navbar on blog routes. -->
    <div class="topbar">
      <a href="/" class="tab" aria-label="Back to home">
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path
            d="M3 11.5 12 4l9 7.5M5.5 10v9h4v-5h5v5h4v-9"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span>Home</span>
      </a>
      <a href="/blog" class="tab tab--ghost">← All posts</a>
    </div>

    <article class="post-page">
      <!-- Skeleton while the post loads. -->
      <div v-if="store.loading" aria-hidden="true">
        <div class="skel-line skel-line--title skel"></div>
        <div class="skel-line skel-line--meta skel"></div>
        <div class="cover skel skel-cover"></div>
        <div v-for="n in 8" :key="n" class="skel-line skel" :class="{ 'skel-line--short': n % 4 === 0 }"></div>
      </div>

      <div v-else-if="store.error" class="state error">{{ store.error }}</div>

      <template v-else-if="post">
        <header class="post-head">
          <h1 class="title">{{ post.title || post.bookTitle }}</h1>
          <p class="meta">
            <span>{{ post.bookTitle }}</span>
            <span v-if="post.bookAuthor"> · {{ post.bookAuthor }}</span>
          </p>
          <time v-if="post.publishedAt" class="date">{{ formatDate(post.publishedAt) }}</time>
        </header>

        <img
          v-if="post.coverImageUrl"
          :src="post.coverImageUrl"
          :alt="post.bookTitle"
          class="cover"
        />

        <!-- eslint-disable-next-line vue/no-v-html — content is escaped + rendered by renderMarkdown -->
        <div class="content" v-html="renderedBody"></div>
      </template>
    </article>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useBlogStore } from '../stores/blog'
import { renderMarkdown } from '../utils/markdown'

const props = defineProps<{ slug: string }>()

const store = useBlogStore()
const post = computed(() => store.current)
const renderedBody = computed(() =>
  post.value?.body ? renderMarkdown(post.value.body) : '',
)

// Retained for future use — rating is available on the post but not rendered.
function stars(rating: number): string {
  const full = Math.round(rating)
  return '★'.repeat(full) + '☆'.repeat(Math.max(0, 5 - full))
}
void stars

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

onMounted(() => store.fetchPost(props.slug))
</script>

<style scoped>
.blog {
  min-height: 100vh;
  background: #faf9fc;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  gap: 18px;
  padding: 14px 20px;
  backdrop-filter: blur(8px);
  background: rgba(250, 249, 252, 0.8);
}

.tab {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #1a1a2e;
  text-decoration: none;
  font-family: 'Raleway', sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  transition: color 0.15s ease;
}

.tab:hover {
  color: #6c4cf1;
}

.tab--ghost {
  color: #6c4cf1;
}

.tab--ghost:hover {
  text-decoration: underline;
}

.post-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 32px 24px 96px;
  font-family: 'Raleway', sans-serif;
}

.state {
  text-align: center;
  color: #55556a;
  padding: 48px 0;
}

.state.error {
  color: #c0392b;
}

.post-head {
  margin: 8px 0 24px;
}

.title {
  font-family: 'EB Garamond', serif;
  font-size: clamp(2rem, 4.5vw, 3rem);
  line-height: 1.15;
  color: #1a1a2e;
  margin: 0 0 12px;
}

.meta {
  color: #77778c;
  margin: 0 0 8px;
}

.date {
  color: #9a9ab0;
  font-size: 0.85rem;
}

.cover {
  width: 100%;
  border-radius: 16px;
  margin: 0 0 32px;
  box-shadow: 0 12px 40px rgba(26, 26, 46, 0.12);
}

.content {
  color: #2c2c3e;
  font-size: 1.12rem;
  line-height: 1.75;
}

.content :deep(h1),
.content :deep(h2),
.content :deep(h3),
.content :deep(h4) {
  font-family: 'EB Garamond', serif;
  color: #1a1a2e;
  line-height: 1.25;
  margin: 1.6em 0 0.5em;
}

.content :deep(p) {
  margin: 0 0 1.25em;
}

.content :deep(ul) {
  padding-left: 1.4em;
  margin: 0 0 1.25em;
}

.content :deep(li) {
  margin: 0.35em 0;
}

.content :deep(blockquote) {
  border-left: 3px solid #6c4cf1;
  padding-left: 18px;
  margin: 0 0 1.25em;
  color: #55556a;
  font-style: italic;
}

.content :deep(a) {
  color: #6c4cf1;
}

.content :deep(code) {
  background: #f1f0fb;
  padding: 2px 6px;
  border-radius: 5px;
  font-size: 0.92em;
}

/* ── Skeleton loader ─────────────────────────────────────────────────────── */
.skel {
  position: relative;
  overflow: hidden;
  background: #ececf3;
}

.skel::after {
  content: '';
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.65), transparent);
  animation: shimmer 1.4s infinite;
}

.skel-line {
  height: 14px;
  border-radius: 6px;
  margin-bottom: 12px;
}

.skel-line--title {
  height: 34px;
  width: 80%;
  margin: 8px 0 16px;
}

.skel-line--meta {
  height: 14px;
  width: 45%;
  margin-bottom: 28px;
}

.skel-line--short {
  width: 55%;
}

.skel-cover {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 16px;
  margin: 8px 0 32px;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .skel::after {
    animation: none;
  }
}
</style>
