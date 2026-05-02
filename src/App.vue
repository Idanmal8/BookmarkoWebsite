<template>
  <div class="app-wrapper">
    <Navbar />
    <main>
      <EmailConfirmed v-if="isConfirmed" />
      <Hero v-else />
    </main>
    <Footer v-if="!isConfirmed" />
  </div>
</template>

<script setup lang="ts">
import Navbar from './components/Navbar.vue'
import Hero from './components/Hero.vue'
import Footer from './components/Footer.vue'
import EmailConfirmed from './components/EmailConfirmed.vue'

const params = new URLSearchParams(window.location.search)
const isConfirmed = params.has('confirmed') || window.location.hash === '#confirmed'
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
