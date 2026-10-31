<template>
  <nav class="nav" :class="{ 'nav--scrolled': scrolled, 'nav--newsletter': variant === 'newsletter' }">
    <a href="/" class="nav__brand">
      <!-- The cream newsletter bar needs the transparent mark; the full logo has a blue tile baked in. -->
      <img
        :src="variant === 'newsletter' ? logoMark : logo"
        alt=""
        class="nav__logo"
      />
      <span class="nav__wordmark">Bookmarko</span>
    </a>
    <div class="nav__links" v-if="variant === 'home'">
      <a href="#endless-shelf">The shelf</a>
      <a href="#goodreads">Import</a>
      <a href="#ginie">Ask Ginie</a>
      <a href="/blog/">Blog</a>
      <a href="/roadmap/">Requests</a>
    </div>
    <a v-if="variant === 'newsletter'" href="#join" class="nav__subscribe">Subscribe ✉️</a>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import logo from '@/assets/bookmarkoLogo.webp'
import logoMark from '@/assets/bookmarkoLogo-mark.webp'

withDefaults(defineProps<{ variant?: 'home' | 'plain' | 'newsletter' }>(), { variant: 'home' })

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

/* Idan's newsletter: cream paper instead of brand blue, to match the page. */
.nav--newsletter {
  background: #fbf6ec;
  border-bottom: 2px solid #14193a;
}
.nav--newsletter .nav__brand,
.nav--newsletter .nav__wordmark { color: #14193a; }
.nav--newsletter .nav__logo { width: 30px; height: 30px; filter: brightness(0); opacity: .88; }
.nav__subscribe {
  text-decoration: none;
  background: #14193a;
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  padding: 9px 18px;
  border-radius: 999px;
  box-shadow: 3px 3px 0 #ff6b3d;
  transition: translate .2s, box-shadow .2s;
}
.nav__subscribe:hover { translate: -2px -2px; box-shadow: 5px 5px 0 #ff6b3d; }

@media (max-width: 1040px) {
  /* Mobile: just the logo, centered — no links, no wordmark. */
  .nav { justify-content: center; }
  .nav--newsletter { justify-content: space-between; }
  .nav__links { display: none; }
  .nav__wordmark { display: none; }
}
@media (max-width: 760px) {
  .nav { padding: 14px 18px; }
}
</style>
