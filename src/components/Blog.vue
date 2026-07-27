<template>
  <section class="blog-page">
    <header class="page-head">
      <p class="eyebrow">Bookmarko</p>
      <h1 class="title">The Reading Blog</h1>
      <p class="lede">Book reviews, reading strategies, and thoughts from the shelf.</p>
    </header>

    <div v-if="store.loading" class="state">Loading posts…</div>
    <div v-else-if="store.error" class="state error">{{ store.error }}</div>
    <div v-else-if="!store.posts.length" class="state">No posts yet — check back soon.</div>

    <ul v-else class="grid">
      <li v-for="post in store.posts" :key="post.id" class="card">
        <a :href="`/blog/${post.slug}`" class="card-link">
          <div class="cover">
            <img v-if="post.coverImageUrl" :src="post.coverImageUrl" :alt="post.bookTitle" />
            <div v-else class="cover-fallback">{{ post.bookTitle }}</div>
          </div>
          <div class="body">
            <h2 class="card-title">{{ post.title || post.bookTitle }}</h2>
            <p v-if="post.bookAuthor" class="meta">{{ post.bookTitle }} · {{ post.bookAuthor }}</p>
            <p v-if="post.rating != null" class="stars" :aria-label="`${post.rating} out of 5`">
              {{ stars(post.rating) }}
            </p>
            <p v-if="post.excerpt" class="excerpt">{{ post.excerpt }}</p>
            <time v-if="post.publishedAt" class="date">{{ formatDate(post.publishedAt) }}</time>
          </div>
        </a>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useBlogStore } from '../stores/blog'

const store = useBlogStore()

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

onMounted(() => store.fetchList())
</script>

<style scoped>
.blog-page {
  max-width: 1080px;
  margin: 0 auto;
  padding: 140px 24px 96px;
}

.page-head {
  text-align: center;
  margin-bottom: 56px;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.8rem;
  color: #6c4cf1;
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  margin: 0 0 12px;
}

.title {
  font-family: 'EB Garamond', serif;
  font-size: clamp(2.4rem, 5vw, 3.6rem);
  margin: 0 0 12px;
  color: #1a1a2e;
}

.lede {
  font-family: 'Raleway', sans-serif;
  color: #55556a;
  font-size: 1.1rem;
  margin: 0;
}

.state {
  text-align: center;
  font-family: 'Raleway', sans-serif;
  color: #55556a;
  padding: 48px 0;
}

.state.error {
  color: #c0392b;
}

.grid {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 28px;
}

.card {
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 8px 30px rgba(26, 26, 46, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 14px 40px rgba(26, 26, 46, 0.14);
}

.card-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.cover {
  aspect-ratio: 16 / 10;
  background: linear-gradient(135deg, #6c4cf1, #a58bff);
  display: flex;
}

.cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-fallback {
  margin: auto;
  color: #fff;
  font-family: 'EB Garamond', serif;
  font-size: 1.2rem;
  padding: 16px;
  text-align: center;
}

.body {
  padding: 20px 22px 24px;
  font-family: 'Raleway', sans-serif;
}

.card-title {
  font-family: 'EB Garamond', serif;
  font-size: 1.5rem;
  margin: 0 0 6px;
  color: #1a1a2e;
}

.meta {
  color: #77778c;
  font-size: 0.9rem;
  margin: 0 0 8px;
}

.stars {
  color: #f4a723;
  letter-spacing: 0.08em;
  margin: 0 0 10px;
}

.excerpt {
  color: #44445a;
  line-height: 1.55;
  margin: 0 0 12px;
}

.date {
  color: #9a9ab0;
  font-size: 0.82rem;
}
</style>
