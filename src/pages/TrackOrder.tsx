import { useState } from "react";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Package, Check, Truck, Home } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatPKR } from "@/lib/storage";
import { toast } from "sonner";

export default function TrackOrder() {
  const [order, setOrder] = useState<any | null>(null);
  const [num, setNum] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);

  const lookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.rpc("track_order", {
      p_order_number: num.trim(),
      p_contact: contact.trim(),
    });
    setLoading(false);
    if (error || !data || !data.length) {
      toast.error("Order not found, or email/phone doesn't match");
      setOrder(null);
      return;
    }
    setOrder(data[0]);
  };

  const statusOrder = ["placed","processing","shipped","out_for_delivery","delivered"];
  const labels: Record<string,string> = { placed: "Order Placed", processing: "Processing", shipped: "Shipped", out_for_delivery: "Out for Delivery", delivered: "Delivered" };
  const icons: Record<string, any> = { placed: Check, processing: Check, shipped: Truck, out_for_delivery: Truck, delivered: Home };
  const idx = order ? statusOrder.indexOf(order.status) : -1;

  return (
    <>
      <SEO title="Track Order | libani" />
      <div className="container-x py-6 max-w-2xl">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Track Order" }]} />
        <div className="mt-6 bg-card border border-border rounded-lg p-6 md:p-8">
          <div className="flex items-center gap-3"><Package className="h-6 w-6 text-primary" /><h1 className="font-display text-xl font-bold">Track Your Order</h1></div>
          <form onSubmit={lookup} className="mt-5 space-y-3">
            <div><Label>Order number</Label><Input required placeholder="TZ-123456" value={num} onChange={(e) => setNum(e.target.value)} /></div>
            <div><Label>Email or phone</Label><Input required placeholder="you@example.com" value={contact} onChange={(e) => setContact(e.target.value)} /></div>
            <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">{loading ? "Looking up…" : "Track"}</Button>
          </form>

          {order && (
            <div className="mt-8 border-t border-border pt-6">
              <div className="flex justify-between text-sm mb-4"><div><p className="text-muted-foreground text-xs">Order</p><p className="font-mono">{order.order_number}</p></div><div className="text-right"><p className="text-muted-foreground text-xs">Total</p><p className="price font-bold">{formatPKR(Number(order.total))}</p></div></div>
              <ol className="space-y-4">{statusOrder.map((s, i) => {
                const Icon = icons[s];
                const done = i < idx;
                const active = i === idx;
                return (
                  <li key={s} className="flex gap-3">
                    <span className={`grid place-items-center h-8 w-8 rounded-full ${active ? "bg-primary text-primary-foreground" : done ? "bg-success text-success-foreground" : "bg-surface text-muted-foreground"}`}><Icon className="h-4 w-4" /></span>
                    <div><p className="font-medium text-sm">{labels[s]}</p><p className="text-xs text-muted-foreground">{active ? "In progress" : done ? "Done" : "Pending"}</p></div>
                  </li>
                );
              })}</ol>
            </div>
          )}
        </div>
      </div>
    </>
  );
}