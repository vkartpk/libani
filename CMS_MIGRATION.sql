-- Run this in your Supabase SQL editor (project asgdaihwlxmpjbiqcufu)
-- Adds CMS tables for footer pages and homepage banners.

CREATE TABLE IF NOT EXISTS public.pages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  content text NOT NULL DEFAULT '',
  meta_title text,
  meta_description text,
  footer_label text,
  show_in_footer boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.pages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pages TO authenticated;
GRANT ALL ON public.pages TO service_role;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public view published pages" ON public.pages;
CREATE POLICY "Public view published pages" ON public.pages FOR SELECT USING (is_published OR public.is_admin());
DROP POLICY IF EXISTS "Admins manage pages" ON public.pages;
CREATE POLICY "Admins manage pages" ON public.pages FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP TRIGGER IF EXISTS update_pages_updated_at ON public.pages;
CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON public.pages
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.banners (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  placement text NOT NULL DEFAULT 'hero',
  title text NOT NULL,
  subtitle text,
  badge text,
  cta_label text,
  cta_href text,
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.banners TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.banners TO authenticated;
GRANT ALL ON public.banners TO service_role;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public view active banners" ON public.banners;
CREATE POLICY "Public view active banners" ON public.banners FOR SELECT USING (is_active OR public.is_admin());
DROP POLICY IF EXISTS "Admins manage banners" ON public.banners;
CREATE POLICY "Admins manage banners" ON public.banners FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP TRIGGER IF EXISTS update_banners_updated_at ON public.banners;
CREATE TRIGGER update_banners_updated_at BEFORE UPDATE ON public.banners
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.pages (slug, title, footer_label, sort_order, content, meta_description) VALUES
('refund','Refund Policy','Refund Policy',10,'We offer a 7-day return window from the delivery date for unused items in original packaging. Contact support to start a return; refunds are processed within 3-5 business days after inspection. Delivery charges are non-refundable.','libani refund policy — returns within 7 days of delivery.'),
('privacy','Privacy Policy','Privacy Policy',20,'We collect only the information required to process your order — name, phone, email and delivery address. We never sell your data. Cookies are used to remember your cart and preferences.','How libani collects, uses and protects your personal information.'),
('terms','Terms of Service','Terms of Service',30,'By using %site_name% you agree to provide accurate order information. Prices and availability may change without notice. Orders may be cancelled before dispatch by contacting our support team.','Terms and conditions for shopping at libani.'),
('shipping','Shipping Policy','Shipping Policy',40,'We deliver across Pakistan within %delivery_days% working days. Delivery charges of %shipping_fee% apply on every order — we charge only when we deliver. Damaged or wrong items are replaced free of charge — just notify us within 48 hours of delivery.','libani shipping and delivery information for orders across Pakistan.')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.banners (placement, title, subtitle, badge, cta_label, cta_href, sort_order) VALUES
('hero','Level Up Your Setup','Mechanical keyboards, precision mice, and headsets built for victory.','Gaming Collection','Shop now','/category/gaming-mouse',10),
('hero','Stay Connected, Stay Charged','20,000mAh power banks, 100W cables, fast chargers.','Power & Charging','Shop now','/category/power-banks',20),
('hero','Sound That Moves You','TWS earbuds, over-ear headphones, neckbands — premium quality at honest prices.','Premium Audio','Shop now','/category/tws',30),
('gaming','Gaming Setup? We''ve Got Everything.','From mechanical keyboards to RGB chairs — Pakistan''s biggest gaming gear lineup.','Built for victory','Shop gaming','/category/gaming-mouse',10);
