# Regenerating the hero shelf artwork

`src/assets/shelf-left.webp` and `shelf-right.webp` are baked from a live 3D
scene, `scripts/shelf-source/Bookshelf3D.vue`. That scene renders the corridor
as real DOM boxes in a CSS perspective context — around 1,800 elements — which
looks right but costs about 54ms per frame while scrolling, because a
`preserve-3d` context cannot be cached as a texture. Baking it to two images
drops that to roughly 9ms with no change to how it looks.

Edit the scene, not the images, then re-bake:

1. `npm i -D playwright-core sharp` (not kept as project deps — this runs rarely)
2. `cp scripts/shelf-source/Bookshelf3D.vue src/components/Bookshelf.vue`
3. In `Hero.vue`, pass `:shelves="14"` to both `<Bookshelf>` — the art is baked
   1600px tall so it crops rather than stretches, and 14 rows keeps the shelf
   pitch at roughly 112px, matching the design.
4. `npm run dev`, then `node scripts/bake-shelves.mjs`
5. `git checkout src/components/Bookshelf.vue src/components/Hero.vue`

The bake hides the navbar, the custom cursor, the hero's bottom fade and the
page background, so the images carry a real alpha channel and sit correctly on
the page gradient at any viewport height.
