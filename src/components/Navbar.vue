<template>
  <nav class="nav" :class="{ 'nav--scrolled': scrolled }">
    <a href="/" class="nav__brand">
      <img src="/src/assets/bookmarkoLogo.png" alt="" class="nav__logo" />
      <span class="nav__wordmark">Bookmarko</span>
    </a>
    <div class="nav__links" v-if="variant === 'home'">
      <a href="#endless-shelf">The shelf</a>
      <a href="#goodreads">Import</a>
      <a href="#leaderboard">Leaderboard</a>
      <a href="#ginie">Ask Ginie</a>
      <a href="/blog">Blog</a>
      <a href="/roadmap">Requests</a>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

withDefaults(defineProps<{ variant?: 'home' | 'plain' }>(), { variant: 'home' })

const scrolled = ref(false)
const onScroll = () => (scrolled.value = window.scrollY > 40)
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.nav {
  position: fixed; top: 0; left: 0; right: 0;
  z-index: 50;
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 36px;
  background: #5170ff;
  transition: padding .3s;
}
.nav--scrolled { padding: 10px 36px; }
.nav__brand { display: flex; align-items: center; gap: 10px; text-decoration: none; color: #fff; }
.nav__logo { width: 36px; height: 36px; object-fit: contain; }
.nav__wordmark {
  font-family: 'EB Garamond', serif;
  font-weight: 600;
  font-size: 22px;
  letter-spacing: -.01em;
  color: #fff;
}
.nav__links {
  display: flex; align-items: center; gap: 24px;
  flex-wrap: nowrap;
}
.nav__links a {
  text-decoration: none;
  color: rgba(255,255,255,.78);
  font-size: 14px;
  font-weight: 500;
  transition: color .2s;
  white-space: nowrap;
}
.nav__links a:hover { color: #fff; }

@media (max-width: 1040px) {
  /* Mobile: just the logo, centered — no links, no wordmark. */
  .nav { justify-content: center; }
  .nav__links { display: none; }
  .nav__wordmark { display: none; }
}
@media (max-width: 760px) {
  .nav { padding: 14px 18px; }
}
</style>
