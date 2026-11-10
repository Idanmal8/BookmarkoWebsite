<template>
  <!-- Idan's link-in-bio page (`/idan`). Content lives in `src/data/links.ts`. -->
  <div class="lp">
    <LinkBackdrop />

    <div class="col">
      <button class="share" type="button" :aria-label="shareLabel" @click="share">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" /></svg>
      </button>

      <!-- ── Profile ── -->
      <header class="profile">
        <div class="polaroid">
          <img :src="profile.avatar" width="160" height="160" :alt="profile.name" />
          <button class="buddy heart" type="button" aria-label="Heart says hi" @click="say('heart')">
            <img :src="heart" alt="" />
            <span class="bubble" :class="{ show: speaking === 'heart' }">{{ LINES.heart }}</span>
          </button>
        </div>
        <h1 class="name">{{ profile.name }}</h1>
        <p class="bio">{{ profile.bio }}</p>

        <nav v-if="socials.length" class="socials" aria-label="Social profiles">
          <a
            v-for="s in socials"
            :key="s.id"
            :href="s.url"
            :aria-label="s.label"
            target="_blank"
            rel="noopener me"
            @click="track(`social_${s.id}`, s.url)"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" v-html="ICONS[s.id]" />
          </a>
        </nav>
      </header>

      <a
        v-if="profile.currentlyReading"
        class="reading"
        :href="profile.currentlyReading.url"
        target="_blank"
        rel="noopener"
      >
        <span class="reading-kicker">📖 Currently reading</span>
        <span class="reading-title">{{ profile.currentlyReading.title }}</span>
        <span class="reading-author">by {{ profile.currentlyReading.author }}</span>
      </a>

      <!-- ── The stack: every link is a book ── -->
      <div class="stack-wrap">
      <button class="buddy cupcake" type="button" aria-label="Cupcake says hi" @click="say('cupcake')">
        <img :src="cupcake" alt="" />
        <span class="bubble" :class="{ show: speaking === 'cupcake' }">{{ LINES.cupcake }}</span>
      </button>
      <ul class="stack">
        <li v-for="(link, i) in links" :key="link.id" :style="bookStyle(link, i)">
          <a
            class="book"
            :href="link.url"
            :target="isExternal(link.url) ? '_blank' : undefined"
            :rel="isExternal(link.url) ? 'noopener' : undefined"
            @click="track(link.id, link.url)"
          >
            <span class="spine" aria-hidden="true">{{ link.icon }}</span>
            <span class="cover">
              <span class="title">{{ link.title }}</span>
              <span v-if="link.subtitle" class="subtitle">{{ link.subtitle }}</span>
            </span>
            <span v-if="link.tag" class="tag">{{ link.tag }}</span>
            <span class="pages" aria-hidden="true" />
            <span class="mark" aria-hidden="true" />
          </a>
        </li>
      </ul>
      </div>
      <div class="shelf" aria-hidden="true" />

      <!-- ── Inline signup: something a plain link list can't do ── -->
      <section class="letter" aria-labelledby="lp-letter-title">
        <button class="buddy keycap" type="button" aria-label="Keycap says hi" @click="say('keycap')">
          <img :src="keycap" alt="" />
          <span class="bubble" :class="{ show: speaking === 'keycap' }">{{ LINES.keycap }}</span>
        </button>
        <h2 id="lp-letter-title" class="letter-title">Get my letters ✉️</h2>
        <p class="letter-sub">Building an audience from zero, in the open. Straight to your inbox.</p>
        <NewsletterForm source="link-page" fine-print="Free. Unsubscribe anytime." />
      </section>

      <a class="made" href="/" @click="track('made_with', '/')">
        <img src="/favicon.ico" width="16" height="16" alt="" />
        Made with <strong>Bookmarko</strong>
      </a>
    </div>

    <p class="toast" :class="{ show: toast }" role="status">{{ toast }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NewsletterForm from './NewsletterForm.vue'
import LinkBackdrop from './LinkBackdrop.vue'
import { links, profile, socials, type LinkItem, type SocialItem } from '@/data/links'
// The same sticker mascots the landing page uses (AppShowcase / GoodreadsImport).
import heart from '@/assets/showcase/mascot-heart.svg'
import cupcake from '@/assets/showcase/mascot-cupcake.svg'
import keycap from '@/assets/showcase/mascot-keycap.svg'

/** Tap a mascot and it says its line. */
const LINES = {
  heart: 'Thanks for stopping by! 💛',
  cupcake: 'Treat yourself to one more chapter.',
  keycap: 'Press B for Bookmarko.',
} as const
const speaking = ref<keyof typeof LINES | null>(null)
let speakTimer: number | undefined
function say(who: keyof typeof LINES) {
  speaking.value = who
  track(`mascot_${who}`, '')
  clearTimeout(speakTimer)
  speakTimer = window.setTimeout(() => (speaking.value = null), 2600)
}

// Simple stroke icons (24×24, drawn with currentColor).
const ICONS: Record<SocialItem['id'], string> = {
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/>',
  tiktok: '<path d="M14 3v11.5a4 4 0 1 1-4-4"/><path d="M14 3c0 3 2.2 5 5 5"/>',
  youtube: '<rect x="2" y="5" width="20" height="14" rx="4"/><path d="M10 9l5 3-5 3z" fill="currentColor"/>',
  x: '<path d="M4 4l16 16M20 4L4 20"/>',
  linkedin: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v7M12 17v-7M12 13.5a2.5 2.5 0 0 1 5 0V17"/><circle cx="8" cy="7" r=".6" fill="currentColor"/>',
  github: '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>',
  threads: '<circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/>',
  email: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 6L2 7"/>',
}

/** Hand-stacked look: each book sits a little off-square. Deterministic, so it doesn't jump on reload. */
const TILTS = [-0.8, 0.6, -0.4, 0.9, -0.6, 0.3]
const SHIFTS = [-6, 8, -2, 5, -8, 3]
function bookStyle(link: LinkItem, i: number) {
  return {
    '--spine': link.spine,
    '--tilt': `${TILTS[i % TILTS.length]}deg`,
    '--shift': `${SHIFTS[i % SHIFTS.length]}px`,
    '--delay': `${120 + i * 90}ms`,
  }
}

function isExternal(url: string) {
  return /^https?:\/\//.test(url)
}

function track(linkId: string, url: string) {
  window.gtag?.('event', 'link_click', { link_id: linkId, link_url: url, surface: 'link_page' })
}

const shareLabel = 'Share this page'
const toast = ref('')
let toastTimer: number | undefined
function showToast(msg: string) {
  toast.value = msg
  clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => (toast.value = ''), 2200)
}

