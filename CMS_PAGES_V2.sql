-- ============================================================
-- libani CMS — step 2: manage the EXISTING pages (About, FAQ, Contact)
-- Run this in your Supabase SQL editor AFTER CMS_MIGRATION.sql
-- Safe to re-run.
-- ============================================================

ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS kind text NOT NULL DEFAULT 'policy';
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS route text;
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS sections jsonb NOT NULL DEFAULT '{}'::jsonb;

-- Existing hand-built pages become editable records (kind = 'system').
INSERT INTO public.pages (slug, kind, route, title, footer_label, show_in_footer, sort_order, content, meta_title, meta_description, sections)
VALUES
('about','system','/about','About libani','About Us', true, 100,
 'From our humble beginnings in 2018, libani quickly grew to become one of Pakistan''s premier tech accessories e-commerce destinations. We started with a simple mission: bring authentic, well-priced tech gear to every doorstep in Pakistan, backed by responsive support that actually listens.

Today we partner with 18+ top global brands and serve thousands of happy customers from Karachi to Gilgit.',
 'About Us | libani',
 'Learn the story behind libani — Pakistan''s premier tech accessories destination.',
 '{"subtitle":"Pakistan''s premier destination for authentic tech accessories — backed by a team obsessed with great gear and fair prices.","stats":[["5+","Years Experience"],["10K+","Happy Customers"],["500+","Products"],["18+","Top Brands"]]}'::jsonb),

('faq','system','/faq','Frequently Asked Questions','FAQ', true, 110,
 '## Orders & Shipping
Q: How long does delivery take?
A: We deliver within %delivery_days% working days across Pakistan.
Q: Do you charge for delivery?
A: Yes — delivery charges of %shipping_fee% apply on every order and are payable when we deliver.
Q: Can I track my order?
A: Yes, use our Track Order page with your order number.
Q: Do you deliver outside Pakistan?
A: Currently we serve Pakistan only.

## Products
Q: Are your products authentic?
A: 100% — we source directly from authorised distributors.
Q: Do products come with warranty?
A: Yes, every product ships with brand warranty.
Q: How do I choose a variant?
A: Variants are shown on each product page; ask us if unsure.

## Returns & Refunds
Q: What is your return policy?
A: We offer 7-day easy returns on all items.
Q: How do I initiate a return?
A: Contact our support team via WhatsApp or email.
Q: When will I get my refund?
A: Refunds are processed within 3-5 business days.

## Payments
Q: What payments do you accept?
A: Cash on Delivery, Bank Transfer, JazzCash and EasyPaisa.
Q: Is online payment safe?
A: Yes, all transactions are securely processed.
Q: Can I pay COD?
A: Absolutely — COD is available across Pakistan.',
 'FAQ | libani',
 'Answers about delivery, payments, warranty and returns at libani.',
 '{}'::jsonb),

('contact','system','/contact','Get in Touch','Contact', true, 120,
 'Questions about an order, a product or a partnership? Send us a message and our team replies within one working day.',
 'Contact | libani',
 'Contact libani — phone, email, address and message form.',
 '{"hours":"Mon–Sat 10:00 – 19:00"}'::jsonb)
ON CONFLICT (slug) DO UPDATE
  SET kind = EXCLUDED.kind,
      route = EXCLUDED.route;

-- policy pages keep their kind/route tidy
UPDATE public.pages SET kind = 'policy', route = '/policies/' || slug
WHERE kind = 'policy' AND (route IS NULL OR route = '');
