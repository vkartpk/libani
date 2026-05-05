
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'customer');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT public.has_role(auth.uid(), 'admin') $$;

CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Update handle_new_user to also assign customer role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, phone)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'name', NEW.raw_user_meta_data ->> 'phone');
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'customer') ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Admin select policies on existing tables
CREATE POLICY "Admins view all orders" ON public.orders FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins update all orders" ON public.orders FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins view all order items" ON public.order_items FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins view all addresses" ON public.addresses FOR SELECT USING (public.is_admin());

-- Categories
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  image_url text,
  icon text,
  parent_slug text,
  group_name text,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public view active categories" ON public.categories FOR SELECT USING (is_active OR public.is_admin());
CREATE POLICY "Admins manage categories" ON public.categories FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Brands
CREATE TABLE public.brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  logo_url text,
  banner_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public view active brands" ON public.brands FOR SELECT USING (is_active OR public.is_admin());
CREATE POLICY "Admins manage brands" ON public.brands FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Products
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  brand_slug text NOT NULL,
  category_slug text NOT NULL,
  subcategory_slug text,
  price numeric NOT NULL DEFAULT 0,
  compare_at_price numeric,
  description text,
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  specs jsonb NOT NULL DEFAULT '[]'::jsonb,
  tags text[] NOT NULL DEFAULT '{}',
  images text[] NOT NULL DEFAULT '{}',
  rating numeric NOT NULL DEFAULT 0,
  review_count int NOT NULL DEFAULT 0,
  in_stock boolean NOT NULL DEFAULT true,
  stock_count int NOT NULL DEFAULT 25,
  is_featured boolean NOT NULL DEFAULT false,
  is_new_arrival boolean NOT NULL DEFAULT false,
  is_on_sale boolean NOT NULL DEFAULT false,
  sku text,
  weight text,
  free_shipping boolean NOT NULL DEFAULT false,
  meta_title text,
  meta_description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_products_brand ON public.products(brand_slug);
CREATE INDEX idx_products_category ON public.products(category_slug);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public view active products" ON public.products FOR SELECT USING (is_active OR public.is_admin());
CREATE POLICY "Admins manage products" ON public.products FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TRIGGER trg_products_updated BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Variants
CREATE TABLE public.product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  label text NOT NULL,
  type text NOT NULL,
  value text NOT NULL,
  in_stock boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0
);
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public view variants" ON public.product_variants FOR SELECT USING (true);
CREATE POLICY "Admins manage variants" ON public.product_variants FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Contact
CREATE TABLE public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone submits contact" ON public.contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins read contact" ON public.contact_submissions FOR SELECT USING (public.is_admin());

-- Admin list customers RPC
CREATE OR REPLACE FUNCTION public.admin_list_customers()
RETURNS TABLE(user_id uuid, name text, phone text, avatar_url text, created_at timestamptz, order_count bigint, total_spent numeric, is_admin boolean)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT p.user_id, p.name, p.phone, p.avatar_url, p.created_at,
    COALESCE(o.cnt, 0) AS order_count,
    COALESCE(o.sum_total, 0) AS total_spent,
    public.has_role(p.user_id, 'admin') AS is_admin
  FROM public.profiles p
  LEFT JOIN (SELECT user_id, COUNT(*) cnt, SUM(total) sum_total FROM public.orders WHERE user_id IS NOT NULL GROUP BY user_id) o
    ON o.user_id = p.user_id
  WHERE public.is_admin()
  ORDER BY p.created_at DESC;
$$;