async function share() {
  const url = window.location.origin + window.location.pathname
  track('share', url)
  if (navigator.share) {
    try {
      await navigator.share({ title: profile.name, text: profile.bio, url })
    } catch {
      /* user dismissed the sheet */
    }
    return
  }
  try {
    await navigator.clipboard.writeText(url)
    showToast('Link copied ✨')
  } catch {
    showToast(url)
  }
}
</script>

<style scoped>
.lp {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: var(--paper);
  padding: 56px 16px 40px;
}


.col {
  position: relative;
  z-index: 1;
  max-width: 480px;
  margin: 0 auto;
}

/* ── Share ── */
.share {
  position: absolute;
  top: -36px;
  right: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-soft);
  color: var(--ink);
}
.share svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.share:hover { transform: translateY(-2px); }

/* ── Profile ── */
.profile { text-align: center; }

.polaroid {
  position: relative;
  display: inline-block;
  padding: 8px 8px 22px;
  background: #fff;
  border-radius: 6px;
  box-shadow: var(--shadow-warm);
  transform: rotate(-3deg);
  animation: drop 0.7s cubic-bezier(0.2, 1.4, 0.4, 1) both;
}
.polaroid img {
  display: block;
  width: 112px;
  height: 112px;
  object-fit: cover;
  border-radius: 3px;
}
/* ── Foreground mascots: tap for a line ── */
.buddy {
  position: absolute;
  z-index: 2;
  padding: 0;
  background: none;
  border-radius: 12px;
  transition: transform 0.25s cubic-bezier(0.2, 1.4, 0.4, 1);
}
.buddy img { display: block; width: 100%; height: auto; pointer-events: none; }
.buddy:hover { transform: rotate(-6deg) scale(1.06); }
.buddy:active { transform: scale(0.94); }
.buddy:focus-visible { outline: 3px solid var(--accent-soft); outline-offset: 2px; }

