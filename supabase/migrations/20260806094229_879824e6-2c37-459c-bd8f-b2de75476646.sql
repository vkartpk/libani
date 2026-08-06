CREATE TABLE public.pages (
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
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.pages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pages TO authenticated;
GRANT ALL ON public.pages TO service_role;

ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public view published pages" ON public.pages FOR SELECT USING (is_published OR public.is_admin());
CREATE POLICY "Admins manage pages" ON public.pages FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON public.pages
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.banners (
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
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.banners TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.banners TO authenticated;
GRANT ALL ON public.banners TO service_role;

ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public view active banners" ON public.banners FOR SELECT USING (is_active OR public.is_admin());
CREATE POLICY "Admins manage banners" ON public.banners FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TRIGGER update_banners_updated_at BEFORE UPDATE ON public.banners
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.pages (slug, title, footer_label, sort_order, content, meta_description) VALUES
('refund', 'Refund Policy', 'Refund Policy', 10, 'We accept returns within 7 days of delivery for unused items in original packaging. Refunds are processed within 5-7 working days after inspection. Delivery charges are non-refundable.', 'libani refund policy — returns within 7 days of delivery.'),
('privacy', 'Privacy Policy', 'Privacy Policy', 20, 'We collect only the information required to process your order — name, phone, email and delivery address. We never sell your data to third parties. Payment details are handled by our payment partners.', 'How libani collects, uses and protects your personal information.'),
('terms', 'Terms of Service', 'Terms of Service', 30, 'By using libani you agree to provide accurate order information. Prices and availability may change without notice. Orders may be cancelled before dispatch by contacting our support team.', 'Terms and conditions for shopping at libani.'),
('shipping', 'Shipping Policy', 'Shipping Policy', 40, 'We deliver across Pakistan within 2-3 working days. Delivery charges apply on every order and are shown at checkout. Damaged or wrong items are replaced free of charge — just notify us within 48 hours of delivery.', 'libani shipping and delivery information for orders across Pakistan.');

INSERT INTO public.banners (placement, title, subtitle, badge, cta_label, cta_href, sort_order) VALUES
('hero', 'Premium Tech Accessories', 'Authentic products, nationwide delivery across Pakistan.', 'New Season', 'Shop Now', '/products', 10),
('hero', 'Gaming Gear That Wins', 'Mice, keyboards, headsets and more built for performance.', 'Gaming', 'Explore Gaming', '/category/gaming-mouse', 20),
('hero', 'Audio You Can Feel', 'TWS earbuds, headphones and speakers from top brands.', 'Audio', 'Shop Audio', '/category/tws', 30),
('gaming', 'Level Up Your Setup', 'Gaming peripherals, chairs and displays at honest prices.', 'Gaming Zone', 'Shop Gaming', '/category/gaming-mouse', 10);