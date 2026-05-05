# Phase 3 Implementation

The Phase 3 scaffolding from earlier was partial: admin page files exist but the database tables they query (`products`, `user_roles`, `categories`, `brands`) do not, the `/admin` routes aren't wired in `App.tsx`, the header has no admin link, and emails aren't set up. This plan ships all three Phase 3 pillars end-to-end.

## 1. Database — catalog + roles + contact

Single migration creating:

- `app_role` enum (`admin`, `customer`)
- `user_roles` table + `has_role(uuid, app_role)` and `is_admin()` security-definer functions (the canonical no-recursion pattern)
- Update `handle_new_user` trigger to also insert a `customer` role for every signup
- `categories` (slug PK, name, description, image_url, parent_slug, sort_order, is_active)
- `brands` (slug PK, name, logo_url, description, is_active)
- `products` (id, slug unique, name, brand_slug, category_slug, subcategory_slug, price, compare_at_price, description, features jsonb, specs jsonb, tags text[], images text[], rating, review_count, in_stock, stock_count, is_featured, is_new_arrival, is_on_sale, sku, free_shipping, created_at)
- `product_variants` (id, product_id fk, label, type, value, in_stock, sort_order)
- `contact_submissions` (id, name, email, subject, message, created_at)
- RLS: public `SELECT` on active catalog rows, `is_admin()` for write; admin SELECT-all policies added to `orders`, `order_items`, `addresses`, `profiles`, `contact_submissions`; anyone can INSERT to `contact_submissions`

Seed step: a separate insert-only migration generated from the current `src/data/products.ts`, `categories.ts`, `brands.ts` so all existing catalog content is preserved.

## 2. Storefront → DB-backed catalog

Add `src/data/queries.ts` exposing `useProducts`, `useProduct(slug)`, `useCategories`, `useCategory(slug)`, `useBrands`, `useBrand(slug)` built on TanStack Query + Supabase, returning the same `Product`/`Brand`/`Category` shapes the components already use. Migrate every consumer:

- Home widgets (FlashSale, WeeklyPicks, FeaturedSpotlight, BrandStrip, CategoryShowcase)
- Products list, ProductDetail, CategoryPage, BrandPage, SearchPage
- Wishlist, Compare (already store snapshots; just resolve missing items via query)

Keep `src/data/types.ts`. Remove `src/data/products.ts`, `categories.ts`, `brands.ts` once all consumers are switched. Add lightweight skeletons where data becomes async.

## 3. Roles + /admin dashboard

- `useUserRole` hook (already exists) — keep
- Add `/admin/*` routes to `App.tsx`, lazy-loaded
- Wire existing `AdminLayout`, `Dashboard`, `Orders`, `Products`
- Add missing admin pages: **Categories**, **Brands**, **Customers** (joins `profiles` + order count via a `admin_list_customers()` RPC; per-user "Make admin / Remove admin" toggle that inserts/deletes from `user_roles`)
- Add an "Admin dashboard" link in the header account dropdown when `useUserRole().isAdmin` is true

First admin promotion: documented manual step (insert into `user_roles` via the database tool with the current user's id) — no self-promote UI.

## 4. Branded emails

- Trigger the email-domain setup dialog so the user can configure their sender domain
- Set up the shared email infrastructure
- Scaffold + brand all 6 auth email templates (red `#E11D48` primary, white body, TechZone footer)
- Scaffold transactional infra and add three templates registered in `registry.ts`:
  - `order-placed` — invoked from `Checkout.tsx` after the order insert; subject `Order TZ-XXXXXX confirmed`; includes summary, address, total, "Track order" button
  - `order-status-update` — invoked from the admin Orders status-change handler; copy adapts per status; `delivered` adds a review CTA
  - `contact-form` — invoked from `Contact.tsx` after inserting into `contact_submissions`; sends acknowledgement to the submitter
- Idempotency keys: `order-placed-{order.id}`, `order-status-{order.id}-{status}`, `contact-{submission.id}`

## Build order

1. Migration: roles + has_role/is_admin + handle_new_user update + admin SELECT policies on existing tables
2. Migration: catalog tables + RLS + `contact_submissions` + `admin_list_customers()` RPC
3. Seed migration generated from current `src/data/*.ts`
4. `src/data/queries.ts` + migrate all storefront consumers + remove old data files
5. Wire `/admin/*` routes in `App.tsx`; add header admin link; build Categories / Brands / Customers admin pages
6. Email domain setup dialog → infra → branded auth templates → transactional templates
7. Wire transactional sends in Checkout, admin Orders, Contact form
8. QA pass: guest checkout email, signed-in checkout email, admin status-change email, contact ack, admin pages at 375px, role gating

## Non-goals

- No product image uploads (URL fields only — Storage uploader is Phase 4)
- No review system (admin can edit `rating`/`review_count` directly)
- No payment processing changes
- No self-serve admin promotion
