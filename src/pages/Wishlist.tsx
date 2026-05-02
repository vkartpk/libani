import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useWishlist } from "@/contexts/WishlistContext";
import { products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export default function Wishlist() {
  const { ids } = useWishlist();
  const items = ids.map((id) => products.find((p) => p.id === id)).filter(Boolean);
  return (
    <>
      <SEO title="Wishlist | TechZone" />
      <div className="container-x py-6">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Wishlist" }]} />
        <h1 className="font-display text-2xl md:text-3xl font-bold mt-4">Your Wishlist</h1>
        {items.length === 0 ? (
          <div className="mt-12 text-center">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto" />
            <p className="mt-3 text-muted-foreground">Your wishlist is empty</p>
            <Button asChild className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"><Link to="/products">Browse products</Link></Button>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((p) => <ProductCard key={p!.id} product={p!} />)}
          </div>
        )}
      </div>
    </>
  );
}