UPDATE public.site_settings SET free_shipping_threshold = 0;
UPDATE public.products SET free_shipping = false;
UPDATE public.products SET features = (SELECT jsonb_agg(f) FROM jsonb_array_elements_text(features) f WHERE f NOT ILIKE '%free shipping%') WHERE features::text ILIKE '%free shipping%';
UPDATE public.products SET meta_description = replace(meta_description, 'free shipping above Rs.1000', 'fast nationwide delivery') WHERE meta_description ILIKE '%free shipping%';
UPDATE public.coupons SET active = false WHERE type = 'free_shipping';