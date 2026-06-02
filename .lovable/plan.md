## Finance Module — `/admin/finance`

First of three modules. Payments and Image Optimizer will follow in later passes.

### Scope

1. **Revenue & Sales Overview** — live charts pulled from existing `orders` table.
2. **Profit & Expenses Tracker** — new `expenses` table, admin can add/edit/delete entries, profit calculated as revenue − expenses − COGS estimate.

### UI

New page `src/pages/admin/Finance.tsx` using the existing `AdminLayout`, added to the admin sidebar with a `Wallet` icon and route `/admin/finance` in `App.tsx`.

Two tabs (shadcn `Tabs`):

- **Overview**
  - KPI cards: Revenue (today / 7d / 30d / all-time), Orders count, Avg order value, Gross profit (revenue − expenses in period).
  - Range selector: 7d / 30d / 90d / 12mo.
  - Line chart: daily revenue (recharts, already used in Dashboard).
  - Bar chart: revenue by payment method (`orders.payment_method`).
  - Donut: order status breakdown.
  - Top 5 selling products in period (from `order_items`).

- **Expenses**
  - Table of expenses (date, category, description, amount, actions).
  - "Add expense" dialog: date, category (select: Inventory/COGS, Marketing, Shipping, Salaries, Software, Rent, Other), description, amount (PKR).
  - Edit / delete row.
  - Summary strip on top: Total expenses in selected range, by category breakdown.
  - Profit calc displayed: Revenue − Expenses = Net (period-filtered).

### Database

New migration creating `public.expenses`:

```text
id uuid pk
user_id uuid (admin who logged it)
category text
description text
amount numeric (PKR)
expense_date date
created_at, updated_at timestamptz
```

- GRANTs for `authenticated` + `service_role` (no anon).
- RLS: admin-only via existing `is_admin()` for SELECT/INSERT/UPDATE/DELETE.
- `update_updated_at_column` trigger.

### Data fetching

Client-side queries via `supabase` client + `@tanstack/react-query`:
- `orders` aggregated in the browser (already low volume) — select `created_at, total, payment_method, status` for the chosen range.
- `order_items` for top products in range.
- `expenses` filtered by `expense_date` in range.

No edge function needed for v1.

### Files touched

- new: `supabase/migrations/<ts>_expenses.sql`
- new: `src/pages/admin/Finance.tsx`
- edited: `src/App.tsx` (add lazy route `/admin/finance`)
- edited: `src/pages/admin/AdminLayout.tsx` (add nav item "Finance" with Wallet icon)

### Out of scope (next passes)

- Payments module (transactions view + method config)
- Image Optimizer module (bulk compress, on-upload optimize, AI alt text, scanner)
- CSV/PDF export of finance reports
- Tax/COD breakdown view