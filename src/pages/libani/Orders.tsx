import { useEffect, useState } from "react";
import { AdminLayout } from "./AdminLayout";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const STATUSES = ["placed", "processing", "shipped", "out_for_delivery", "delivered", "cancelled"];

const SITE_ORIGIN = "https://libani.pk";
function imgUrl(src?: string | null) {
  if (!src) return null;
  if (/^https?:\/\//i.test(src)) return src;
  return `${SITE_ORIGIN}${src.startsWith("/") ? "" : "/"}${src}`;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [open, setOpen] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);

  const load = async () => {
    let q = supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(200);
    if (filter !== "all") q = q.eq("status", filter);
    const { data } = await q;
    setOrders(data || []);
  };

  useEffect(() => { load(); }, [filter]);

  const openOrder = async (o: any) => {
    setOpen(o);
    const { data } = await supabase.from("order_items").select("*").eq("order_id", o.id);
    setItems(data || []);
  };

  const updateStatus = async (status: string) => {
    if (!open) return;
    const { error } = await supabase.from("orders").update({ status }).eq("id", open.id);
    if (error) return toast.error(error.message);
    toast.success(`Order marked ${status}`);
    setOpen({ ...open, status });
    load();
  };

  return (
    <AdminLayout title="Orders">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="text-sm text-muted-foreground">{orders.length} orders</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr><th className="py-2">Order #</th><th>Email</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} className="border-t cursor-pointer hover:bg-muted/40" onClick={() => openOrder(o)}>
                  <td className="py-2 font-mono">{o.order_number}</td>
                  <td>{o.email}</td>
                  <td>Rs {Number(o.total).toLocaleString()}</td>
                  <td className="capitalize">{o.payment_method}</td>
                  <td><span className="rounded-full bg-muted px-2 py-0.5 text-xs">{o.status}</span></td>
                  <td>{new Date(o.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {!orders.length && <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">No orders</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      <Sheet open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {open && (
            <>
              <SheetHeader><SheetTitle>Order {open.order_number}</SheetTitle></SheetHeader>
              <div className="mt-4 space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div><div className="text-muted-foreground">Email</div>{open.email}</div>
                  <div><div className="text-muted-foreground">Phone</div>{open.phone}</div>
                  <div><div className="text-muted-foreground">Payment</div><span className="capitalize">{open.payment_method}</span></div>
                  <div><div className="text-muted-foreground">Total</div>Rs {Number(open.total).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1">Update status</div>
                  <div className="flex gap-2 flex-wrap">
                    {STATUSES.map(s => (
                      <Button key={s} size="sm" variant={open.status === s ? "default" : "outline"} onClick={() => updateStatus(s)}>
                        {s}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1">Items</div>
                  <div className="space-y-2">
                    {items.map(it => (
                      <div key={it.id} className="flex items-center gap-3 border-b py-2">
                        {imgUrl(it.product_image) ? (
                          <img
                            src={imgUrl(it.product_image)!}
                            alt={it.product_name}
                            className="h-12 w-12 rounded object-cover border border-border shrink-0 bg-muted"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded bg-muted shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="truncate font-medium">{it.product_name}{it.variant_label && ` (${it.variant_label})`}</div>
                          <div className="text-xs text-muted-foreground">
                            {it.product_sku && <>SKU: {it.product_sku} · </>}Qty {it.quantity}
                          </div>
                        </div>
                        <div className="text-right shrink-0">Rs {Number(it.line_total).toLocaleString()}</div>
                      </div>
                    ))}
                    {!items.length && <div className="text-xs text-muted-foreground py-2">No items found for this order</div>}
                  </div>
                  <div className="mt-2 rounded bg-muted p-3 text-xs space-y-1">
                    <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>Rs {Number(open.subtotal).toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>Rs {Number(open.shipping).toLocaleString()}</span></div>
                    {Number(open.discount) > 0 && (
                      <div className="flex justify-between"><span className="text-muted-foreground">Discount</span><span>-Rs {Number(open.discount).toLocaleString()}</span></div>
                    )}
                    <div className="flex justify-between font-semibold pt-1 border-t border-border/60"><span>Total</span><span>Rs {Number(open.total).toLocaleString()}</span></div>
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1">Shipping address</div>
                  <div className="bg-muted rounded p-3 space-y-2">
                    <div className="font-medium">{open.shipping_address?.fullName}</div>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                      <div><span className="text-muted-foreground">Email: </span>{open.shipping_address?.email}</div>
                      <div><span className="text-muted-foreground">Phone: </span>{open.shipping_address?.phone}</div>
                    </div>
                    <div className="text-xs pt-1 border-t border-border/60">
                      <div>{open.shipping_address?.address1}</div>
                      {open.shipping_address?.address2 && <div>{open.shipping_address.address2}</div>}
                      <div>
                        {[open.shipping_address?.city, open.shipping_address?.province, open.shipping_address?.postal]
                          .filter(Boolean)
                          .join(", ")}
                      </div>
                    </div>
                    {open.shipping_address?.notes && (
                      <div className="text-xs pt-1 border-t border-border/60">
                        <span className="text-muted-foreground">Notes: </span>{open.shipping_address.notes}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </AdminLayout>
  );
}
