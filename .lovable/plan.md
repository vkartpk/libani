
# TechZone E-Commerce — Phase 1 Build

A dark-themed, red-accented tech accessories storefront with full shopping flow, content pages, and real authentication via Lovable Cloud. Account dashboard, product compare, and dark/light toggle are explicitly deferred to Phase 2.

---

## Scope

**In this build (Phase 1):**
- Design system, global layout (announcement bar, header w/ mega menu, footer, mobile bottom nav)
- Homepage with all 15 sections
- Product listing, category, brand, and search pages with filters
- Product detail page with variants, tabs, related/recently viewed
- Cart page + slide-in cart drawer
- Checkout flow (3 steps) with mock order confirmation
- Wishlist page
- Track Order page (mock)
- About, Contact, FAQ, 4 Policy pages
- Blog list + blog post pages
- Brand detail pages
- 404 page
- Real auth via Lovable Cloud (email/password + Google) — **login/signup only**, gating wishlist sync optional
- SEO (react-helmet-async, JSON-LD, semantic HTML)
- Mock data: 40+ products, 22 brands, 6 blog posts

**Deferred to Phase 2 (after this ships):**
- /account dashboard (orders, profile, addresses tabs)
- Product compare feature
- Dark/light mode toggle (dark only for now)
- Real order persistence (currently mock confirmation)

---

## Design system

Tokens written to `src/index.css` and `tailwind.config.ts` as HSL semantic variables:

```text
--background     0 0% 5%       (#0D0D0D)
--card           0 0% 10%      (#1A1A1A)
--surface        0 0% 13%      (#222222)
--foreground     0 0% 100%
--muted-fg       0 0% 67%      (#AAAAAA)
--border         0 0% 20%      (#333333)
--primary        355 78% 56%   (#E63946)  red accent
--success        142 71% 45%   (#22C55E)
--radius-card    8px
--radius-btn     4px
```

Fonts loaded in `index.html`: Syne (headings), DM Sans (body). Tabular-nums utility for prices. Reusable utilities: `.lift-hover`, `.shimmer`, `.fade-in-page`.

---

## Routes (react-router-dom v6, all lazy-loaded)

```
/                       Homepage
/products               Shop / all products
/products/:slug         Product detail
/category/:slug         Category collection
/brand/:slug            Brand collection
/gaming/:slug           Gaming subcategory
/cart                   Cart page
/checkout               Checkout (3-step wizard)
/track-order            Track order
/wishlist               Wishlist
/search?q=              Search results
/about                  About us
/contact                Contact
/faq                    FAQ
/blog                   Blog list
/blog/:slug             Blog post
/policies/refund        Refund policy
/policies/privacy       Privacy policy
/policies/terms         Terms of service
/policies/shipping      Shipping policy
/auth                   Login / Sign up (replaces /account in phase 1)
*                       404
```

---

## Mock data

`src/data/products.ts` — 40+ products spanning all listed categories (Routers, TWS, Headphones, Mouse, Keyboard, Power Banks, Gaming gear, Cables, etc.), each with full schema (variants, specs, ratings, badges, picsum image URLs seeded by id for stable images).

`src/data/brands.ts` — 22 brands (TP-Link, Tenda, Joyroom, Amaze, Lenovo, Redragon, HyperX, etc.) with logo, description, banner.

`src/data/blogPosts.ts` — 6 posts with HTML content, tags, author, cover image.

`src/data/categories.ts` — Category tree powering mega menus and category showcase grid.

---

## Global state (Context + localStorage)

- `CartContext` — items, add/remove/update qty, totals, coupon (`SAVE10` = 10% off), free-shipping progress
- `WishlistContext` — toggle, list, count
- `RecentlyViewedContext` — last 10 product ids
- `AuthContext` — wraps Supabase session (real auth)
- All localStorage access goes through a `safeStorage` wrapper with try/catch

---

## Global components

- `AnnouncementBar` — dismissible red marquee
- `Header` — sticky w/ backdrop blur, secondary nav (phone/email), logo, mega menu (Categories, Gaming, Brands), search w/ autocomplete dropdown + recent searches, wishlist/cart badges, account icon
- `MobileNav` — full-screen drawer w/ accordion
- `BottomNav` — mobile-only fixed bar (Home, Categories, Search, Cart, Account)
- `Footer` — 3-col + trust badges row + payment icons
- `ProductCard` — image crossfade on hover, badges, swatches, wishlist heart, quick-view, add-to-cart
- `CartDrawer` (shadcn Sheet) — slide-in summary w/ free-shipping progress
- `QuickViewModal` (shadcn Dialog)
- `SearchOverlay` — debounced 300ms, real-time results
- `Breadcrumbs` — schema.org BreadcrumbList JSON-LD
- `ShimmerCard` — skeleton loader for grids
- `BackToTop`, `CookieConsent`
- Toasts via `sonner`

---

## Homepage sections (15)

1. Hero slider (3 slides, autoplay 4s, dots + arrows)
2. Trust badges row
3. Top brands marquee
4. Featured product spotlight
5. Flash sale w/ countdown timer
6. Amaze brand collection (10 products)
7. Shop by category icon grid
8. Joyroom brand collection
9. Gaming CTA banner
10. Lenovo audio collection
11. Weekly picks w/ tabbed filter (All/Audio/Accessories/Gaming/Power)
12. LDNIO collection
13. TP-Link collection
14. Testimonials (3 cards)
15. Newsletter banner

---

## Listing / collection pages

