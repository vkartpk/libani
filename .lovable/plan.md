## Goal

Replace every product image and the 3 homepage hero banners with fresh AI-generated visuals that actually match each product (name + brand + category).

## Scope

- **47 products** in the catalog — generate **1 polished studio shot per product** and set it as the product's image (replacing the existing 4-image array with a single, accurate image). Keeps the catalog visually consistent and avoids 188 generations.
- **3 hero slides** on the homepage (Gaming, Power & Charging, Premium Audio) — regenerate as wider 16:9 lifestyle banners.
- **Homepage banner components** that currently use category stock art (e.g. `GamingBanner`, category showcase tiles) — leave untouched unless they break; the user said "products + homepage visuals," and hero + product cards cover the visible homepage. Out of scope: brand logos, category tiles, blog images.

## Approach

### Product images (47)
Run a Node script (`scripts/regen-product-images.ts`) that:
1. Fetches all products from `public.products`.
2. For each product, builds a tight prompt: `"Professional studio product photograph of a {name}, {category} category, {brand} branding, centered on clean light-gray gradient background, soft shadows, e-commerce hero shot, 1:1, ultra-detailed, no text overlays"`.
3. Calls the Lovable AI Gateway image endpoint (`openai/gpt-image-2`, `quality: "low"`, non-streaming, 1024×1024).
4. Uploads the resulting PNG to the existing `product-images` bucket at `regen/{slug}.png` (public bucket → public URL).
5. Updates the row: `images = [public_url]`, `image_alts = [name]`.
6. Logs progress + writes a summary so failures can be retried.

Runs sequentially with a small delay to stay under rate limits. Re-runnable: if a slug already has `regen/{slug}.png`, it's overwritten.

### Hero slides (3)
Generate 3 16:9 (1536×864) banners directly into `src/assets/`, overwriting `hero-gaming.jpg`, `hero-power.jpg`, `hero-audio.jpg`. Prompts tuned to lifestyle product photography matching each slide's eyebrow/title. `HeroSlider.tsx` already imports these — no code change needed.

## Technical Notes

- Script auth: uses `SUPABASE_SERVICE_ROLE_KEY` + `LOVABLE_API_KEY` from sandbox env, run via `bun scripts/regen-product-images.ts`. No edge function needed — this is a one-time admin job.
- The `products` table already exposes `images text[]` + `image_alts text[]`; no schema change.
- `ProductsHydrator` + the live `products` subscription means the storefront picks up the new URLs without redeploy.
- Estimated cost: 47 product images + 3 hero images at low quality ≈ 50 image generations.

## Out of Scope

- Per-variant color swatches (variants array stays).
- Category showcase / brand collection / flash-sale background art.
- Multi-angle galleries (will revisit if you want 3-4 images per product after seeing results).

## Confirm before running

Reply "go" and I'll create the script, generate all 50 images, and update the database + hero assets.
