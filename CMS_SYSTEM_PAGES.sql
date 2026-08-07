-- Run this AFTER CMS_MIGRATION.sql in your Supabase SQL editor.
-- Makes the built-in pages (About, FAQ, Contact, Track Order, Blog, All Products)
-- manageable from /libani/pages: footer label, order, visibility and SEO meta.

ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS link_url text;
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS is_system boolean NOT NULL DEFAULT false;

INSERT INTO public.pages (slug, title, footer_label, link_url, is_system, sort_order, content, meta_title, meta_description) VALUES
('products','All Products','All Products','/products',true,1,'','All Products | libani','Shop all authentic tech accessories at libani — computer peripherals, audio, gaming and mobile accessories.'),
('about','About Us','About Us','/about',true,2,'','About Us | libani','Learn the story behind libani — Pakistan''s premier tech accessories destination.'),
('faq','FAQ','FAQ','/faq',true,3,'','FAQ | libani','Answers about delivery, payments, warranty and returns at libani.'),
('contact','Contact Us','Contact Us','/contact',true,4,'','Contact Us | libani','Contact the libani team by phone, email or WhatsApp.'),
('track-order','Track Order','Track Order','/track-order',true,5,'','Track Order | libani','Track your libani order with your order number.'),
('blog','Blog','Blog','/blog',true,6,'','Blog | libani','Reviews, guides, news and tips from the libani team.')
ON CONFLICT (slug) DO UPDATE SET link_url = EXCLUDED.link_url, is_system = true;
