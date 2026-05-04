
# TechZone — Phase 3 Build

Phase 3 closes out the storefront with three deferred items: move the product catalog into the database, ship a role-gated admin dashboard, and send real branded emails for orders and account events.

---

## Scope

1. **Catalog in the database** — `categories`, `brands`, `products`, `product_variants`
2. **Roles + admin dashboard** at `/admin` — orders, products, categories, customers
3. **Branded auth + transactional emails** — order placed, status updates, contact form ack, custom password reset / verification

---

## 1. Catalog migration

New tables (RLS: public `SELECT` on active rows; admin-only `INSERT/UPDATE/DELETE`):

`categories` — `id`, `slug` (unique), `name`, `description`, `image_url`, `parent_slug`, `sort_order`, `is_active`
`brands` — `id`, `slug` (unique), `name`, `logo_url`, `description`, `is_active`
`products` — `id`, `slug` (unique), `name`, `brand_slug`, `category_slug`, `subcategory_slug`, `price`, `compare_at_price`, `description`, `features` (jsonb array), `specs` (jsonb), `tags` (text[]), `images` (text[]), `is_featured`, `is_new_arrival`, `is_on_sale`, `in_stock`, `rating`, `review_count`, `created_at`
`product_variants` — `id`, `product_id` fk, `label`, `type` (color|storage|size), `value`, `in_stock`, `sort_order`

**Seeding**: one-time SQL migration that inserts every row currently in `src/data/products.ts`, `categories.ts`, `brands.ts` (generated from a script — not hand-typed). After seeding, `src/data/*.ts` is removed and replaced with `src/data/queries.ts` exposing typed `useProducts`, `useProduct(slug)`, `useCategories`, `useBrands` hooks built on TanStack Query + Supabase.

**All consumer pages migrate**: Home (FlashSale, WeeklyPicks, FeaturedSpotlight, BrandStrip, CategoryShowcase), Products list, ProductDetail, CategoryPage, BrandPage, SearchPage, Wishlist, Compare, Cart, Checkout. The existing `Product` shape stays the same so component code barely changes — only the data source.

Cart/Wishlist/Compare keep storing minimal `{id, slug, name, image, price, variant}` snapshots in localStorage so they survive product edits.

---

## 2. Roles + admin dashboard

**Roles** (per the user-roles best practice — separate table + `has_role` security definer):

```
type app_role enum ('admin','customer')
table user_roles (id, user_id fk auth.users, role app_role, unique(user_id, role))
function public.has_role(_user_id uuid, _role app_role) returns boolean security definer
function public.is_admin() returns boolean -> has_role(auth.uid(),'admin')
```

`handle_new_user` trigger also inserts `('customer')` for every new signup. Admin promotion is done manually via the Cloud DB tools — no UI to self-promote.

RLS on the new catalog tables uses `is_admin()` for write access; public can `SELECT` where `is_active = true`. Existing `orders` / `order_items` / `addresses` policies get an additional `admin can select all` policy gated on `is_admin()`.

**Route**: `/admin/*` protected — redirects to `/` if `!is_admin()`. Sidebar layout (mirrors AccountLayout) with sections:

- **Dashboard** — KPI cards (orders today, revenue 30d, low stock, new customers), recent orders table, top products
- **Orders** — paginated table with status filter; row drawer mirrors customer order detail plus a status dropdown (placed → processing → shipped → out_for_delivery → delivered → cancelled). Saving status triggers an email (see §3).
- **Products** — table with search + filters; create/edit dialog (name, slug auto, brand, category, price, compare-at, description, features list, specs k/v, image URLs, flags, in-stock toggle); variant subgrid; bulk delete; CSV export
- **Categories** — list + add/edit/reorder (drag handle updates `sort_order`); soft-delete via `is_active`
- **Brands** — same pattern as categories
- **Customers** — paginated list joining `auth.users` (via a SECURITY DEFINER `admin_list_users()` RPC) with `profiles` and order count/total; row drawer shows profile, addresses, orders, and a "Make admin / Remove admin" toggle

Header: when `is_admin()`, the account dropdown gets an "Admin dashboard" link.

---

## 3. Email notifications

**Domain + infra**: prompts the user to set up an email sender domain (one-click dialog), then Lovable Cloud handles auth+transactional infrastructure automatically.

**Auth emails** (custom branded templates via the auth-email-hook):
- Signup verification, password reset, magic link, email change, reauthentication, invite — all 6 templates restyled to match TechZone (red `#E11D48` primary, dark headings, white body, footer with brand mark)

**Transactional templates** (registered in the transactional registry):
- `order-placed` — sent from Checkout right after the `orders` insert. Subject: `Order TZ-XXXXXX confirmed`. Body: thanks, order summary table, shipping address, total, "Track order" button → `/track-order?number=...`
- `order-status-update` — sent from the admin Orders status dropdown. Subject and body adapt to status (`processing`, `shipped`, `out_for_delivery`, `delivered`, `cancelled`); `delivered` adds a "leave a review" CTA back to the product
- `contact-form` — sent when the Contact page form is submitted. Goes to the submitter (ack) only — no admin-side bulk send

Idempotency keys derived from `order.id + status` and `contact_submission.id` so retries are safe.

A new `contact_submissions` table (`id, name, email, subject, message, created_at`) is added to support the contact-form trigger and let admins read submissions in the Customers area later.

---

## Build order

1. Migration: `categories`, `brands`, `products`, `product_variants` tables + RLS + admin write policies; seed all current data
2. Migration: `app_role` enum, `user_roles`, `has_role`, `is_admin`, `admin_list_users` RPC; update `handle_new_user` to also insert `customer` role; admin SELECT policies on `orders`/`order_items`/`addresses`
3. Migration: `contact_submissions` table + RLS (insert anyone, select admin)
4. `src/data/queries.ts` + delete `products.ts`/`categories.ts`/`brands.ts`; update every consumer to use the new hooks; add lightweight loading skeletons where the data is now async
5. `useUserRole` hook + protected `/admin` route + `AdminLayout`
6. Admin pages in order: Orders → Products → Categories → Brands → Customers → Dashboard
7. Wire up email sender domain dialog; once set, scaffold auth email templates (branded), scaffold transactional infra
8. Create `order-placed`, `order-status-update`, `contact-form` templates + register them
9. Invoke `send-transactional-email` from Checkout (order-placed), Admin Orders status save (order-status-update), Contact form (contact-form + insert into `contact_submissions`)
10. QA: end-to-end as guest + signed-in customer + admin; verify emails arrive (test mode); responsive pass at 375px on every admin page

---

## Notes / non-goals

- Reviews/ratings stay deferred — admin dashboard already lets us edit `rating`/`review_count` manually; a real review system is a Phase 4 candidate
- Real payment processing stays deferred — payment_method options unchanged
- Image uploads for products use URL fields (admin pastes URLs); a Storage-backed product image uploader is a follow-up
- Customer self-promotion to admin is intentionally not possible; first admin must be assigned via the database tool
