import { useState } from "react";
import { Link } from "react-router-dom";
import { featuredProducts } from "@/data/products";
import { formatPKR } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { ShoppingCart, ArrowRight } from "lucide-react";

export function FeaturedSpotlight() {
  const product = featuredProducts[0];
  const [active, setActive] = useState(0);
  const { add, setDrawerOpen } = useCart();
  if (!product) return null;
  return (
    <section className="container-x mt-14">
      <h2 className="section-title">Featured Spotlight</h2>
      <div className="mt-6 grid md:grid-cols-2 gap-8 items-center bg-card border border-border rounded-xl p-6 md:p-10">
        <div>
          <div className="aspect-square rounded-lg overflow-hidden bg-surface">
            <img src={product.images[active]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {product.images.slice(0,4).map((src, i) => (
              <button key={i} onClick={() => setActive(i)} className={`aspect-square rounded overflow-hidden bg-surface border-2 ${i===active ? "border-primary" : "border-transparent"}`}>
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-primary font-bold">{product.brand}</p>
          <h3 className="mt-2 text-2xl md:text-3xl font-bold">{product.name}</h3>
          <div className="mt-3 flex items-baseline gap-3">
            <span className="price text-3xl font-bold">{formatPKR(product.price)}</span>
            {product.compareAtPrice && <span className="price line-through text-muted-foreground">{formatPKR(product.compareAtPrice)}</span>}
          </div>
          <p className="mt-4 text-muted-foreground">{product.description}</p>
          <ul className="mt-4 space-y-1 text-sm">
            {product.features.slice(0,4).map((f) => <li key={f}>✓ {f}</li>)}
          </ul>
          <div className="mt-6 flex gap-3">
            <Button onClick={() => { add(product.id); setDrawerOpen(true); toast.success("Added to cart ✓"); }} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
              <ShoppingCart className="h-4 w-4" /> Add to cart
            </Button>
            <Button asChild variant="outline">
              <Link to={`/products/${product.slug}`}>Details <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}