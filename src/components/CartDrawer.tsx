import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { formatPKR } from "@/lib/storage";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export function CartDrawer() {
  const { drawerOpen, setDrawerOpen, enriched, setQty, remove, subtotal, shipping, count } = useCart();
  const { settings } = useSiteSettings();

  return (
    <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col bg-card border-border">
        <SheetHeader>
          <SheetTitle>Your cart ({count})</SheetTitle>
        </SheetHeader>

        {enriched.length === 0 ? (
          <div className="flex-1 grid place-items-center text-center gap-3 py-12">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">Your cart is empty</p>
            <Button onClick={() => setDrawerOpen(false)} variant="outline">Continue shopping</Button>
          </div>
        ) : (
          <>
            <div className="my-3 text-xs text-muted-foreground">
              Delivery charges <span className="text-foreground font-semibold">{formatPKR(Number(settings.shipping_fee || 0))}</span> · payable on delivery
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto -mx-6 px-6 divide-y divide-border">
              {enriched.map(({ item, product }) => (
                <div key={`${item.productId}-${item.variantId ?? ""}`} className="py-4 flex gap-3">
                  <img src={product.images[0]} alt={product.name} className="h-16 w-16 rounded object-cover bg-surface" loading="lazy" />
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${product.slug}`} onClick={() => setDrawerOpen(false)} className="text-sm font-medium line-clamp-2 hover:text-primary">
                      {product.name}
                    </Link>
                    <p className="price text-sm font-bold mt-1">{formatPKR(product.price)}</p>
                    <div className="mt-2 flex items-center gap-1">
                      <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => setQty(item.productId, item.qty - 1, item.variantId)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm">{item.qty}</span>
                      <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => setQty(item.productId, item.qty + 1, item.variantId)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                      <button onClick={() => remove(item.productId, item.variantId)} aria-label="Remove" className="ml-auto text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="price font-bold">{formatPKR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery</span>
                <span className="price">{formatPKR(shipping)}</span>
              </div>
              <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => setDrawerOpen(false)}>
                <Link to="/checkout">Checkout</Link>
              </Button>
              <Button asChild variant="outline" className="w-full" onClick={() => setDrawerOpen(false)}>
                <Link to="/cart">View cart</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}