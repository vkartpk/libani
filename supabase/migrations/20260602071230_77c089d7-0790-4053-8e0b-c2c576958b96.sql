CREATE TABLE public.expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  category text NOT NULL,
  description text,
  amount numeric NOT NULL DEFAULT 0,
  expense_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.expenses TO authenticated;
GRANT ALL ON public.expenses TO service_role;

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view expenses" ON public.expenses FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins insert expenses" ON public.expenses FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins update expenses" ON public.expenses FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins delete expenses" ON public.expenses FOR DELETE USING (public.is_admin());

CREATE TRIGGER update_expenses_updated_at
  BEFORE UPDATE ON public.expenses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_expenses_date ON public.expenses(expense_date DESC);