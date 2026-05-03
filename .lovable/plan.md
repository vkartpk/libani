# TechZone — Phase 2 Build

Phase 1 shipped the storefront, content pages, and real auth. Phase 2 adds the deferred items: a full account dashboard backed by real orders, product compare, and a dark/light theme toggle.

---

## Scope

1. **Account dashboard** at `/account` (replaces the current `/account → /auth` redirect for signed-in users)
2. **Real order persistence** — checkout writes to the database; orders show up in the account dashboard and Track Order
3. **Product compare** — pick up to 4 products, compare side-by-side
4. **Dark / light theme toggle** in the header, persisted per user

---

## 1. Account dashboard

Route: `/account` (protected — redirects to `/auth` if signed out).

Layout: left sidebar nav + right content panel (uses shadcn `Sidebar`). On mobile, sidebar collapses to a top tab bar.

Tabs / sections:
- **Overview** — greeting, recent order, wishlist count, quick links
- **Orders** — table of orders (number, date, total, status, items count) with row → order detail drawer (line items, address, payment method, status timeline)
- **Profile** — edit name, phone, avatar (avatar upload to a `avatars` storage bucket)
- **Addresses** — list + add/edit/delete saved shipping addresses (used to prefill checkout)
- **Security** — change password (`supabase.auth.updateUser({ password })`), sign out everywhere

Header account icon: when signed in, opens a dropdown with links to Overview / Orders / Wishlist / Sign out instead of going straight to `/auth`.

---

## 2. Real order persistence

New tables (with RLS — users only see their own):

`orders`
```
id uuid pk
user_id uuid (nullable — guest checkout allowed)
order_number text unique  -- TZ-XXXXXX
email text
phone text
subtotal numeric, shipping numeric, discount numeric, total numeric
coupon_code text
payment_method text  -- cod | bank | jazzcash | easypaisa
shipping_address jsonb
status text default 'placed'  -- placed | processing | shipped | out_for_delivery | delivered | cancelled
created_at, updated_at
```

`order_items`
```
id uuid pk
order_id uuid fk → orders
product_id text, product_slug text, product_name text, product_image text
variant_label text
unit_price numeric, quantity int, line_total numeric
```

`addresses`
```
id uuid pk
user_id uuid fk → auth.users
label text  -- Home / Office / etc.
full_name text, phone text
line1, line2, city, province, postal_code text
is_default bool
created_at
```

RLS:
- `orders`: insert allowed for `auth.uid() = user_id` OR `user_id IS NULL` (guest); select/update only own rows
- `order_items`: select/insert via parent order ownership
- `addresses`: full CRUD on own rows

Checkout step 3 now actually inserts the order + items, returns the real `order_number`. Track Order page queries by `order_number` + email/phone.

Storage bucket `avatars` (public read, owner-only write) for profile avatars.

---

## 3. Product compare

- Compare button on `ProductCard` and product detail page (heart-style icon next to wishlist)
- `CompareContext` (localStorage) — max 4 products, toast when full
- Floating compare bar appears bottom-right when 1+ items selected, with thumbnails and "Compare (n)" CTA
- `/compare` page: side-by-side table — image, name, price, rating, brand, key specs (extracted from `product.specs`), in-stock, add-to-cart per column, remove column button
- Mobile: horizontal scroll with sticky first column (attribute names)

---

## 4. Dark / light theme toggle

- `ThemeContext` reads from `localStorage` (`techzone-theme`) with `prefers-color-scheme` fallback
- Adds/removes `light` class on `<html>`; existing tokens already use HSL semantic vars — add a `:root.light { ... }` block to `src/index.css` with the light palette (white bg, near-black fg, same red primary, lighter borders/cards)
- Toggle button (sun/moon icon) in header secondary nav, also surfaced in account → Profile
- All existing components keep using semantic tokens — no per-component changes needed

---

## Build order

1. Migrations: `orders`, `order_items`, `addresses` tables + RLS + `avatars` bucket
2. `ThemeContext` + light palette in `index.css` + header toggle
3. `CompareContext` + ProductCard compare button + floating bar + `/compare` page
4. `AccountLayout` (protected route + sidebar) and tab pages: Overview, Orders, Profile, Addresses, Security
5. Hook checkout into `orders`/`order_items` insert; address-step uses saved addresses dropdown
6. Track Order page: replace mock with real query
7. Header account dropdown when signed in
8. QA: 375px mobile pass, light-mode pass on every page, end-to-end order flow as guest + signed-in

---

## Notes

- No new external deps needed — all UI uses existing shadcn components
- Guest checkout still works; orders without `user_id` are accessible only via order_number + email match on Track Order
- Existing `profiles` table is reused for name/phone/avatar; no schema change there beyond `avatar_url` (already present)
