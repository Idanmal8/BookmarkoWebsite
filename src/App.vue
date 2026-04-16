<template>
  <div class="app-wrapper">
    <Navbar />
    <main>
      <Hero />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Navbar from './components/Navbar.vue'
import Hero from './components/Hero.vue'
import Footer from './components/Footer.vue'
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
