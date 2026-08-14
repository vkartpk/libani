import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { formatPKR } from "@/lib/storage";
import { Check } from "lucide-react";
import { toast } from "sonner";

const schema = z.object({
  fullName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().regex(/^03\d{2}-?\d{7}$/, "Use 03XX-XXXXXXX format"),
  address1: z.string().trim().min(5).max(200),
  address2: z.string().max(200).optional(),
  city: z.string().trim().min(2).max(80),
  province: z.string().trim().min(2).max(80),
  postal: z.string().trim().min(4).max(10),
  notes: z.string().max(500).optional(),
});
type Form = z.infer<typeof schema>;

export default function Checkout() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [pay, setPay] = useState("cod");
  const [orderNo, setOrderNo] = useState("");
  const [placing, setPlacing] = useState(false);
  const [shippingData, setShippingData] = useState<Form | null>(null);
  const { enriched, total, clear, subtotal, shipping, discount, coupon } = useCart();
  const { user } = useAuth();
  const nav = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<Form>({ resolver: zodResolver(schema) });

  if (enriched.length === 0 && step !== 3) {
    return <div className="container-x py-12 text-center"><p>Your cart is empty.</p><Button asChild className="mt-4"><Link to="/products">Shop now</Link></Button></div>;
  }

  const onSubmit = (data: Form) => { setShippingData(data); setStep(2); };

  const placeOrder = async () => {
    if (!shippingData) return;
    setPlacing(true);
    const generatedNumber = "TZ-" + Math.floor(Math.random() * 900000 + 100000);
    const { data: order, error } = await supabase.from("orders").insert({
      user_id: user?.id ?? null,
      order_number: generatedNumber,
      email: shippingData.email,
      phone: shippingData.phone,
      subtotal, shipping, discount, total,
      coupon_code: coupon,
      payment_method: pay,
      shipping_address: shippingData,
      status: "placed",
    }).select().single();
    if (error || !order) { toast.error(error?.message ?? "Failed to place order"); setPlacing(false); return; }

    const items = enriched.map(({ item, product }) => ({
      order_id: order.id,
      product_id: product.id,
      product_slug: product.slug,
      product_name: product.name,
      product_image: product.images[0],
      variant_label: item.variantId ?? null,
      unit_price: product.price,
      quantity: item.qty,
      line_total: product.price * item.qty,
    }));
    await supabase.from("order_items").insert(items);

    // Fire-and-forget order confirmation email — never block checkout success on this.
    supabase.functions.invoke("send-order-confirmation", { body: { order_id: order.id } }).catch((e) => {
      console.error("send-order-confirmation failed:", e);
    });

    setOrderNo(order.order_number);
    clear();
    setStep(3);
    setPlacing(false);
  };

  return (
    <>
      <SEO title="Checkout | libani" />
      <div className="container-x py-6">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Cart", to: "/cart" }, { label: "Checkout" }]} />
        <h1 className="font-display text-2xl md:text-3xl font-bold mt-4">Checkout</h1>

        <div className="mt-6 flex items-center gap-2 text-xs">
          {["Cart","Shipping","Payment","Confirmation"].map((s, i) => {
            const n = i === 0 ? 0 : i;
            const active = (step === 1 && i <= 1) || (step === 2 && i <= 2) || (step === 3 && i <= 3);
            return <div key={s} className={`px-3 py-1 rounded ${active ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"}`}>{n+1 || 1}. {s}</div>;
          })}
        </div>

        <div className="mt-6 grid lg:grid-cols-[1fr_360px] gap-8">
          <div className="bg-card border border-border rounded-lg p-6">
            {step === 1 && (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <h2 className="font-display font-bold">Shipping Information</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div><Label>Full name</Label><Input {...register("fullName")} />{errors.fullName && <p className="text-xs text-destructive mt-1">{errors.fullName.message}</p>}</div>
                  <div><Label>Email</Label><Input type="email" {...register("email")} />{errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}</div>
                  <div><Label>Phone (03XX-XXXXXXX)</Label><Input {...register("phone")} />{errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>}</div>
                  <div><Label>City</Label><Input {...register("city")} />{errors.city && <p className="text-xs text-destructive mt-1">{errors.city.message}</p>}</div>
                  <div className="sm:col-span-2"><Label>Address line 1</Label><Input {...register("address1")} />{errors.address1 && <p className="text-xs text-destructive mt-1">{errors.address1.message}</p>}</div>
                  <div className="sm:col-span-2"><Label>Address line 2 (optional)</Label><Input {...register("address2")} /></div>
                  <div><Label>Province</Label><Input {...register("province")} />{errors.province && <p className="text-xs text-destructive mt-1">{errors.province.message}</p>}</div>
                  <div><Label>Postal code</Label><Input {...register("postal")} />{errors.postal && <p className="text-xs text-destructive mt-1">{errors.postal.message}</p>}</div>
                  <div className="sm:col-span-2"><Label>Order notes (optional)</Label><Input {...register("notes")} /></div>
                </div>
                <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">Continue to payment</Button>
              </form>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="font-display font-bold">Payment Method</h2>
                <RadioGroup value={pay} onValueChange={setPay} className="space-y-2">
                  {[
                    { v: "cod", t: "Cash on Delivery", d: "Pay when your order arrives." },
                    { v: "bank", t: "Bank Transfer", d: "Acct: libani Pvt Ltd · Meezan Bank · 0123-4567890" },
                    { v: "jc", t: "JazzCash / EasyPaisa", d: "We'll send you a payment link via SMS." },
                  ].map((o) => (
                    <Label key={o.v} className="flex gap-3 p-3 border border-border rounded cursor-pointer hover:border-primary">
                      <RadioGroupItem value={o.v} className="mt-1" />
                      <div><p className="font-medium text-sm">{o.t}</p><p className="text-xs text-muted-foreground">{o.d}</p></div>
                    </Label>
                  ))}
                </RadioGroup>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                  <Button onClick={placeOrder} disabled={placing} className="bg-primary hover:bg-primary/90 text-primary-foreground">{placing ? "Placing…" : "Place order"}</Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="text-center py-8">
                <span className="grid mx-auto place-items-center h-16 w-16 rounded-full bg-success text-success-foreground"><Check className="h-8 w-8" /></span>
                <h2 className="mt-4 font-display text-2xl font-bold">Your order has been placed!</h2>
                <p className="mt-2 text-muted-foreground">Order number: <span className="font-mono text-foreground">{orderNo}</span></p>
                <p className="mt-2 text-sm text-muted-foreground">We'll call you within 24 hours to confirm.</p>
                <div className="mt-5 flex justify-center gap-3">
                  <Button asChild variant="outline"><Link to="/track-order">Track order</Link></Button>
                  <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => nav("/")}><Link to="/">Continue shopping</Link></Button>
                </div>
              </div>
            )}
          </div>

          {step !== 3 && (
            <div className="bg-card border border-border rounded-lg p-6 h-fit lg:sticky lg:top-32">
              <h3 className="font-display font-bold mb-3">Order Summary</h3>
              <div className="space-y-2 text-sm max-h-64 overflow-y-auto">
                {enriched.map(({ item, product }) => (
                  <div key={product.id} className="flex justify-between gap-2">
                    <span className="truncate">{product.name} × {item.qty}</span>
                    <span className="price shrink-0">{formatPKR(product.price * item.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="price">{formatPKR(subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Delivery charges</span><span className="price">{formatPKR(shipping)}</span></div>
                {discount > 0 && <div className="flex justify-between text-success"><span>Discount</span><span className="price">-{formatPKR(discount)}</span></div>}
                <div className="flex justify-between text-lg pt-2 border-t border-border"><span className="font-bold">Total</span><span className="price font-bold">{formatPKR(total)}</span></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}