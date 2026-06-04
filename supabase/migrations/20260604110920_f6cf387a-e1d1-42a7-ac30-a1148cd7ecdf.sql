
-- Extend site_settings
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS tagline text,
  ADD COLUMN IF NOT EXISTS support_phone text,
  ADD COLUMN IF NOT EXISTS support_email text,
  ADD COLUMN IF NOT EXISTS whatsapp text,
  ADD COLUMN IF NOT EXISTS address text,
  ADD COLUMN IF NOT EXISTS social jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS logo_url text,
  ADD COLUMN IF NOT EXISTS currency_code text NOT NULL DEFAULT 'PKR',
  ADD COLUMN IF NOT EXISTS currency_symbol text NOT NULL DEFAULT 'Rs',
  ADD COLUMN IF NOT EXISTS currency_locale text NOT NULL DEFAULT 'en-PK',
  ADD COLUMN IF NOT EXISTS currency_decimals integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS shipping_fee numeric NOT NULL DEFAULT 200,
  ADD COLUMN IF NOT EXISTS free_shipping_threshold numeric NOT NULL DEFAULT 1000,
  ADD COLUMN IF NOT EXISTS cod_fee numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS delivery_days_min integer NOT NULL DEFAULT 2,
  ADD COLUMN IF NOT EXISTS delivery_days_max integer NOT NULL DEFAULT 5,
  ADD COLUMN IF NOT EXISTS announcement_text text,
  ADD COLUMN IF NOT EXISTS announcement_link text,
  ADD COLUMN IF NOT EXISTS announcement_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS promo jsonb NOT NULL DEFAULT '{}'::jsonb;

-- Coupons
CREATE TABLE IF NOT EXISTS public.coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  type text NOT NULL CHECK (type IN ('percent','fixed','free_shipping')),
  value numeric NOT NULL DEFAULT 0,
  min_subtotal numeric NOT NULL DEFAULT 0,
  max_discount numeric,
  starts_at timestamptz,
  ends_at timestamptz,
  active boolean NOT NULL DEFAULT true,
  usage_limit integer,
  used_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.coupons TO anon, authenticated;
GRANT ALL ON public.coupons TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.coupons TO authenticated;

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active coupons" ON public.coupons
  FOR SELECT USING (true);
CREATE POLICY "Admins can insert coupons" ON public.coupons
  FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update coupons" ON public.coupons
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins can delete coupons" ON public.coupons
  FOR DELETE TO authenticated USING (public.is_admin());

CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON public.coupons
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