.bubble {
  position: absolute;
  bottom: 100%;
  left: 50%;
  width: max-content;
  max-width: 190px;
  padding: 8px 12px;
  border-radius: 14px;
  background: var(--ink);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 600;
  line-height: 1.3;
  text-align: center;
  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, 6px) scale(0.9);
  transition: opacity 0.2s, transform 0.25s cubic-bezier(0.2, 1.4, 0.4, 1);
}
.bubble.show { opacity: 1; transform: translate(-50%, -4px) scale(1); }

/* Heart is stuck on the polaroid's corner like a sticker. */
.heart { width: 60px; top: -22px; right: -30px; transform: rotate(12deg); }
.heart:hover { transform: rotate(4deg) scale(1.06); }
.heart .bubble { left: auto; right: 0; transform: translate(0, 6px) scale(0.9); }
.heart .bubble.show { transform: translate(0, -4px) scale(1); }

/* Cupcake sits on top of the stack of books. */
.stack-wrap { position: relative; }
.cupcake { width: 62px; top: -62px; right: 18px; }
.cupcake .bubble { left: auto; right: 0; transform: translate(0, 6px) scale(0.9); }
.cupcake .bubble.show { transform: translate(0, -4px) scale(1); }

/* Keycap perches on the corner of the letter card: letters get typed. */
.keycap { width: 58px; top: -30px; left: -14px; transform: rotate(-10deg); }
.keycap .bubble { left: 0; transform: translate(0, 6px) scale(0.9); }
.keycap .bubble.show { transform: translate(0, -4px) scale(1); }

.name {
  margin-top: 18px;
  font-family: 'EB Garamond', Georgia, serif;
  font-size: 2.1rem;
  font-weight: 600;
  line-height: 1.1;
  color: var(--ink);
}
.bio {
  margin: 8px auto 0;
  max-width: 34ch;
  color: var(--ink-soft);
  font-size: 0.98rem;
}

.socials {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
}
.socials a {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  color: var(--ink);
  background: #fff;
  border: 1px solid var(--line);
  transition: transform 0.2s, color 0.2s;
}
.socials a:hover { transform: translateY(-2px) rotate(-4deg); color: var(--accent); }
.socials svg { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }

/* ── Currently reading ── */
.reading {
  display: grid;
  gap: 2px;
  margin: 24px auto 0;
  padding: 14px 18px;
  border-radius: 14px;
  background: var(--accent-tint);
  border: 1px dashed var(--accent-soft);
  text-decoration: none;
  color: var(--ink);
  text-align: center;
}
.reading-kicker { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--accent-deep); }
.reading-title { font-family: 'EB Garamond', Georgia, serif; font-size: 1.2rem; font-weight: 600; }
.reading-author { font-size: 0.85rem; color: var(--ink-mute); }

/* ── Stack of books ── */
.stack {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 32px;
}
.stack li {
  transform: translateX(var(--shift)) rotate(var(--tilt));
  animation: drop 0.6s cubic-bezier(0.2, 1.3, 0.4, 1) both;
  animation-delay: var(--delay);
}

.book {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 68px;
  border-radius: 6px 10px 10px 6px;
  background: #fff;
  text-decoration: none;
  color: var(--ink);
  box-shadow: 0 2px 0 rgba(20, 25, 58, 0.08), 0 10px 22px -14px rgba(20, 25, 58, 0.35);
  border: 1px solid var(--line);
  overflow: hidden;
  transition: transform 0.25s cubic-bezier(0.2, 1.2, 0.4, 1), box-shadow 0.25s;
}
.book:hover,
.book:focus-visible {
  transform: translateX(10px) rotate(calc(var(--tilt) * -1));
  box-shadow: 0 2px 0 rgba(20, 25, 58, 0.08), 0 18px 30px -16px rgba(20, 25, 58, 0.45);
  outline: none;
}
.book:focus-visible { box-shadow: 0 0 0 3px var(--accent-soft); }
.book:active { transform: translateX(6px) scale(0.99); }

