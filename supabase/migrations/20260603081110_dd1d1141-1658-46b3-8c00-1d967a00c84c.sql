CREATE TABLE public.payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  is_enabled boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  instructions text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.payment_methods TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payment_methods TO authenticated;
GRANT ALL ON public.payment_methods TO service_role;

ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public view enabled payment methods" ON public.payment_methods
  FOR SELECT USING (is_enabled OR is_admin());
CREATE POLICY "Admins manage payment methods" ON public.payment_methods
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE TRIGGER update_payment_methods_updated_at
  BEFORE UPDATE ON public.payment_methods
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.payment_methods (code, name, description, sort_order, instructions) VALUES
  ('cod', 'Cash on Delivery', 'Pay with cash when your order is delivered', 1, 'Have exact change ready for the courier.'),
  ('bank_transfer', 'Bank Transfer', 'Direct bank deposit / IBFT', 2, 'Transfer to account and share screenshot via WhatsApp.'),
  ('jazzcash', 'JazzCash', 'Pay via JazzCash mobile wallet', 3, 'Send payment to merchant number and share TID.'),
  ('easypaisa', 'Easypaisa', 'Pay via Easypaisa wallet', 4, 'Send payment to merchant number and share TID.'),
  ('card', 'Credit / Debit Card', 'Pay securely with your card', 5, 'Card payments are processed at checkout.');

CREATE TABLE public.image_optimization_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid,
  image_url text NOT NULL,
  action text NOT NULL,
  original_size integer,
  new_size integer,
  alt_text text,
  status text NOT NULL DEFAULT 'success',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.image_optimization_log TO authenticated;
GRANT ALL ON public.image_optimization_log TO service_role;

ALTER TABLE public.image_optimization_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage image log" ON public.image_optimization_log
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS image_alts jsonb NOT NULL DEFAULT '[]'::jsonb;