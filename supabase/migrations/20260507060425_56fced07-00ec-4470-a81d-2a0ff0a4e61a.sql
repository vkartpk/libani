ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS seo_keywords text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS seo_faq jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS seo_updated_at timestamptz;

CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  singleton boolean NOT NULL DEFAULT true UNIQUE,
  site_name text NOT NULL DEFAULT 'vKart Pakistan',
  title_template text NOT NULL DEFAULT '%product% | vKart Pakistan',
  description_template text NOT NULL DEFAULT 'Buy %product% online in Pakistan. Fast delivery across Karachi, Lahore, Islamabad. Cash on Delivery available.',
  default_og_image text,
  org_json_ld jsonb NOT NULL DEFAULT '{}'::jsonb,
  local_business_json_ld jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins manage site settings" ON public.site_settings FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.site_settings (singleton) VALUES (true) ON CONFLICT DO NOTHING;