.spine {
  align-self: stretch;
  flex: 0 0 56px;
  display: grid;
  place-items: center;
  font-size: 1.4rem;
  background:
    linear-gradient(90deg, rgba(0, 0, 0, 0.18), transparent 18%, transparent 82%, rgba(0, 0, 0, 0.12)),
    var(--spine);
  /* two gilded bands, like a hardcover spine */
  box-shadow: inset 0 10px 0 -7px rgba(255, 255, 255, 0.45), inset 0 -10px 0 -7px rgba(255, 255, 255, 0.45);
}

.cover {
  flex: 1;
  display: grid;
  gap: 1px;
  padding: 12px 16px;
  min-width: 0;
}
.title {
  font-family: 'EB Garamond', Georgia, serif;
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.2;
}
.subtitle {
  font-size: 0.82rem;
  color: var(--ink-mute);
  line-height: 1.35;
}

.tag {
  flex: none;
  margin-right: 18px;
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  background: var(--pink-tint);
  color: var(--pink-deep);
  transform: rotate(4deg);
}

/* page edges on the fore-edge */
.pages {
  align-self: stretch;
  flex: 0 0 8px;
  background: repeating-linear-gradient(180deg, #fff 0 2px, #E8ECF4 2px 3px);
  border-left: 1px solid var(--line);
}

/* bookmark ribbon that peeks out on hover */
.mark {
  position: absolute;
  top: -2px;
  right: 30px;
  width: 12px;
  height: 0;
  background: var(--spine);
  clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 75%, 0 100%);
  transition: height 0.25s cubic-bezier(0.2, 1.4, 0.4, 1);
}
.book:hover .mark,
.book:focus-visible .mark { height: 26px; }

.shelf {
  height: 12px;
  margin: 6px -10px 0;
  border-radius: 3px;
  background: linear-gradient(180deg, #C9A57A, #A47C52);
  box-shadow: 0 10px 18px -10px rgba(80, 50, 20, 0.55);
}

/* ── Newsletter ── */
.letter {
  position: relative;
  /* NewsletterForm reads these; Newsletter.vue defines them for its own page. */
  --nl-ink: var(--ink);
  --nl-accent: var(--pink);
  --nl-mute: var(--ink-mute);
  margin-top: 40px;
  padding: 24px 20px;
  border-radius: 18px;
  background: #fff;
  border: 1px solid var(--line);
  box-shadow: var(--shadow-soft);
  text-align: center;
}
.letter-title {
  font-family: 'EB Garamond', Georgia, serif;
  font-size: 1.5rem;
  font-weight: 600;
}
.letter-sub {
  margin: 4px 0 14px;
  font-size: 0.9rem;
  color: var(--ink-soft);
}

.made {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin: 32px auto 0;
  font-size: 0.82rem;
  color: var(--ink-mute);
  text-decoration: none;
}
.made:hover { color: var(--accent); }
.made img { border-radius: 4px; }

.toast {
  position: fixed;
  left: 50%;
  bottom: 24px;
  transform: translate(-50%, 20px);
  padding: 10px 18px;
  border-radius: 999px;
  background: var(--ink);
  color: #fff;
  font-size: 0.9rem;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s, transform 0.2s;
  max-width: calc(100% - 32px);
  overflow-wrap: anywhere;
}
.toast.show { opacity: 1; transform: translate(-50%, 0); }


@keyframes drop {
  from { opacity: 0; translate: 0 -24px; }
  to { opacity: 1; translate: 0 0; }
}

@media (prefers-reduced-motion: reduce) {
  .polaroid,
  .stack li { animation: none; }
  .book, .mark { transition: none; }
}
</style>
