import { useEffect, useState } from "react";
import { AdminLayout } from "./AdminLayout";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { ShoppingBag, DollarSign, Package, Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ orders: 0, revenue: 0, products: 0, customers: 0 });
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const since = new Date(Date.now() - 30 * 86400000).toISOString();
      const [{ count: oc }, { data: revRows }, { count: pc }, { count: cc }, { data: r }] = await Promise.all([
        supabase.from("orders").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("total").gte("created_at", since),
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("order_number,email,total,status,created_at").order("created_at", { ascending: false }).limit(8),
      ]);
      setStats({
        orders: oc || 0,
        revenue: (revRows || []).reduce((s, r: any) => s + Number(r.total || 0), 0),
        products: pc || 0,
        customers: cc || 0,
      });
      setRecent(r || []);
    })();
  }, []);

  const cards = [
    { label: "Total Orders", value: stats.orders.toLocaleString(), icon: ShoppingBag },
    { label: "Revenue (30d)", value: `Rs ${stats.revenue.toLocaleString()}`, icon: DollarSign },
    { label: "Products", value: stats.products.toLocaleString(), icon: Package },
    { label: "Customers", value: stats.customers.toLocaleString(), icon: Users },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map((c) => (
          <Card key={c.label} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">{c.label}</div>
                <div className="text-2xl font-bold mt-1">{c.value}</div>
              </div>
              <c.icon className="h-6 w-6 text-primary" />
            </div>
          </Card>
        ))}
      </div>
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Recent Orders</h2>
          <Link to="/libani/orders" className="text-sm text-primary hover:underline">View all</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr><th className="py-2">Order #</th><th>Email</th><th>Total</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              {recent.map((o) => (
                <tr key={o.order_number} className="border-t">
                  <td className="py-2 font-mono">{o.order_number}</td>
                  <td>{o.email}</td>
                  <td>Rs {Number(o.total).toLocaleString()}</td>
                  <td><span className="inline-block rounded-full bg-muted px-2 py-0.5 text-xs">{o.status}</span></td>
                  <td>{new Date(o.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {!recent.length && <tr><td colSpan={5} className="py-6 text-center text-muted-foreground">No orders yet</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </AdminLayout>
  );
}
