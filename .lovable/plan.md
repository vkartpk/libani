## AI-Powered SEO / AEO / GEO for Products

Right now the admin has no place to manage SEO. Products do have `meta_title` / `meta_description` / `tags` columns in the database, but they're hidden from the UI. I'll expose them and add an **AI generator** (powered by Lovable AI — no API key needed) that writes optimized metadata for one product or *all* products at once.

### What you'll get

A new **SEO** section in the admin sidebar (`/admin/seo`) with:

1. **Product SEO table** — every product with its current title, meta title, meta description, status badge (Optimized / Missing / Stale), and last-updated date. Filters: missing only, by category, by brand, search.
2. **One-click "Generate with AI"** per row — fills meta title, meta description, keywords/tags, an FAQ block (AEO), and a localized snippet for Pakistan (GEO: city/region keywords like Karachi, Lahore, Islamabad, PKR, Pakistan delivery).
3. **Bulk "Optimize all missing"** — runs the same generator across every product that's missing SEO, with a live progress bar.
4. **Edit dialog** — review/tweak the AI output, then save. Also editable from the existing product dialog (a new "SEO" tab).
5. **Site-wide SEO settings** — default title template (`%product% | vKart Pakistan`), default description template, default OG image, organization JSON-LD (already partly in `SEO.tsx`, will be wired to settings).
6. **AEO (Answer Engine Optimization)**: AI generates a short FAQ (3–5 Q&A) and a "key facts" summary stored on the product. Rendered on the product page as `FAQPage` JSON-LD so ChatGPT/Perplexity/Google AI Overviews can cite it.
7. **GEO (Generative Engine Optimization / local SEO)**: prompts steer AI to include Pakistan-specific phrasing, city mentions, currency, and shipping language. A `LocalBusiness` JSON-LD is added site-wide.

### Technical plan

**1. Database (migration)**
- Add columns to `products`: `seo_keywords text[]`, `seo_faq jsonb` (`[{q,a}]`), `seo_updated_at timestamptz`.
- New table `site_settings` (single-row, admin-only RW) for default SEO templates, org info, default OG image.

**2. Edge function `seo-generate`** (uses `LOVABLE_API_KEY`, `google/gemini-3-flash-preview`)
- Input: `{ product_ids: string[], mode: "missing" | "all" }`
- For each product: pull name/brand/category/description, prompt Gemini with tool-calling to return structured JSON `{meta_title, meta_description, keywords, faq, geo_snippet}`.
- Writes back to `products`. Auth-gated: caller must be admin (verify JWT + `has_role`).
- Handles 429/402 → returns friendly error to the toast.

**3. Frontend**
- New `src/pages/admin/Seo.tsx` (table + bulk action + filters).
- New `src/pages/admin/SeoSettings.tsx` (site-wide defaults).
- New `src/components/admin/SeoEditor.tsx` (per-product editor with "Regenerate" button; also embedded as a tab in the existing product dialog).
- Add **SEO** + **SEO Settings** entries to `AdminLayout` sidebar.
- Update `src/components/SEO.tsx` to optionally render `FAQPage` JSON-LD when `faq` is passed.
- Update `src/pages/ProductDetail.tsx` to pull `seo_faq` and pass it to `<SEO>`, and use `meta_title`/`meta_description` from DB.

**4. Files**
- new migration: `add_product_seo_and_settings.sql`
- new: `supabase/functions/seo-generate/index.ts`
- new: `src/pages/admin/Seo.tsx`, `src/pages/admin/SeoSettings.tsx`
- new: `src/components/admin/SeoEditor.tsx`
- edit: `src/pages/admin/AdminLayout.tsx` (sidebar), `src/pages/admin/Products.tsx` (SEO tab in dialog), `src/components/SEO.tsx`, `src/pages/ProductDetail.tsx`, `src/App.tsx` (routes)

### Cost note
Each AI generation call uses Lovable AI credits. Bulk-optimizing hundreds of products at once will consume credits — the bulk button will show an estimated count before running.

Approve and I'll implement.