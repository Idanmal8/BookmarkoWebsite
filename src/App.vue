<template>
  <div class="app-wrapper" :class="{ home: route === 'home' }">
    <Navbar :variant="route === 'home' ? 'home' : 'plain'" />
    <main>
      <DeleteAccountConfirm v-if="route === 'delete-confirm'" />
      <DeleteAccountRequest v-else-if="route === 'delete-request'" />
      <EmailConfirmed v-else-if="route === 'email-confirmed'" />
      <Changelog v-else-if="route === 'changelog'" />
      <template v-else>
        <Hero />
        <GoodreadsImport />
        <Features />
        <GinieSection />
        <NowReading />
        <Quote />
        <Finale />
      </template>
    </main>
    <Footer v-if="route !== 'email-confirmed'" />
  </div>
</template>

<script setup lang="ts">
import Navbar from './components/Navbar.vue'
import Hero from './components/Hero.vue'
import Features from './components/Features.vue'
import GoodreadsImport from './components/GoodreadsImport.vue'
import GinieSection from './components/GinieSection.vue'
import NowReading from './components/NowReading.vue'
import Quote from './components/Quote.vue'
import Finale from './components/Finale.vue'
import Footer from './components/Footer.vue'
import EmailConfirmed from './components/EmailConfirmed.vue'
import DeleteAccountRequest from './components/DeleteAccountRequest.vue'
import DeleteAccountConfirm from './components/DeleteAccountConfirm.vue'
import Changelog from './components/Changelog.vue'

type Route = 'home' | 'email-confirmed' | 'delete-request' | 'delete-confirm' | 'changelog'

function resolveRoute(): Route {
  const params = new URLSearchParams(window.location.search)
  if (params.has('confirmed') || window.location.hash === '#confirmed') return 'email-confirmed'

  const path = window.location.pathname.replace(/\/$/, '')
  if (path === '/delete-account/confirm') return 'delete-confirm'
  if (path === '/delete-account') return 'delete-request'
  if (path === '/changelog') return 'changelog'
  return 'home'
}

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
