/**
 * One-off image optimiser. See scripts/optimize-images.md.
 *
 * Every source image was shipped at its original resolution — book covers up
 * to 3000px wide for a 168px slot, and a 2000x2000 logo for a 36px navbar
 * mark. This writes a WebP copy of each at the size it is actually displayed
 * (2x, for retina). It never deletes the originals; removing them is a
 * separate, deliberate step once the new files are wired up.
 *
 * Run with: npm i -D sharp && node scripts/optimize-images.mjs
 */
import { readdir, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ASSETS = fileURLToPath(new URL('../src/assets/', import.meta.url))
const PUBLIC = fileURLToPath(new URL('../public/', import.meta.url))

/** [file, target width]. Widths are 2x the largest CSS size the asset renders at. */
const SINGLES = [
  ['bookmarkoLogo.png', 160], // 36px navbar mark, 72px blog badge
  ['bookmarkoLogo-mark.png', 128], // 28px footer mark
  ['bookL.png', 224], // 112px chip
  ['goodL.png', 224], // 112px chip
  ['ginie-lamp.png', 256],
]

/** Book covers render in a 168px column (112px on mobile). */
const COVER_WIDTH = 400

const kb = (n) => `${Math.round(n / 1024)}KB`

async function convert(src, dest, width) {
  const before = (await stat(src)).size
  await sharp(src).resize({ width, withoutEnlargement: true }).webp({ quality: 80 }).toFile(dest)
  const after = (await stat(dest)).size
  console.log(`  ${path.basename(src).padEnd(28)} ${kb(before).padStart(7)} → ${kb(after).padStart(6)}`)
  return [before, after]
}

let saved = 0
let total = 0

console.log('Book covers:')
const booksDir = path.join(ASSETS, 'Books')
for (const file of (await readdir(booksDir)).filter((f) => f.endsWith('.jpg'))) {
  const src = path.join(booksDir, file)
  const [b, a] = await convert(src, src.replace(/\.jpg$/, '.webp'), COVER_WIDTH)
  total += b
  saved += b - a
}

console.log('\nLogos and chips:')
for (const [file, width] of SINGLES) {
  const src = path.join(ASSETS, file)
  const [b, a] = await convert(src, src.replace(/\.png$/, '.webp'), width)
  total += b
  saved += b - a
}

// The OG image stays PNG: several social scrapers still don't accept WebP.
console.log('\nSocial card:')
{
  const src = path.join(PUBLIC, 'og-welcome.png')
  const before = (await stat(src)).size
  const buf = await sharp(src).resize({ width: 1200 }).png({ compressionLevel: 9, palette: true }).toBuffer()
  await writeFile(src, buf)
  console.log(`  og-welcome.png               ${kb(before).padStart(7)} → ${kb(buf.length).padStart(6)}`)
  total += before
  saved += before - buf.length
}

console.log(`\n${kb(total)} → ${kb(total - saved)}  (saved ${kb(saved)}, ${Math.round((saved / total) * 100)}%)`)
