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
      <Roadmap v-else-if="route === 'roadmap'" />
      <BlogPost v-else-if="route === 'blog-post'" :slug="blogSlug" />
      <Blog v-else-if="route === 'blog'" />
      <template v-else>
        <Hero />
        <BookSectionHero />
        <GoodreadsImport />
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
import GinieSection from './components/GinieSection.vue'
import Quote from './components/Quote.vue'
import Finale from './components/Finale.vue'
import Footer from './components/Footer.vue'
import EmailConfirmed from './components/EmailConfirmed.vue'
import DeleteAccountRequest from './components/DeleteAccountRequest.vue'
import DeleteAccountConfirm from './components/DeleteAccountConfirm.vue'
import Changelog from './components/Changelog.vue'
import Roadmap from './components/Roadmap.vue'
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
  | 'roadmap'
  | 'new-design'
  | 'blog'
  | 'blog-post'

/**
 * `/blog/:slug/amp` is a static AMP document (see `scripts/amp.ts`) that GitHub
 * Pages serves directly, so the SPA normally never sees that path. It does see
 * it in two cases: `npm run dev`, which serves no static pages at all, and a
 * production build that shipped without post pages because the blog API was
 * down, which leaves an already-indexed AMP URL falling through to `404.html`.
 *
 * A slug is a single path segment, so a trailing `/amp` is always the variant
 * and never part of the slug. Send the browser to the canonical post: without
 * this the path resolves to a `blog-post` whose slug is `<slug>/amp`, which the
 * API cannot serve, and the reader gets an error page instead of the article.
 */
const ampVariant = /^(\/blog\/[^/]+)\/amp\/?$/.exec(window.location.pathname)
if (ampVariant) window.location.replace(`${ampVariant[1]}/`)

function resolveRoute(): Route {
  const params = new URLSearchParams(window.location.search)
  if (params.has('confirmed') || window.location.hash === '#confirmed') return 'email-confirmed'

  const path = window.location.pathname.replace(/\/$/, '')
  if (path === '/delete-account/confirm') return 'delete-confirm'
  if (path === '/delete-account') return 'delete-request'
  if (path === '/changelog') return 'changelog'
  if (path === '/roadmap') return 'roadmap'
  if (path.toLowerCase() === '/newdesign') return 'new-design'
  if (path === '/blog') return 'blog'
  if (path.startsWith('/blog/')) return 'blog-post'
  return 'home'
}

/** Slug segment for `/blog/:slug` (empty for other routes). */
const blogSlug = decodeURIComponent(
  window.location.pathname.replace(/\/$/, '').split('/blog/')[1]?.split('/')[0] ?? '',
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
