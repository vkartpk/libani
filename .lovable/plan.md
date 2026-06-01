## Problem

Hero slider and the gaming banner use random `picsum.photos` placeholder images that have nothing to do with the products sold (gaming gear, chargers/power banks, audio). They look generic and unrealistic.

## Fix

Generate 4 product-relevant photo-real images with the agent's premium image tool and wire them into the existing components.

### Images to generate (saved to `src/assets/`)

1. `hero-gaming.jpg` — Dark moody gaming desk setup: RGB mechanical keyboard, gaming mouse, headset on a black desk with red/magenta RGB glow. Matches "Level Up Your Setup" slide.
2. `hero-power.jpg` — Clean product shot of a 20,000 mAh power bank, USB-C cables and a fast wall charger on a dark gradient surface. Matches "Stay Connected, Stay Charged" slide.
3. `hero-audio.jpg` — Premium TWS earbuds in open charging case + over-ear headphones, dark studio lighting with subtle blue rim light. Matches "Sound That Moves You" slide.
4. `gaming-banner.jpg` — Wide cinematic banner: gaming chair, monitor with neon game scene, mechanical keyboard + mouse, RGB ambient lighting. Used as background for the "Gaming Setup" CTA section.

### Code changes

- `src/components/home/HeroSlider.tsx` — import the three new `hero-*.jpg` assets and replace the `picsum.photos` URLs in the `slides` array.
- `src/components/home/GamingBanner.tsx` — import `gaming-banner.jpg` and replace the picsum URL on the background `<img>`.

No layout, animation, or copy changes. No other components touched (FeaturedSpotlight, BrandCollection, ProductCard etc. already use real product images).

## Files touched

- new: `src/assets/hero-gaming.jpg`, `src/assets/hero-power.jpg`, `src/assets/hero-audio.jpg`, `src/assets/gaming-banner.jpg`
- edited: `src/components/home/HeroSlider.tsx`, `src/components/home/GamingBanner.tsx`