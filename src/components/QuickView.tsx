import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { Product } from "@/data/types";
import { Button } from "@/components/ui/button";
import { formatPKR } from "@/lib/storage";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";

export function QuickView({ product, onOpenChange }: { product: Product | null; onOpenChange: (v: boolean) => void }) {
  const { add, setDrawerOpen } = useCart();
  if (!product) return null;
  return (
    <Dialog open={!!product} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-card border-border">
        <DialogTitle className="sr-only">{product.name}</DialogTitle>
        <div className="grid md:grid-cols-2 gap-6">
          <img src={product.images[0]} alt={product.name} className="rounded-lg w-full aspect-square object-cover bg-surface" />
          <div className="flex flex-col gap-3">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">{product.brand}</span>
            <h2 className="text-xl font-bold">{product.name}</h2>
            <div className="flex items-baseline gap-2">
              <span className="price text-2xl font-bold">{formatPKR(product.price)}</span>
              {product.compareAtPrice && (
                <span className="price text-sm line-through text-muted-foreground">{formatPKR(product.compareAtPrice)}</span>
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-4">{product.description}</p>
            <div className="mt-auto flex flex-col gap-2">
              <Button
                onClick={() => { add(product.id); setDrawerOpen(true); toast.success("Added to cart ✓"); onOpenChange(false); }}
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
              >
                <ShoppingCart className="h-4 w-4" /> Add to cart
              </Button>
              <Button asChild variant="outline">
                <Link to={`/products/${product.slug}`}>View full details</Link>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}