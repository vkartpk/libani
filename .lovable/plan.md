## Problem

On `/admin/seo` the row actions only show a red **Regenerate** button. The **Edit** button technically exists in the code (`<Button variant="ghost">Edit</Button>`) but it's hidden because:

1. The actions column has no fixed width, so the long "Regenerate" label pushes Edit off the visible area on smaller widths.
2. `variant="ghost"` makes it nearly invisible against the dark background.
3. There's no obvious way to open the editor — clicking the product name/row does nothing either.

## Fix (UI-only, in `src/pages/admin/Seo.tsx`)

1. **Make Edit a first-class action**
   - Change Edit to `variant="outline"` with a pencil icon (`Pencil` from lucide-react) so it's clearly visible next to Regenerate.
   - Stack the two action buttons vertically on narrow widths (`flex-col md:flex-row`) and give the actions column a fixed min-width so neither button gets clipped.

2. **Make the row itself open the editor**
   - Add `onClick={() => setEditing(p)}` and `cursor-pointer hover:bg-muted/40` to each `<tr>`.
   - Make the product name look like a link (underline on hover) to hint it's clickable.
   - Stop propagation on the action buttons so clicking Regenerate/Edit doesn't double-trigger.

3. **Add a top-right "Edit" entry point per row on mobile**
   - On screens < md, show a kebab/`MoreHorizontal` button that opens the same edit dialog, so the table stays readable.

4. **Polish the edit dialog (already exists, minor tweaks)**
   - Surface a small "Last optimized" timestamp at the top using `seo_updated_at`.
   - Show character-count colour hints (green when within 50–60 / 140–160, amber otherwise) on title/description.

No backend, schema, or edge-function changes — the editor, save logic, and `seo-generate` function already work.

## Files touched

- `src/pages/admin/Seo.tsx` — row actions, click-to-edit, dialog polish.

That's it.