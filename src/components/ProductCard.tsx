import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Eye, BarChart2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "@/data/types";
import { formatPKR } from "@/lib/storage";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCompare } from "@/contexts/CompareContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Props = { product: Product; onQuickView?: (p: Product) => void };

export function ProductCard({ product, onQuickView }: Props) {
  const [hover, setHover] = useState(false);
  const { add, setDrawerOpen } = useCart();
  const wish = useWishlist();
  const wished = wish.has(product.id);
  const compare = useCompare();
  const compared = compare.has(product.id);

  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) {
      toast.error("Out of stock");
      return;
    }
    add(product.id, 1);
    setDrawerOpen(true);
    toast.success("Added to cart ✓");
  };

  const handleWish = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = wish.toggle(product.id);
    toast(added ? "Added to wishlist ♥" : "Removed from wishlist");
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    compare.toggle(product.id);
  };

  return (
    <Link
      to={`/products/${product.slug}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group relative flex flex-col bg-card border border-border rounded-lg overflow-hidden lift-hover focus:outline-none focus:ring-2 focus:ring-primary"
    >
      <div className="relative aspect-square overflow-hidden bg-surface">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          width={400}
          height={400}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
            hover && product.images[1] ? "opacity-0" : "opacity-100",
          )}
        />
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt=""
            loading="lazy"
            width={400}
            height={400}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
              hover ? "opacity-100" : "opacity-0",
            )}
          />
        )}

        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isOnSale && discount > 0 && (
            <Badge className="bg-primary text-primary-foreground border-0">-{discount}%</Badge>
          )}
          {product.isNewArrival && (
            <Badge className="bg-success text-success-foreground border-0">NEW</Badge>
          )}
        </div>

        {!product.inStock && (
          <div className="absolute inset-0 bg-background/70 flex items-center justify-center backdrop-blur-sm">
            <span className="text-sm font-bold tracking-wider">OUT OF STOCK</span>
          </div>
        )}

        <button
          onClick={handleWish}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-2 right-2 h-9 w-9 rounded-full bg-background/80 backdrop-blur grid place-items-center hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          <Heart className={cn("h-4 w-4", wished && "fill-primary text-primary")} />
        </button>

        <button
          onClick={handleCompare}
          aria-label={compared ? "Remove from compare" : "Add to compare"}
          className={cn("absolute top-12 right-2 h-9 w-9 rounded-full bg-background/80 backdrop-blur grid place-items-center hover:bg-primary hover:text-primary-foreground transition-colors", compared && "bg-primary text-primary-foreground")}
        >
          <BarChart2 className="h-4 w-4" />
        </button>

        {onQuickView && (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onQuickView(product); }}
            aria-label="Quick view"
            className="hidden md:grid absolute top-[5.5rem] right-2 h-9 w-9 rounded-full bg-background/80 backdrop-blur place-items-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-primary-foreground"
          >
            <Eye className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="p-3 flex flex-col gap-1 flex-1">
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{product.brand}</span>
        <h3 className="font-medium text-sm leading-snug line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span className="text-primary">★</span>
          <span>{product.rating.toFixed(1)}</span>
          <span>({product.reviewCount})</span>
        </div>
        <div className="mt-auto pt-2 flex items-baseline gap-2">
          <span className="price font-bold">{formatPKR(product.price)}</span>
          {product.compareAtPrice && (
            <span className="price text-xs text-muted-foreground line-through">
              {formatPKR(product.compareAtPrice)}
            </span>
          )}
        </div>
        <Button
          size="sm"
          onClick={handleAdd}
          disabled={!product.inStock}
          className="mt-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
        >
          <ShoppingCart className="h-4 w-4" /> Add to cart
        </Button>
      </div>
    </Link>
  );
}