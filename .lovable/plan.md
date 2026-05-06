## Add Product Image Upload

Currently the admin product form only accepts image URLs pasted into a textarea. I'll add proper file uploads so you can drag/select images from your computer and have them stored in the backend.

### What you'll get

- **Upload images from your computer** in the New/Edit Product dialog (multi-file, drag & drop)
- **Image previews** with reorder + delete controls
- **Public image URLs** automatically saved into the product's `images` array
- Pasted URLs still supported as a fallback

### Technical changes

1. **Storage bucket** — create a public `product-images` bucket via migration with RLS:
   - Public read (so the storefront can display them)
   - Insert / update / delete restricted to admin users (`is_admin()`)

2. **New component `src/components/admin/ImageUploader.tsx`**:
   - Accepts `value: string[]` and `onChange`
   - File input + drag/drop zone
   - Uploads each file to `product-images/<timestamp>-<random>.<ext>` via `supabase.storage`
   - Calls `getPublicUrl` and appends to the array
   - Thumbnail grid with remove (×) and drag-to-reorder
   - Optional "Add by URL" input for the existing paste-URL flow

3. **Update `src/pages/admin/Products.tsx`**:
   - Replace the "Image URLs (one per line)" textarea with `<ImageUploader />`
   - Save `form.images` directly (drop the `images_text` split logic)

4. **Reuse**: also wire the same uploader into Brands (`logo_url`, `banner_url`) and Categories (`image_url`) as single-image variants — small win since the bucket already exists.

### Files

- new: `supabase/migrations/<ts>_product_images_bucket.sql`
- new: `src/components/admin/ImageUploader.tsx`
- edit: `src/pages/admin/Products.tsx`
- edit: `src/pages/admin/Brands.tsx`, `src/pages/admin/Categories.tsx` (single-image variant)
