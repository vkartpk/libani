import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "./AdminLayout";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { DollarSign, ShoppingBag, TrendingUp, Wallet, Pencil, Trash2, Plus } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";

type RangeKey = "7d" | "30d" | "90d" | "12mo";
const RANGE_DAYS: Record<RangeKey, number> = { "7d": 7, "30d": 30, "90d": 90, "12mo": 365 };

const EXPENSE_CATEGORIES = ["Inventory/COGS", "Marketing", "Shipping", "Salaries", "Software", "Rent", "Other"];
const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--secondary))", "#f59e0b", "#10b981", "#ef4444", "#6366f1"];

const fmt = (n: number) => `Rs ${Math.round(n).toLocaleString()}`;

type Order = { created_at: string; total: number; payment_method: string; status: string };
type Expense = { id: string; category: string; description: string | null; amount: number; expense_date: string };

export default function AdminFinance() {
  const { user } = useAuth();
  const [range, setRange] = useState<RangeKey>("30d");
  const [orders, setOrders] = useState<Order[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [topProducts, setTopProducts] = useState<{ name: string; qty: number; revenue: number }[]>([]);
  const [loading, setLoading] = useState(true);

  const since = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - RANGE_DAYS[range]);
    return d;
  }, [range]);

  const refresh = async () => {
    setLoading(true);
    const sinceIso = since.toISOString();
    const sinceDate = sinceIso.slice(0, 10);
    const [{ data: ord }, { data: exp }, { data: items }] = await Promise.all([
      supabase.from("orders").select("created_at,total,payment_method,status").gte("created_at", sinceIso),
      supabase.from("expenses").select("id,category,description,amount,expense_date").gte("expense_date", sinceDate).order("expense_date", { ascending: false }),
      supabase.from("order_items").select("product_name,quantity,line_total,created_at").gte("created_at", sinceIso),
    ]);
    setOrders((ord || []) as Order[]);
    setExpenses((exp || []) as Expense[]);
    const map = new Map<string, { qty: number; revenue: number }>();
    (items || []).forEach((i: any) => {
      const cur = map.get(i.product_name) || { qty: 0, revenue: 0 };
      cur.qty += Number(i.quantity || 0);
      cur.revenue += Number(i.line_total || 0);
      map.set(i.product_name, cur);
    });
    setTopProducts(
      Array.from(map.entries())
        .map(([name, v]) => ({ name, ...v }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)
    );
    setLoading(false);
  };

  useEffect(() => { refresh(); /* eslint-disable-next-line */ }, [range]);

  const revenue = orders.reduce((s, o) => s + Number(o.total || 0), 0);
  const expensesTotal = expenses.reduce((s, e) => s + Number(e.amount || 0), 0);
  const profit = revenue - expensesTotal;
  const aov = orders.length ? revenue / orders.length : 0;

  const dailySeries = useMemo(() => {
    const days: Record<string, number> = {};
    for (let i = RANGE_DAYS[range] - 1; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      days[d.toISOString().slice(0, 10)] = 0;
    }
    orders.forEach((o) => {
      const k = new Date(o.created_at).toISOString().slice(0, 10);
      if (k in days) days[k] += Number(o.total || 0);
    });
    return Object.entries(days).map(([date, total]) => ({ date: date.slice(5), total }));
  }, [orders, range]);

  const methodSeries = useMemo(() => {
    const m: Record<string, number> = {};
    orders.forEach((o) => { m[o.payment_method || "unknown"] = (m[o.payment_method || "unknown"] || 0) + Number(o.total || 0); });
    return Object.entries(m).map(([name, value]) => ({ name, value }));
  }, [orders]);

  const statusSeries = useMemo(() => {
    const m: Record<string, number> = {};
    orders.forEach((o) => { m[o.status] = (m[o.status] || 0) + 1; });
    return Object.entries(m).map(([name, value]) => ({ name, value }));
  }, [orders]);

  const expensesByCategory = useMemo(() => {
    const m: Record<string, number> = {};
    expenses.forEach((e) => { m[e.category] = (m[e.category] || 0) + Number(e.amount); });
    return Object.entries(m).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  return (
    <AdminLayout title="Finance">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-muted-foreground">
          {loading ? "Loading…" : `${orders.length} orders · ${expenses.length} expenses`}
        </div>
        <Select value={range} onValueChange={(v) => setRange(v as RangeKey)}>
          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="12mo">Last 12 months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Kpi label="Revenue" value={fmt(revenue)} icon={DollarSign} />
            <Kpi label="Orders" value={orders.length.toLocaleString()} icon={ShoppingBag} />
            <Kpi label="Avg order value" value={fmt(aov)} icon={TrendingUp} />
            <Kpi label="Net profit" value={fmt(profit)} icon={Wallet} accent={profit >= 0 ? "text-emerald-500" : "text-red-500"} />
          </div>

          <Card className="p-4">
            <h3 className="font-semibold mb-3">Daily revenue</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailySeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))" }} />
                  <Line type="monotone" dataKey="total" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Revenue by payment method</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={methodSeries}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))" }} />
                    <Bar dataKey="value" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-3">Order status</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusSeries} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75}>
                      {statusSeries.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Legend />
                    <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <Card className="p-4">
            <h3 className="font-semibold mb-3">Top products</h3>
            <Table>
              <TableHeader>
                <TableRow><TableHead>Product</TableHead><TableHead className="text-right">Qty</TableHead><TableHead className="text-right">Revenue</TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {topProducts.map((p) => (
                  <TableRow key={p.name}>
                    <TableCell>{p.name}</TableCell>
                    <TableCell className="text-right">{p.qty}</TableCell>
                    <TableCell className="text-right">{fmt(p.revenue)}</TableCell>
                  </TableRow>
                ))}
                {!topProducts.length && <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-6">No sales in range</TableCell></TableRow>}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Kpi label="Revenue" value={fmt(revenue)} icon={DollarSign} />
            <Kpi label="Expenses" value={fmt(expensesTotal)} icon={Wallet} accent="text-red-500" />
            <Kpi label="Net profit" value={fmt(profit)} icon={TrendingUp} accent={profit >= 0 ? "text-emerald-500" : "text-red-500"} />
            <Kpi label="Margin" value={revenue ? `${Math.round((profit / revenue) * 100)}%` : "—"} icon={TrendingUp} />
          </div>

          {expensesByCategory.length > 0 && (
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Expenses by category</h3>
              <div className="flex flex-wrap gap-2">
                {expensesByCategory.map((c, i) => (
                  <div key={c.name} className="rounded-md border px-3 py-2 text-sm">
                    <span className="inline-block h-2 w-2 rounded-full mr-2" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-muted-foreground">{c.name}:</span> <span className="font-medium">{fmt(c.value)}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Expense entries</h3>
              <ExpenseDialog userId={user?.id} onSaved={refresh} />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="w-24"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell>{e.expense_date}</TableCell>
                    <TableCell>{e.category}</TableCell>
                    <TableCell className="text-muted-foreground">{e.description}</TableCell>
                    <TableCell className="text-right">{fmt(Number(e.amount))}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <ExpenseDialog userId={user?.id} existing={e} onSaved={refresh} />
                        <Button variant="ghost" size="icon" onClick={async () => {
                          if (!confirm("Delete this expense?")) return;
                          const { error } = await supabase.from("expenses").delete().eq("id", e.id);
                          if (error) toast({ title: "Delete failed", description: error.message, variant: "destructive" });
                          else { toast({ title: "Expense deleted" }); refresh(); }
                        }}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {!expenses.length && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-6">No expenses in range</TableCell></TableRow>}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}

function Kpi({ label, value, icon: Icon, accent }: { label: string; value: string; icon: any; accent?: string }) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className={`text-2xl font-bold mt-1 ${accent || ""}`}>{value}</div>
        </div>
        <Icon className="h-6 w-6 text-primary" />
      </div>
    </Card>
  );
}

function ExpenseDialog({ userId, existing, onSaved }: { userId?: string; existing?: Expense; onSaved: () => void }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    expense_date: existing?.expense_date || new Date().toISOString().slice(0, 10),
    category: existing?.category || EXPENSE_CATEGORIES[0],
    description: existing?.description || "",
    amount: existing?.amount?.toString() || "",
  });

  const save = async () => {
    const amt = Number(form.amount);
    if (!amt || amt <= 0) { toast({ title: "Enter a valid amount", variant: "destructive" }); return; }
    setSaving(true);
    const payload = {
      expense_date: form.expense_date,
      category: form.category,
      description: form.description || null,
      amount: amt,
      user_id: userId ?? null,
    };
    const { error } = existing
      ? await supabase.from("expenses").update(payload).eq("id", existing.id)
      : await supabase.from("expenses").insert(payload);
    setSaving(false);
    if (error) { toast({ title: "Save failed", description: error.message, variant: "destructive" }); return; }
    toast({ title: existing ? "Expense updated" : "Expense added" });
    setOpen(false);
    onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {existing
          ? <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
          : <Button size="sm"><Plus className="h-4 w-4" /> Add expense</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>{existing ? "Edit expense" : "Add expense"}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Date</Label>
            <Input type="date" value={form.expense_date} onChange={(e) => setForm({ ...form, expense_date: e.target.value })} />
          </div>
          <div>
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {EXPENSE_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Amount (PKR)</Label>
            <Input type="number" inputMode="decimal" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}