<template>
  <div class="app-wrapper" :class="{ home: route === 'home' }">
    <Navbar
      v-if="route !== 'new-design' && route !== 'blog' && route !== 'blog-post'"
      :variant="route === 'home' ? 'home' : route === 'newsletter' ? 'newsletter' : 'plain'"
    />
    <main>
      <NewDesign v-if="route === 'new-design'" />
      <DeleteAccountConfirm v-else-if="route === 'delete-confirm'" />
      <DeleteAccountRequest v-else-if="route === 'delete-request'" />
      <EmailConfirmed v-else-if="route === 'email-confirmed'" />
      <Unsubscribe v-else-if="route === 'unsubscribe'" />
      <Changelog v-else-if="route === 'changelog'" />
      <Roadmap v-else-if="route === 'roadmap'" />
      <Newsletter v-else-if="route === 'newsletter'" />
      <Unsubscribe v-else-if="route === 'newsletter-unsubscribe'" kind="newsletter" />
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
import { defineAsyncComponent } from 'vue'
import Navbar from './components/Navbar.vue'
import Hero from './components/Hero.vue'
import BookSectionHero from './components/BookSectionHero.vue'
import GoodreadsImport from './components/GoodreadsImport.vue'
import GinieSection from './components/GinieSection.vue'
import Quote from './components/Quote.vue'
import Finale from './components/Finale.vue'
import Footer from './components/Footer.vue'
import EmailConfirmed from './components/EmailConfirmed.vue'
import Unsubscribe from './components/Unsubscribe.vue'
import DeleteAccountRequest from './components/DeleteAccountRequest.vue'
import DeleteAccountConfirm from './components/DeleteAccountConfirm.vue'
import Changelog from './components/Changelog.vue'
import Roadmap from './components/Roadmap.vue'
// Lazy: its GSAP plugins (SplitText, Draggable, Inertia) stay out of the main bundle.
const Newsletter = defineAsyncComponent(() => import('./components/Newsletter.vue'))
import NewDesign from './components/NewDesign.vue'
import Blog from './components/Blog.vue'
import BlogPost from './components/BlogPost.vue'
import CustomCursor from './components/CustomCursor.vue'

type Route =
  | 'home'
  | 'email-confirmed'
  | 'unsubscribe'
  | 'delete-request'
  | 'delete-confirm'
  | 'changelog'
  | 'roadmap'
  | 'newsletter'
  | 'newsletter-unsubscribe'
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
  if (path === '/unsubscribe') return 'unsubscribe'
  if (path === '/changelog') return 'changelog'
  if (path === '/roadmap') return 'roadmap'
  if (path === '/newsletter') return 'newsletter'
  if (path === '/newsletter/unsubscribe') return 'newsletter-unsubscribe'
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
