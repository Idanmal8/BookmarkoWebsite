# Re-optimising images

`src/assets` ships WebP at roughly 2x the size each image is actually displayed
at. This matters: the site previously served 16MB of images, almost all of it
wasted — `ACourt.jpg` was 3000px wide and 1.6MB for a 168px column, and
`bookmarkoLogo.png` was a 2000x2000 PNG for a 36px navbar mark. Page weight is
a ranking factor and those covers sit right under the hero, so they were
competing with it for bandwidth on the first paint.

`scripts/optimize-images.mjs` regenerates them. It is not part of the build —
it runs when art is added or replaced:

1. `npm i -D sharp` (not kept as a project dep; it is a large native module and
   nothing in `npm run build` needs it)
2. Drop the new source art into `src/assets/` at full resolution
3. `node scripts/optimize-images.mjs`
4. Point the imports at the `.webp` files, delete the originals
5. `npm uninstall sharp`

The script writes copies and never deletes, so a bad run costs nothing.

## Target widths

Widths live in the script next to a comment naming the CSS size they serve.
When a layout changes, update both together:

| Asset | Rendered at | Ships at |
|---|---|---|
| `Books/*.webp` | 168px column (112px mobile) | 400px |
| `bookmarkoLogo.webp` | 36px navbar, 72px blog badge | 160px |
| `bookmarkoLogo-mark.webp` | 28px footer | 128px |
| `bookL.webp`, `goodL.webp` | 112px chip | 224px |
| `ginie-lamp.webp` | — | 256px |

`public/og-welcome.png` deliberately stays PNG at 1200x630 — several social
scrapers still won't accept WebP, and this is the image they fetch.

`shelf-left.webp` / `shelf-right.webp` are not handled here. They are baked
artwork with their own pipeline — see `bake-shelves.md`.

## Recovering an original

The full-resolution sources are in git history, removed in the commit that
introduced this script:

```bash
git log --diff-filter=D --oneline -- src/assets/Books
git show <sha>^:src/assets/Books/ACourt.jpg > ACourt.jpg
```
