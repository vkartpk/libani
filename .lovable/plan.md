## Add Theme & Site Status controls to Admin Settings

Add a new **Appearance** tab to `/admin/settings` with two features:

### 1. Theme color customization
- Color pickers for the core brand tokens: **Primary**, **Accent**, **Background**, **Foreground** (with live preview swatches).
- Default-mode toggle: Dark / Light / Follow system.
- "Reset to defaults" button.
- Saved into `site_settings` and applied globally on every page load by injecting CSS variables (HSL) into `:root` from a small `ThemeApplier` component mounted in `App.tsx`. Existing `ThemeContext` (dark/light) keeps working — admin choice just sets the initial default.

### 2. Site ON / OFF (Maintenance mode)
- Big toggle switch: **Site is LIVE** ⇄ **Site is OFF (Maintenance)**.
- Optional custom maintenance message + ETA text.
- When OFF: every public route shows a full-screen Maintenance page (logo + message). Admin routes (`/admin/*`) and `/auth` stay accessible so the owner can turn it back on.
- Implemented via a `MaintenanceGate` wrapper in `Layout.tsx` that reads `site_settings.maintenance_mode`.

### Technical details
- **DB migration**: add columns to `site_settings`:
  - `theme_primary text`, `theme_accent text`, `theme_background text`, `theme_foreground text` (HSL triplet strings like `"222 47% 11%"`)
  - `theme_default_mode text` (`'dark' | 'light' | 'system'`)
  - `maintenance_mode boolean default false`
  - `maintenance_message text`, `maintenance_eta text`
- **New components**:
  - `src/components/ThemeApplier.tsx` — reads settings, writes CSS vars to `document.documentElement`.
  - `src/pages/Maintenance.tsx` — branded offline screen.
  - `src/components/MaintenanceGate.tsx` — wraps `Layout` children; bypasses for admins and `/admin`, `/auth`.
- **Edit**: `src/pages/admin/Settings.tsx` (add `Appearance` tab with color inputs + maintenance toggle), `src/App.tsx` (mount `ThemeApplier` + `MaintenanceGate`).
- No changes to existing dark/light toggle behavior in the header.

### Out of scope
- Per-page theming, font customization, custom CSS editor, scheduled maintenance windows.
