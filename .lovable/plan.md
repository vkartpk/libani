## Goal

Produce a complete, self-contained migration bundle for your Supabase project `asgdaihwlxmpjbiqcufu`, **and** repoint this app's code to it.

## Important constraints (verified)

- Lovable Cloud cannot be disconnected from this project. `.env`, `src/integrations/supabase/client.ts`, and `src/integrations/supabase/types.ts` are auto-generated and will keep pointing at the Cloud backend. I will leave them untouched and add a separate client instead.
- 27 files import `@/integrations/supabase/client`; all get repointed.
- The service role key you pasted is now exposed in chat history — rotate it in your Supabase dashboard (Settings → API) once migration is done. It will never be written into frontend code.
- Edge function deploys from Lovable always target the Cloud project. Deploying `seo-generate` and `generate-alt-text` to your project is a manual step you run with the Supabase CLI (I'll provide exact commands and the ready-to-deploy sources).

## Part A — Export bundle (written to /mnt/documents/migration/)

**1. `01_schema.sql`** — full DDL, ordered for a clean apply:
- `create type app_role as enum ('admin','customer')`
- 15 tables: `profiles, user_roles, addresses, categories, brands, products, product_variants, orders, order_items, coupons, expenses, payment_methods, site_settings, contact_submissions, image_optimization_log` — with all defaults, NOT NULLs, PKs, uniques, FKs
- Functions: `update_updated_at_column`, `handle_new_user`, `has_role`, `is_admin`, `admin_list_customers`
- Trigger: `on_auth_user_created` on `auth.users` → `handle_new_user`, plus `updated_at` triggers
- `GRANT` blocks per table (anon read on public catalog tables; authenticated/service_role elsewhere)
- `ENABLE ROW LEVEL SECURITY` + every existing policy recreated verbatim

**2. `02_storage.sql`** — creates buckets `avatars` and `product-images` (both public) and their storage.objects policies (public read, admin-only write via `is_admin()`).

**3. `03_data.sql`** — INSERT statements for all rows, in FK-safe order:
`categories (33)`, `brands (22)`, `products (47)`, `payment_methods (5)`, `site_settings (1)`, `image_optimization_log (185)`.
User-scoped rows are **skipped** (you chose not to keep users): `profiles`, `user_roles`, `orders`, `order_items`, `addresses` start empty. Also CSV copies of every table under `csv/` for reference.

**4. `04_storage_files/`** — every object downloaded from both buckets, plus `upload.sh` (a Supabase CLI / curl loop) to push them into your project with identical paths, so the product image URLs in `03_data.sql` resolve. Note: image URLs in `products.images` contain the old project ref — `03_data.sql` will have them rewritten to your project's URL.

**5. `functions/`** — `seo-generate/index.ts`, `generate-alt-text/index.ts`, plus `DEPLOY.md` with `supabase functions deploy` commands and the secrets each needs.

**6. `AUTH_SETTINGS.md`** — email/password + Google provider config, site URL, redirect allow-list (`/`, `/reset-password`), and the recommended settings (disable auto-confirm, enable HIBP leaked-password check). Google OAuth needs your own Client ID/Secret in your project's dashboard.

**7. `README.md`** — the run order, and a go-live checklist.

## Part B — Repoint the app

- New file `src/lib/supabase.ts` exporting a client built from your URL + anon key (both are public values, safe in code), typed with the existing generated `Database` type.
- Update all 27 files importing `@/integrations/supabase/client` to import from `@/lib/supabase`. Note: `src/integrations/lovable` Google sign-in is Cloud-managed and won't work against your project — `Auth.tsx` will switch to `supabase.auth.signInWithOAuth('google')`, which needs Google configured in your Supabase dashboard.
- `scripts/regen-product-images.ts` keeps using env vars; no key hardcoded.
- Any client-side call to the two edge functions will resolve against your project once deployed.

## Run order (zero data loss)

1. Nothing is deleted from the Cloud project — it stays intact as a fallback.
2. Apply `01_schema.sql` → `02_storage.sql` → `03_data.sql` in your Supabase SQL editor.
3. Run `04_storage_files/upload.sh` with your service role key in env.
4. Deploy the two edge functions + set their secrets.
5. Configure auth (email provider, Google, site URL, redirects).
6. I flip the code over (Part B); you sign up `info@vkart.pk`, then run the one-line SQL in README to grant it `admin`.
7. Verify with the checklist, then rotate the service role key.

## Verification checklist (in README)

Storefront loads 47 products with working images · category/brand pages · cart + checkout writes an order · `/track-order` finds it · signup creates profile + customer role · `/libani` gates on admin · settings changes reflect on storefront · SEO regenerate works · image upload works · RLS check: signed-out user cannot read `orders`/`profiles` data they don't own.

## Technical notes

I read schema, policies, and row counts directly from the live database, so the exported SQL is generated from actual state, not reconstructed from memory. Storage object listing happens at export time.
