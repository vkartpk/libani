ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS theme_primary text,
  ADD COLUMN IF NOT EXISTS theme_accent text,
  ADD COLUMN IF NOT EXISTS theme_background text,
  ADD COLUMN IF NOT EXISTS theme_foreground text,
  ADD COLUMN IF NOT EXISTS theme_default_mode text DEFAULT 'dark',
  ADD COLUMN IF NOT EXISTS maintenance_mode boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS maintenance_message text,
  ADD COLUMN IF NOT EXISTS maintenance_eta text;