<template>
  <div class="app-wrapper" :class="{ home: route === 'home' }">
    <Navbar
      v-if="route !== 'new-design' && route !== 'blog' && route !== 'blog-post'"
      :variant="route === 'home' ? 'home' : 'plain'"
    />
    <main>
      <NewDesign v-if="route === 'new-design'" />
      <DeleteAccountConfirm v-else-if="route === 'delete-confirm'" />
      <DeleteAccountRequest v-else-if="route === 'delete-request'" />
      <EmailConfirmed v-else-if="route === 'email-confirmed'" />
      <Changelog v-else-if="route === 'changelog'" />
      <BlogPost v-else-if="route === 'blog-post'" :slug="blogSlug" />
      <Blog v-else-if="route === 'blog'" />
      <template v-else>
        <Hero />
        <BookSectionHero />
        <GoodreadsImport />
        <Leaderboard />
        <GinieSection />
        <Quote />
        <Finale />
      </template>
    </main>
    <Footer v-if="route !== 'email-confirmed' && route !== 'new-design'" />
    <CustomCursor />
  </div>
</template>

<script setup lang="ts">
import Navbar from './components/Navbar.vue'
import Hero from './components/Hero.vue'
import BookSectionHero from './components/BookSectionHero.vue'
import GoodreadsImport from './components/GoodreadsImport.vue'
import Leaderboard from './components/Leaderboard.vue'
import GinieSection from './components/GinieSection.vue'
import Quote from './components/Quote.vue'
import Finale from './components/Finale.vue'
import Footer from './components/Footer.vue'
import EmailConfirmed from './components/EmailConfirmed.vue'
import DeleteAccountRequest from './components/DeleteAccountRequest.vue'
import DeleteAccountConfirm from './components/DeleteAccountConfirm.vue'
import Changelog from './components/Changelog.vue'
import NewDesign from './components/NewDesign.vue'
import Blog from './components/Blog.vue'
import BlogPost from './components/BlogPost.vue'
import CustomCursor from './components/CustomCursor.vue'

type Route =
  | 'home'
  | 'email-confirmed'
  | 'delete-request'
  | 'delete-confirm'
  | 'changelog'
  | 'new-design'
  | 'blog'
  | 'blog-post'

function resolveRoute(): Route {
  const params = new URLSearchParams(window.location.search)
  if (params.has('confirmed') || window.location.hash === '#confirmed') return 'email-confirmed'

  const path = window.location.pathname.replace(/\/$/, '')
  if (path === '/delete-account/confirm') return 'delete-confirm'
  if (path === '/delete-account') return 'delete-request'
  if (path === '/changelog') return 'changelog'
  if (path.toLowerCase() === '/newdesign') return 'new-design'
  if (path === '/blog') return 'blog'
  if (path.startsWith('/blog/')) return 'blog-post'
  return 'home'
}

/** Slug segment for `/blog/:slug` (empty for other routes). */
const blogSlug = decodeURIComponent(
  window.location.pathname.replace(/\/$/, '').split('/blog/')[1] ?? '',
)

const route = resolveRoute()
</script>

<style>
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}
</style>
