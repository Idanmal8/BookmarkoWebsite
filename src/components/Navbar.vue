<template>
  <nav class="navbar" :class="{ 'scrolled': isScrolled }">
    <div class="container nav-content">
      <div class="logo">
        <img src="/src/assets/bookmarkoLogo.png" alt="Bookmarko Logo" class="logo-image" />
        <span class="logo-text">Bookmarko</span>
      </div>
      
      <div class="nav-links" v-if="showNavLinks">
        <a href="#features">Features</a>
        <a href="#pricing">Pricing</a>
        <a href="#blog">Blog</a>
        <a href="#about">About</a>
      </div>
      
      <div class="nav-actions" v-if="showJoinButton">
        <button class="btn-primary">Join Waitlist</button>
      </div>
      
      <div class="mobile-menu-btn" @click="isMobileMenuOpen = !isMobileMenuOpen">
        <span></span>
        <span></span>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const isScrolled = ref(false);
const isMobileMenuOpen = ref(false);
const showNavLinks = ref(false); // Hidden per user request
const showJoinButton = ref(false); // Hidden per user request

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: var(--transition);
  padding: 1.5rem 0;
  background-color: transparent;
}

.navbar.scrolled {
  background-color: rgba(249, 250, 251, 0.8);
  backdrop-filter: blur(12px);
  padding: 1rem 0;
  border-bottom: 1px solid var(--border);
}

.nav-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 800;
  font-size: 1.5rem;
  color: var(--text);
}

.logo-image {
  width: 40px;
  height: 40px;
  object-fit: contain;
  border-radius: 8px;
}

.nav-links {
  display: flex;
  gap: 2.5rem;
}

.nav-links a {
  text-decoration: none;
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 1rem;
  transition: var(--transition);
}

.nav-links a:hover {
  color: var(--primary);
}

.mobile-menu-btn {
  display: none;
}

@media (max-width: 900px) {
  .nav-links {
    display: none;
  }
}
</style>
