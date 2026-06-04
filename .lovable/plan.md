## Admin Settings Module

New page **`/admin/settings`** with a tabbed UI for site-wide configuration. Values live in the database and are read by the storefront so any change is reflected on the frontend without code edits.

### Tabs

**1. Users & Roles**
- Reuses `admin_list_customers` RPC (already used in Customers page).
- Grant / revoke `admin` role via `user_roles` table.
- Adds a third role `manager` (read-only admin) to `app_role` enum + toggle.
- Search by name / phone / email; shows current roles as chips.

**2. Business**
- Site name, tagline, support phone, support email, WhatsApp number, address.
- Social links (Facebook, Instagram, TikTok, YouTube).
- Logo upload (uses existing `product-images` bucket, folder `branding/`).
- Frontend `Header`, `Footer`, and `Contact` page read these via a `useSiteSettings()` hook.

**3. Delivery & Currency**
- Currency: code (PKR/USD/AED…), symbol, locale, decimals.
- `formatPKR` in `src/lib/storage.ts` becomes `formatMoney` that reads the active currency from settings (cached in React Query, fallback PKR).
- Delivery: flat shipping fee, free-shipping threshold, COD fee, estimated delivery days.
- `CartContext` shipping calc switches from hard-coded `>= 1000 ? 0 : 200` to settings-driven values.

**4. Offers & Conditions**
- Announcement bar text + enabled toggle + link.
- Active promo banner (title, subtitle, CTA, image, enabled, start/end date).
- Coupon rules: list of coupons `{ code, type: percent|fixed, value, min_subtotal, max_discount, starts_at, ends_at, active }` — replaces any hard-coded coupons.
- Storefront `applyCoupon` validates against this table.

### Database changes (single migration)

Extend `public.site_settings` (singleton row) with columns:
```text
tagline, support_phone, support_email, whatsapp, address,
social jsonb, logo_url,
currency_code, currency_symbol, currency_locale, currency_decimals,
shipping_fee, free_shipping_threshold, cod_fee, delivery_days_min, delivery_days_max,
announcement_text, announcement_link, announcement_enabled,
promo jsonb
```

New table `public.coupons`:
```text
id, code (unique, citext), type (percent|fixed), value numeric,
min_subtotal numeric, max_discount numeric,
starts_at, ends_at, active bool, usage_limit, used_count,
created_at, updated_at
```
- GRANTs: `SELECT` to `anon` + `authenticated` (needed at checkout), full to `service_role`; admin writes via `is_admin()` policy.
- `app_role` enum: add `'manager'`.
- Public read policy on `site_settings` already exists; admin write via `is_admin()`.

### Frontend wiring

- New `src/hooks/useSiteSettings.ts` — React Query, 5-min stale, fallback defaults.
- `src/lib/money.ts` — `formatMoney(n, settings)`; keep `formatPKR` as a thin re-export to avoid touching every call site.
- `CartContext` consumes settings for shipping + COD.
- `AnnouncementBar`, `Header`, `Footer`, `Contact`, `Checkout` read from the hook.
- New `src/pages/admin/Settings.tsx` with shadcn `Tabs` (Users / Business / Delivery & Currency / Offers).
- Sidebar item added to `AdminLayout` (`Settings` icon, route `/admin/settings`).
- Lazy route added in `src/App.tsx`.

### Out of scope (this pass)
- Multi-currency conversion (only display currency changes; prices stay stored as one numeric).
- Per-city / weight-based shipping rules.
- Coupon usage tracking UI beyond `used_count` increment.
- Email templates / SMTP settings.

### Open questions before I build
1. Add the `manager` role now, or keep just `admin` + `customer`?
2. For coupons — keep it simple (percent + fixed only), or do you also want "free shipping" coupon type?
3. Should the Offers tab also control the homepage Hero slider / Flash sale block, or only the announcement bar + promo banner + coupons?
