<template>
  <div class="app-wrapper">
    <Navbar />
    <main>
      <DeleteAccountConfirm v-if="route === 'delete-confirm'" />
      <DeleteAccountRequest v-else-if="route === 'delete-request'" />
      <EmailConfirmed v-else-if="route === 'email-confirmed'" />
      <Hero v-else />
    </main>
    <Footer v-if="route !== 'email-confirmed'" />
  </div>
</template>

<script setup lang="ts">
import Navbar from './components/Navbar.vue'
import Hero from './components/Hero.vue'
import Footer from './components/Footer.vue'
import EmailConfirmed from './components/EmailConfirmed.vue'
import DeleteAccountRequest from './components/DeleteAccountRequest.vue'
import DeleteAccountConfirm from './components/DeleteAccountConfirm.vue'

type Route = 'home' | 'email-confirmed' | 'delete-request' | 'delete-confirm'

function resolveRoute(): Route {
  const params = new URLSearchParams(window.location.search)
  if (params.has('confirmed') || window.location.hash === '#confirmed') return 'email-confirmed'

  const path = window.location.pathname.replace(/\/$/, '')
  if (path === '/delete-account/confirm') return 'delete-confirm'
  if (path === '/delete-account') return 'delete-request'
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

/* Global scroll smoothing */
html {
  scroll-behavior: smooth;
}
</style>
