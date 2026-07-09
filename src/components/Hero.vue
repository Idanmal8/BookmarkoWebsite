<template>
  <section class="hero" id="top">
    <div class="hero__shelf hero__shelf--left">
      <Bookshelf side="left" :width="180" :height="900" :shelves="8" />
      <div class="hero__shelf-fade hero__shelf-fade--bottom" />
    </div>

    <div class="hero__center">
      <h1 class="hero__title">
        Welcome <em>home,</em><br />
        reader.
      </h1>

      <p class="hero__sub">
        Bookmarko is the warm, well-lit shelf for everything you're reading —
        the novel by your bed, the longform you saved on the train, the chapter
        you keep meaning to finish. One place. Doom scrolling elimenated.
      </p>

      <div class="hero__stores">
        <a
          class="store"
          href="https://apps.apple.com/us/app/bookmarko/id6762641879"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Download Bookmarko on the App Store"
        >
          <img :src="appStoreBadge" alt="Download on the App Store" />
        </a>
        <a
          class="store"
          href="https://play.google.com/store/apps/details?id=com.idanmal.bookmarko"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Get Bookmarko on Google Play"
        >
          <img :src="googleStoreBadge" alt="Get it on Google Play" />
        </a>
      </div>

      <div class="hero__stats">
        <div class="stat">
          <span class="stat__num" :class="{ 'stat__num--bumped': bumped }">{{ formattedCount }}</span>
          <span class="stat__label">readers already joined</span>
        </div>
        <div class="stat__divider" />
        <div class="stat">
          <span class="stat__num">∞</span>
          <span class="stat__label">tabs you'll close</span>
        </div>
        <div class="stat__divider" />
        <div class="stat">
          <span class="stat__num">1</span>
          <span class="stat__label">quiet shelf</span>
        </div>
      </div>
    </div>

    <div class="hero__shelf hero__shelf--right">
      <Bookshelf side="right" :width="180" :height="900" :shelves="8" />
      <div class="hero__shelf-fade hero__shelf-fade--bottom" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import Bookshelf from './Bookshelf.vue'
import { useWaitlistStore } from '@/stores/waitlist'
import appStoreBadge from '@/assets/appStore.png'
import googleStoreBadge from '@/assets/googleStore.png'

const store = useWaitlistStore()
const { waitingCount } = storeToRefs(store)
const formattedCount = computed(() => waitingCount.value.toLocaleString('en-US'))
const bumped = ref(false)
</script>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  display: grid;
  grid-template-columns: 180px 1fr 180px;
  gap: 24px;
  align-items: stretch;
  padding: 0 0 64px;
}
.hero__center {
  max-width: 560px;
  justify-self: center;
  align-self: center;
  text-align: center;
  padding: 140px 24px 32px;
}
.hero__shelf {
  position: relative;
  height: 100%;
  min-height: 100vh;
  align-self: stretch;
  overflow: hidden;
}
.hero__shelf-fade {
  position: absolute; left: 0; right: 0;
  height: 120px;
  pointer-events: none;
}
.hero__shelf-fade--bottom {
  bottom: 0;
  background: linear-gradient(to top, var(--paper) 0%, rgba(247,249,252,.7) 50%, transparent 100%);
}

.hero__eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 13px; font-weight: 600;
  color: var(--ink-soft);
  letter-spacing: .04em;
  text-transform: lowercase;
  padding: 6px 14px;
  background: var(--paper-deep);
  border: 1px solid var(--line);
  border-radius: 999px;
  margin-bottom: 32px;
  white-space: nowrap;
}
.hero__eyebrow-dot {
  width: 7px; height: 7px;
  background: var(--accent);
  border-radius: 50%;
  box-shadow: 0 0 0 4px rgba(81,112,255,.18);
}
.hero__title {
  font-family: 'EB Garamond', serif;
  font-weight: 500;
  font-size: clamp(38px, 4.6vw, 64px);
  line-height: 1.02;
  letter-spacing: -.02em;
  color: var(--ink);
  margin-bottom: 24px;
}
.hero__title em {
  font-style: italic;
  color: #fff;
  font-weight: 400;
}
.hero__sub {
  font-size: 16px;
  line-height: 1.6;
  color: var(--ink);
  font-weight: 500;
  max-width: 440px;
  margin: 0 auto 32px;
}

.hero__stores {
  margin-top: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
}
.store {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  transition: transform .2s ease;
}
.store img {
  height: 100%;
  width: auto;
  display: block;
  border-radius: 8px;
}
a.store:hover { transform: translateY(-2px); }

.hero__stats {
  margin-top: 40px;
  display: flex; align-items: center; justify-content: center;
  gap: 24px;
}
.stat { display: flex; flex-direction: column; gap: 2px; }
.stat__num {
  font-family: 'EB Garamond', serif;
  font-size: 24px; font-weight: 600;
  color: var(--ink);
  line-height: 1;
  transition: color .3s;
  display: inline-block;
}
.stat__num--bumped {
  color: var(--accent-deep);
  animation: countBump .9s cubic-bezier(.16,.84,.44,1);
}
@keyframes countBump {
  0%   { transform: scale(1); }
  35%  { transform: scale(1.18); }
  100% { transform: scale(1); }
}
.stat__label {
  font-size: 12px;
  color: var(--ink-mute);
  letter-spacing: .04em;
}
.stat__divider { width: 1px; height: 32px; background: var(--line); }

@media (max-width: 1100px) {
  .hero { grid-template-columns: 1fr; padding-top: 80px; }
  .hero__shelf { display: none; }
}
</style>