Shared `<ProductGrid>` + `<FilterSidebar>`:
- Price range (shadcn Slider), brand checkboxes, category checkboxes, availability, rating, sort
- Active filter pills, count, grid/list toggle, pagination
- Mobile: filter drawer (Sheet)
- Memoized filter/sort logic
- Empty state w/ suggestions

`/category/:slug`, `/brand/:slug`, `/gaming/:slug`, `/search` all reuse this with pre-applied filters.

---

## Product detail page

- Image gallery w/ thumbnail strip, hover zoom, fullscreen on click
- Variant selectors (color swatches, size buttons), per-variant stock state
- Quantity stepper, Add to Cart, Add to Wishlist, share buttons
- Delivery info row, feature highlights
- Tabs: Description / Specs table / Reviews (mock + write-review form)
- Related products (same category) + Recently Viewed strip
- Sticky mobile add-to-cart bar
- Out-of-stock state w/ "Notify Me" email field
- JSON-LD Product schema

---

## Cart & checkout

- `/cart`: line items table, qty steppers, coupon (`SAVE10`), order summary (subtotal, shipping rule Rs.1000, discount, total)
- `/checkout`: 3-step wizard w/ step indicator
  - Step 1: contact + Pakistan address form (zod validation, `03XX-XXXXXXX` phone regex)
  - Step 2: payment method radios (COD / Bank Transfer / JazzCash / EasyPaisa) + sticky summary
  - Step 3: success screen w/ generated order number, link to track order
- All forms validated client-side with zod + react-hook-form

---

## Track order

Centered card. Submitting any order number + email/phone shows mock timeline (Placed ✓ → Processing ✓ → Shipped (active) → Out for Delivery → Delivered) w/ icons and timestamps.

---

## Content pages

- **About** — hero, story, stats row, why-choose-us cards, brand strip, map placeholder, newsletter
- **Contact** — form (name/email/phone/subject/message, zod-validated) + info column
- **FAQ** — shadcn Accordion grouped by 4 categories from spec; FAQPage JSON-LD
- **Policies** (4 pages) — shared layout w/ left sidebar nav + content
- **Blog list** — featured posts + filterable grid (All/Reviews/Guides/News/Tips)
- **Blog post** — cover, meta, DOMPurify-sanitized HTML, auto TOC from H2/H3, related posts, mock comments, share; Article JSON-LD

---

## Authentication (Lovable Cloud)

- Enable Lovable Cloud, configure email/password + Google sign-in
- `/auth` page w/ Login and Sign-up tabs (email, password, name, phone)
- "Forgot password" → `resetPasswordForEmail` w/ `/reset-password` page (required)
- `AuthContext` uses `onAuthStateChange` listener set up **before** `getSession()`
- Header account icon: not logged in → links to `/auth`; logged in → shows email + sign-out
- Profiles table created (id FK to auth.users, name, phone) w/ RLS (user can read/update own row) + trigger to auto-create on signup
- Phase 2 will add the full /account dashboard

No roles table needed in Phase 1 (no admin features).

---

## SEO

- `react-helmet-async` provider in `App.tsx`
- Per-page `<SEO>` component sets title, description, canonical, OG tags, Twitter card
- JSON-LD injected for: Organization + WebSite (homepage), Product (product pages), Article (blog), FAQPage (FAQ), BreadcrumbList (all inner pages)
- Semantic HTML (`<main>`, `<article>`, `<nav>`, `<aside>`), single H1 per page, alt text everywhere, aria-labels on icon buttons
- All images `loading="lazy"` with explicit width/height

---

## Performance

- `React.lazy` + `<Suspense fallback={<ShimmerCard/>}>` for every route
- Debounced search (300ms)
- `useMemo` on filter/sort, `useCallback` on handlers
- Picsum URLs sized per use (thumbnails 400px, detail 1000px)
- Page-transition fade via CSS on route change

---

## Security

- DOMPurify on blog HTML before render
- zod schemas on every form, escape/encode user input on search page
- Supabase RLS on profiles table, never store roles client-side
- No secrets in frontend
- UI-only "too many attempts" lockout on login form
- CSP recommendation comment in `index.html`

---

## Mobile

- Mobile-first Tailwind classes throughout
- Bottom nav (Home/Categories/Search/Cart/Account)
- 44×44 min tap targets, swipeable carousels (embla, already in shadcn)
- Sticky add-to-cart bar on product detail
- Filter drawer via Sheet
- Hamburger full-screen overlay

---

## Dependencies to add

- `react-helmet-async` — SEO
- `react-hook-form` + `zod` + `@hookform/resolvers` — forms (likely already present via shadcn)
- `dompurify` + `@types/dompurify` — sanitize blog HTML
- `embla-carousel-react` — hero slider, brand marquee (already used by shadcn carousel)
- `@supabase/supabase-js` — auth (Lovable Cloud)

---

## Build order

1. Design tokens, fonts, base layout shell (header/footer/announcement/bottom nav)
2. Mock data files (products, brands, blog, categories)
3. Contexts (cart, wishlist, recently viewed) + storage wrapper
4. ProductCard, ShimmerCard, CartDrawer, SearchOverlay, QuickView
5. Homepage (all 15 sections)
6. Listing/category/brand/search pages w/ filter sidebar
7. Product detail page
8. Cart + checkout wizard + track order
9. Wishlist page
10. Content pages: About, Contact, FAQ, 4 policies, Blog list & post, 404
11. Lovable Cloud setup + /auth page + profiles table + reset-password page
12. SEO pass: helmet, JSON-LD, semantics, alt text
13. Polish: page transitions, back-to-top, cookie banner, mobile QA at 375px

After this ships I'll follow up with Phase 2 (account dashboard, compare, light mode).
