<template>
  <footer class="footer">
    <div class="footer__inner">
      <div class="footer__brand">
        <img src="/src/assets/bookmarkoLogo-mark.png" alt="" class="footer__logo" />
        <span class="footer__wordmark">Bookmarko</span>
      </div>
      <nav class="footer__legal" aria-label="Legal">
        <a href="/roadmap">Requests</a>
        <a href="/blog">Blog</a>
        <a href="/privacy.html">Privacy</a>
        <a href="/terms.html">Terms</a>
      </nav>
    </div>
    <!--
      Our Bookshop.org storefront. Deliberately persistent site-wide: the
      affiliate cookie only lasts 48 hours, so per-book links pay only on
      immediate intent. A storefront someone bookmarks is the one affiliate
      asset that keeps earning after the cookie expires.
    -->
    <div class="footer__shop">
      <a
        href="https://bookshop.org/shop/Bookmarko"
        target="_blank"
        rel="noopener sponsored"
        @click="trackShopClick('WEBSITE_STOREFRONT')"
      >Our bookshop</a>
      <span aria-hidden="true">·</span>
      <a
        href="https://bookshop.org/a/126827/gift_cards"
        target="_blank"
        rel="noopener sponsored"
        @click="trackShopClick('WEBSITE_STOREFRONT')"
      >Gift cards</a>
      <p class="footer__disclosure">
        Bookshop.org links are affiliate links — we earn a small commission on
        purchases, at no extra cost to you. It supports independent bookshops.
      </p>
    </div>
    <div class="footer__base">
      <span>© 2026 Bookmarko. Built quietly, for readers.</span>
      <span class="footer__sig">Made with a cup of tea and a closed tab.</span>
    </div>
    <div class="footer__mark" aria-hidden="true">
      <img src="/src/assets/bookmarkoLogo-mark.png" alt="" />
    </div>
  </footer>
</template>

<script setup lang="ts">
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '')

/**
 * Log an outbound storefront click. Fire-and-forget, and failures are
 * swallowed — an analytics row is worth far less than the click itself, which
 * must never be delayed or blocked. `keepalive` so it still sends while the
 * browser is navigating away.
 */
function trackShopClick(surface: string) {
  void fetch(`${API_BASE_URL}/affiliate/click`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tier: 'D', surface }),
    keepalive: true,
  }).catch(() => {})
}
</script>

<style scoped>
.footer {
  background: var(--ink-deep);
  color: rgba(247,249,252,.7);
  padding: 60px 36px 40px;
  border-top: 1px solid rgba(247,249,252,.08);
  position: relative;
  overflow: hidden;
}
.app-wrapper.home .footer {
  background: transparent;
}
.footer__inner {
  max-width: 1180px; margin: 0 auto;
  display: flex; align-items: center; justify-content: space-between;
  gap: 24px;
  padding-bottom: 32px;
  border-bottom: 1px solid rgba(247,249,252,.08);
  position: relative;
  z-index: 2;
}
.footer__brand {
  display: flex; align-items: center; gap: 10px;
  color: var(--paper);
}
.footer__logo { width: 28px; height: 28px; object-fit: contain; }
.footer__wordmark {
  font-family: 'EB Garamond', serif;
  font-weight: 600;
  font-size: 20px;
  letter-spacing: -.01em;
}
.footer__legal {
  display: flex; align-items: center; gap: 28px;
}
.footer__legal a {
  color: rgba(247,249,252,.6);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: .01em;
  transition: color .2s;
}
.footer__legal a:hover { color: var(--paper); }
.footer__base {
  max-width: 1180px; margin: 24px auto 0;
  display: flex; justify-content: space-between; gap: 12px;
  font-size: 12px;
  color: rgba(247,249,252,.45);
  position: relative;
  z-index: 2;
}
.footer__sig { font-family: 'EB Garamond', serif; font-style: italic; }

.footer__mark {
  position: absolute;
  right: -60px;
  bottom: -80px;
  width: 320px;
  height: 320px;
  pointer-events: none;
  opacity: .09;
  z-index: 1;
}
.footer__mark img { width: 100%; height: 100%; object-fit: contain; }

@media (max-width: 720px) {
  .footer__inner {
    flex-direction: column;
    align-items: flex-start;
    gap: 18px;
  }
  .footer__base { flex-direction: column; gap: 6px; }
  .footer__mark { width: 220px; height: 220px; right: -50px; bottom: -60px; }
}

.footer__shop {
  max-width: 1180px;
  margin: 0 auto;
  padding: 20px 0 0;
  position: relative;
  z-index: 2;
  font-size: .9rem;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.footer__shop a {
  color: rgba(247,249,252,.82);
  text-decoration: none;
  border-bottom: 1px solid rgba(247,249,252,.25);
}
.footer__shop a:hover { color: var(--paper); }
/* FTC: disclosure must sit next to the links, not on a separate page. */
.footer__disclosure {
  flex-basis: 100%;
  margin: 8px 0 0;
  font-size: .78rem;
  color: rgba(247,249,252,.45);
  line-height: 1.5;
}
</style>
