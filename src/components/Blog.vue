<template>
  <div class="blog">
    <!-- Small home tab replaces the global navbar on blog routes. -->
    <div class="topbar">
      <a href="/" class="home-tab" aria-label="Back to home">
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
    </div>

    <section class="blog-page">
      <header class="page-head">
        <a href="/" aria-label="Bookmarko home" class="brand-badge">
          <img src="/src/assets/bookmarkoLogo.png" alt="Bookmarko" class="brand-logo" />
        </a>
        <h1 class="title">The Reading Blog</h1>
      </header>

      <!-- Skeleton placeholders while posts load. -->
      <ul v-if="store.loading" class="grid" aria-hidden="true">
        <li v-for="n in 6" :key="n" class="card">
          <div class="cover skel"></div>
          <div class="body">
            <div class="skel-line skel-line--title skel"></div>
            <div class="skel-line skel-line--sub skel"></div>
            <div class="skel-line skel"></div>
            <div class="skel-line skel-line--short skel"></div>
            <div class="foot"><div class="skel-pill skel"></div></div>
          </div>
        </li>
      </ul>

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
              <p class="sub">
                {{ post.bookTitle }}<span v-if="post.bookAuthor"> · {{ post.bookAuthor }}</span>
              </p>
              <p v-if="post.excerpt" class="excerpt">{{ post.excerpt }}</p>
              <div class="foot">
                <time v-if="post.publishedAt" class="date-pill">{{
                  formatDate(post.publishedAt)
                }}</time>
              </div>
            </div>
          </a>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useBlogStore } from '../stores/blog'

const store = useBlogStore()

// Retained for future use — rating stars are wired end-to-end but not rendered
// on the cards right now.
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

onMounted(() => store.fetchList())
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
  padding: 14px 20px;
  backdrop-filter: blur(8px);
  background: rgba(250, 249, 252, 0.8);
}

.home-tab {
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

.home-tab:hover {
  color: #6c4cf1;
}

.blog-page {
  max-width: 1080px;
  margin: 0 auto;
  padding: 32px 24px 96px;
}

.page-head {
  text-align: center;
  margin-bottom: 48px;
}

.brand-badge {
  display: inline-flex;
  width: 72px;
  height: 72px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(26, 26, 46, 0.1);
  margin-bottom: 18px;
}

.brand-logo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.title {
  font-family: 'EB Garamond', serif;
  font-size: clamp(2.4rem, 5vw, 3.4rem);
  margin: 0;
  color: #1a1a2e;
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
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 28px;
}

.card {
  background: #fff;
  border-radius: 18px;
  padding: 14px;
  box-shadow: 0 6px 24px rgba(26, 26, 46, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 14px 40px rgba(26, 26, 46, 0.12);
}

.card-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.cover {
  aspect-ratio: 16 / 10;
  border-radius: 14px;
  overflow: hidden;
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
  padding: 16px 8px 8px;
  font-family: 'Raleway', sans-serif;
}

.card-title {
  font-family: 'EB Garamond', serif;
  font-size: 1.55rem;
  line-height: 1.2;
  margin: 0 0 6px;
  color: #1a1a2e;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.sub {
  color: #9a9ab0;
  font-size: 0.85rem;
  margin: 0 0 10px;
}

.excerpt {
  color: #55556a;
  line-height: 1.6;
  margin: 0 0 16px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.foot {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.date-pill {
  font-size: 0.78rem;
  color: #77778c;
  background: #f1f0fb;
  padding: 4px 12px;
  border-radius: 999px;
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
  height: 13px;
  border-radius: 6px;
  margin-bottom: 10px;
}

.skel-line--title {
  height: 22px;
  width: 85%;
  margin-bottom: 14px;
}

.skel-line--sub {
  width: 55%;
  margin-bottom: 16px;
}

.skel-line--short {
  width: 40%;
}

.skel-pill {
  width: 96px;
  height: 22px;
  border-radius: 999px;
  margin-top: 6px;
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
