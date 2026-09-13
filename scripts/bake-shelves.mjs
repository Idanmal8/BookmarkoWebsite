/**
 * Bakes the 3D shelf scene to src/assets/shelf-{left,right}.webp.
 * See scripts/bake-shelves.md for the full procedure — this expects the dev
 * server to already be serving the 3D scene.
 */
import { chromium } from 'playwright-core'
import sharp from 'sharp'
import { homedir } from 'node:os'
import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const PAGE_URL = process.env.BAKE_URL ?? 'http://localhost:5173/'
const CHROME =
  process.env.BAKE_CHROME ??
  homedir() +
    '/Library/Caches/ms-playwright/chromium-1228/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'

const work = await mkdtemp(join(tmpdir(), 'shelf-bake-'))
const browser = await chromium.launch({ executablePath: CHROME })
// 3x for retina; 1600 tall so the art outlasts any viewport height.
const page = await browser.newPage({ viewport: { width: 1440, height: 1600 }, deviceScaleFactor: 3 })
await page.goto(PAGE_URL, { waitUntil: 'networkidle' })
await page.addStyleTag({
  content: `
    html, body, .app-wrapper, .app-wrapper.home { background: none !important; background-color: transparent !important; }
    .app-wrapper.home::before { display: none !important; }
    .nav, .cursor-root { display: none !important; }
    .hero__shelf, .hero__shelf .bk { -webkit-mask-image: none !important; mask-image: none !important; }
  `,
})
await page.waitForTimeout(3500) // let the entrance animation finish

for (const side of ['left', 'right']) {
  const clip = await page.locator(`.hero__shelf--${side} .bk`).boundingBox()
  const png = join(work, `shelf-${side}.png`)
  await page.screenshot({ path: png, clip, omitBackground: true })
  const out = new URL(`../src/assets/shelf-${side}.webp`, import.meta.url).pathname
  const info = await sharp(png).webp({ quality: 86, alphaQuality: 100, effort: 6 }).toFile(out)
  console.log(`${side}: ${info.width}x${info.height}, ${(info.size / 1024).toFixed(0)} KB -> ${out}`)
}

await browser.close()
