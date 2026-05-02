<template>
  <div class="confirmed-page">
    <div class="particles" aria-hidden="true">
      <span v-for="p in particles" :key="p.id" class="particle" :style="p.style" />
    </div>

    <div class="card" :class="{ visible: cardVisible }">
      <div class="check-wrap">
        <svg class="check-svg" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle class="check-circle" cx="26" cy="26" r="24" stroke="#22c55e" stroke-width="2.5" />
          <polyline class="check-mark" points="14,27 22,35 38,18" stroke="#22c55e" stroke-width="2.8"
            stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>

      <h1 class="heading">You're confirmed!</h1>
      <p class="sub">
        Your email has been verified. Welcome to the Bookmarko waitlist&nbsp;—
        we'll be in touch soon.
      </p>

      <a href="/" class="btn-primary home-btn">Back to homepage</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const cardVisible = ref(false)

const particles = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  style: {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    width: `${4 + Math.random() * 6}px`,
    height: `${4 + Math.random() * 6}px`,
    opacity: `${0.08 + Math.random() * 0.14}`,
    animationDuration: `${6 + Math.random() * 10}s`,
    animationDelay: `${Math.random() * 6}s`,
  },
}))

onMounted(() => {
  requestAnimationFrame(() => { cardVisible.value = true })
})
</script>

<style scoped>
.confirmed-page {
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6rem 1.5rem 3rem;
  position: relative;
  overflow: hidden;
}

/* ── Floating particles ── */
.particles { position: absolute; inset: 0; pointer-events: none; }

.particle {
  position: absolute;
  border-radius: 50%;
  background: var(--primary);
  animation: float linear infinite;
}

@keyframes float {
  0%   { transform: translateY(0)   scale(1);   }
  50%  { transform: translateY(-28px) scale(1.15); }
  100% { transform: translateY(0)   scale(1);   }
}

/* ── Card ── */
.card {
  position: relative;
  z-index: 1;
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 3.5rem 3rem;
  max-width: 480px;
  width: 100%;
  text-align: center;
  box-shadow: 0 4px 32px -4px rgba(81, 112, 255, 0.10), 0 1px 4px rgba(0,0,0,0.05);
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.55s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.55s cubic-bezier(0.4, 0, 0.2, 1);
}

.card.visible {
  opacity: 1;
  transform: translateY(0);
}

/* ── Checkmark ── */
.check-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.check-svg {
  width: 72px;
  height: 72px;
  overflow: visible;
}

.check-circle {
  stroke-dasharray: 157;
  stroke-dashoffset: 157;
  animation: draw-circle 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.3s forwards;
}

.check-mark {
  stroke-dasharray: 36;
  stroke-dashoffset: 36;
  animation: draw-check 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.85s forwards;
}

@keyframes draw-circle {
  to { stroke-dashoffset: 0; }
}

@keyframes draw-check {
  to { stroke-dashoffset: 0; }
}

/* ── Text ── */
.heading {
  font-size: 2.25rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--text);
  margin-bottom: 1rem;
  line-height: 1.15;
}

.sub {
  font-size: 1.05rem;
  color: var(--text-secondary);
  line-height: 1.65;
  margin-bottom: 2.25rem;
}

/* ── Button ── */
.home-btn {
  display: inline-block;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  padding: 0.8rem 2rem;
}

/* ── Responsive ── */
@media (max-width: 520px) {
  .card { padding: 2.5rem 1.5rem; }
  .heading { font-size: 1.8rem; }
}
</style>
