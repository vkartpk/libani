import { useEffect, useState } from "react";
import { AccountLayout } from "./AccountLayout";
import { supabase } from "@/lib/supabase";
import { formatPKR } from "@/lib/storage";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [open, setOpen] = useState<any | null>(null);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("orders").select("*").order("created_at", { ascending: false }).then(({ data }) => setOrders(data ?? []));
  }, []);

  const openOrder = async (o: any) => {
    setOpen(o);
    const { data } = await supabase.from("order_items").select("*").eq("order_id", o.id);
    setItems(data ?? []);
  };

  return (
    <AccountLayout>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {orders.length === 0 ? <p className="p-8 text-center text-muted-foreground text-sm">No orders yet.</p> : (
        <table className="w-full text-sm">
          <thead className="bg-surface text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="text-left p-3">Order</th><th className="text-left p-3 hidden sm:table-cell">Date</th><th className="text-left p-3">Status</th><th className="text-right p-3">Total</th></tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} onClick={() => openOrder(o)} className="border-t border-border cursor-pointer hover:bg-surface/50">
                <td className="p-3 font-mono">{o.order_number}</td>
                <td className="p-3 hidden sm:table-cell">{new Date(o.created_at).toLocaleDateString()}</td>
                <td className="p-3"><span className="px-2 py-0.5 rounded bg-surface text-xs uppercase">{o.status}</span></td>
                <td className="p-3 text-right price font-bold">{formatPKR(Number(o.total))}</td>
              </tr>
            ))}
          </tbody>
        </table>)}
      </div>

      <Sheet open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto bg-card border-border">
          {open && (
            <>
              <SheetHeader><SheetTitle className="font-display">Order {open.order_number}</SheetTitle></SheetHeader>
              <div className="mt-4 text-sm space-y-3">
                <p className="text-muted-foreground">Placed {new Date(open.created_at).toLocaleString()}</p>
                <p>Status: <span className="px-2 py-0.5 rounded bg-surface text-xs uppercase">{open.status}</span></p>
                <p>Payment: <span className="uppercase">{open.payment_method}</span></p>
                <div>
                  <h3 className="font-display font-bold mt-4 mb-2">Items</h3>
                  <div className="space-y-2">
                    {items.map((it) => (
                      <div key={it.id} className="flex gap-3 border border-border rounded p-2">
                        {it.product_image && <img src={it.product_image} alt="" className="h-14 w-14 object-cover rounded" />}
                        <div className="flex-1"><p className="text-sm font-medium line-clamp-1">{it.product_name}</p><p className="text-xs text-muted-foreground">Qty {it.quantity} × {formatPKR(Number(it.unit_price))}</p></div>
                        <span className="price font-bold">{formatPKR(Number(it.line_total))}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t border-border pt-3 space-y-1">
                  <Row label="Subtotal" v={formatPKR(Number(open.subtotal))} />
                  <Row label="Shipping" v={Number(open.shipping) === 0 ? "Free" : formatPKR(Number(open.shipping))} />
                  {Number(open.discount) > 0 && <Row label="Discount" v={`-${formatPKR(Number(open.discount))}`} />}
                  <Row label="Total" v={formatPKR(Number(open.total))} bold />
                </div>
                <div>
                  <h3 className="font-display font-bold mt-4 mb-2">Shipping address</h3>
                  <pre className="text-xs whitespace-pre-wrap font-sans bg-surface p-2 rounded">{JSON.stringify(open.shipping_address, null, 2)}</pre>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </AccountLayout>
  );
}

function Row({ label, v, bold }: { label: string; v: string; bold?: boolean }) {
  return <div className={`flex justify-between ${bold ? "font-bold text-base pt-2 border-t border-border" : ""}`}><span className={bold ? "" : "text-muted-foreground"}>{label}</span><span className="price">{v}</span></div>;
}