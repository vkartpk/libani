import { Link } from "react-router-dom";
import { useState } from "react";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPKR } from "@/lib/storage";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

export default function Cart() {
  const { enriched, setQty, remove, subtotal, shipping, discount, total, applyCoupon, coupon } = useCart();
  const [code, setCode] = useState("");

  return (
    <>
      <SEO title="Cart | libani" description="Review your cart and checkout securely." />
      <div className="container-x py-6">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Cart" }]} />
        <h1 className="font-display text-2xl md:text-3xl font-bold mt-4">Your Cart</h1>

        {enriched.length === 0 ? (
          <div className="mt-12 text-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto" />
            <p className="mt-3 text-muted-foreground">Your cart is empty</p>
            <Button asChild className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"><Link to="/products">Start shopping</Link></Button>
          </div>
        ) : (
          <div className="mt-6 grid lg:grid-cols-[1fr_360px] gap-8">
            <div className="bg-card border border-border rounded-lg divide-y divide-border">
              {enriched.map(({ item, product }) => (
                <div key={`${item.productId}-${item.variantId ?? ""}`} className="p-4 flex gap-4">
                  <img src={product.images[0]} alt={product.name} className="h-20 w-20 rounded object-cover bg-surface" />
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${product.slug}`} className="font-medium hover:text-primary">{product.name}</Link>
                    <p className="text-xs text-muted-foreground">{product.brand}</p>
                    <p className="price font-bold mt-1">{formatPKR(product.price)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center border border-border rounded">
                      <button className="px-2 py-1" onClick={() => setQty(item.productId, item.qty - 1, item.variantId)}><Minus className="h-3 w-3" /></button>
                      <span className="w-8 text-center text-sm">{item.qty}</span>
                      <button className="px-2 py-1" onClick={() => setQty(item.productId, item.qty + 1, item.variantId)}><Plus className="h-3 w-3" /></button>
                    </div>
                    <button onClick={() => remove(item.productId, item.variantId)} className="text-muted-foreground hover:text-destructive" aria-label="Remove"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-card border border-border rounded-lg p-6 h-fit">
              <h2 className="font-display font-bold mb-4">Order Summary</h2>
              <div className="flex gap-2 mb-4">
                <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Coupon (try SAVE10)" />
                <Button variant="outline" onClick={() => { const ok = applyCoupon(code); toast[ok ? "success" : "error"](ok ? "Coupon applied!" : "Invalid coupon"); }}>Apply</Button>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="price font-medium">{formatPKR(subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="price font-medium">{shipping === 0 ? "Free" : formatPKR(shipping)}</span></div>
                {discount > 0 && <div className="flex justify-between text-success"><span>Discount {coupon && `(${coupon})`}</span><span className="price">-{formatPKR(discount)}</span></div>}
                <div className="flex justify-between text-lg pt-3 border-t border-border"><span className="font-bold">Total</span><span className="price font-bold">{formatPKR(total)}</span></div>
              </div>
              <Button asChild className="w-full mt-5 bg-primary hover:bg-primary/90 text-primary-foreground"><Link to="/checkout">Proceed to Checkout</Link></Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}