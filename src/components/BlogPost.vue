<template>
  <article class="post-page">
    <a href="/blog" class="back">← All posts</a>

    <div v-if="store.loading" class="state">Loading…</div>
    <div v-else-if="store.error" class="state error">{{ store.error }}</div>

    <template v-else-if="post">
      <header class="post-head">
        <h1 class="title">{{ post.title || post.bookTitle }}</h1>
        <p class="meta">
          <span>{{ post.bookTitle }}</span>
          <span v-if="post.bookAuthor"> · {{ post.bookAuthor }}</span>
        </p>
        <p v-if="post.rating != null" class="stars" :aria-label="`${post.rating} out of 5`">
          {{ stars(post.rating) }}
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

function stars(rating: number): string {
  const full = Math.round(rating)
  return '★'.repeat(full) + '☆'.repeat(Math.max(0, 5 - full))
}

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
.post-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 140px 24px 96px;
  font-family: 'Raleway', sans-serif;
}

.back {
  color: #6c4cf1;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.92rem;
}

.back:hover {
  text-decoration: underline;
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
  margin: 28px 0 24px;
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

.stars {
  color: #f4a723;
  letter-spacing: 0.08em;
  font-size: 1.15rem;
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
</style>
