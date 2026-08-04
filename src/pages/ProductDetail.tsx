import { useEffect, useState } from "react";
import { Navigate, useParams, Link } from "react-router-dom";
import { getProduct, products } from "@/data/products";
import { getBrand } from "@/data/brands";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext";
import { formatPKR } from "@/lib/storage";
import { ShoppingCart, Heart, Minus, Plus, Truck, Zap, RefreshCw, Lock } from "lucide-react";
import { toast } from "sonner";

export default function ProductDetail() {
  const { slug = "" } = useParams();
  const product = getProduct(slug);
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [variant, setVariant] = useState<string | undefined>();
  const { add, setDrawerOpen } = useCart();
  const wish = useWishlist();
  const rv = useRecentlyViewed();

  useEffect(() => { if (product) rv.track(product.id); /* eslint-disable-next-line */ }, [product?.id]);

  if (!product) return <Navigate to="/404" replace />;
  const brand = getBrand(product.brand);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const recent = rv.ids.map((id) => products.find((p) => p.id === id)).filter(Boolean).filter((p) => p!.id !== product.id).slice(0, 6);

  const ld = {
    "@context": "https://schema.org", "@type": "Product",
    name: product.name, image: product.images, description: product.description,
    brand: { "@type": "Brand", name: brand?.name ?? product.brand },
    sku: product.sku,
    offers: { "@type": "Offer", priceCurrency: "PKR", price: product.price, availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock" },
    aggregateRating: { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: product.reviewCount },
  };

  return (
    <>
      <SEO title={product.metaTitle} description={product.metaDescription} type="product" image={product.images[0]} jsonLd={ld} />
      <div className="container-x py-6">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: product.category, to: `/category/${product.category}` }, { label: product.name }]} />

        <div className="mt-6 grid lg:grid-cols-2 gap-8">
          <div>
            <div className="aspect-square rounded-lg overflow-hidden bg-surface">
              <img src={product.images[active]} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {product.images.map((src, i) => (
                <button key={i} onClick={() => setActive(i)} className={`aspect-square rounded overflow-hidden bg-surface border-2 ${i===active ? "border-primary" : "border-transparent"}`}>
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            {brand && <Link to={`/brand/${brand.slug}`} className="text-xs uppercase tracking-wider text-primary font-bold">{brand.name}</Link>}
            <h1 className="mt-1 font-display text-2xl md:text-3xl font-bold">{product.name}</h1>
            <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
              <span className="text-primary">★ {product.rating.toFixed(1)}</span>
              <span>({product.reviewCount} reviews)</span>
              <span>SKU: {product.sku}</span>
            </div>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="price text-3xl font-bold">{formatPKR(product.price)}</span>
              {product.compareAtPrice && <span className="price line-through text-muted-foreground">{formatPKR(product.compareAtPrice)}</span>}
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{product.description}</p>

            {product.variants.length > 0 && (
              <div className="mt-5">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Color</p>
                <div className="flex gap-2">
                  {product.variants.map((v) => (
                    <button key={v.id} onClick={() => setVariant(v.id)} disabled={!v.inStock} aria-label={v.label}
                      className={`h-9 w-9 rounded-full border-2 ${variant===v.id ? "border-primary" : "border-border"} ${!v.inStock && "opacity-40"}`}
                      style={{ background: v.value }} />
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center gap-3">
              <div className="flex items-center border border-border rounded">
                <button className="px-3 py-2" onClick={() => setQty((q) => Math.max(1, q - 1))}><Minus className="h-3 w-3" /></button>
                <span className="w-10 text-center text-sm">{qty}</span>
                <button className="px-3 py-2" onClick={() => setQty((q) => q + 1)}><Plus className="h-3 w-3" /></button>
              </div>
              <Button
                disabled={!product.inStock}
                onClick={() => { add(product.id, qty, variant); setDrawerOpen(true); toast.success("Added to cart ✓"); }}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
              >
                <ShoppingCart className="h-4 w-4" /> Add to cart
              </Button>
              <Button variant="outline" size="icon" aria-label="Wishlist" onClick={() => { const a = wish.toggle(product.id); toast(a ? "Added to wishlist ♥" : "Removed from wishlist"); }}>
                <Heart className={`h-4 w-4 ${wish.has(product.id) && "fill-primary text-primary"}`} />
              </Button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
              {[[Truck,"Delivery charges apply"],[Zap,"Delivered in 2-3 days"],[RefreshCw,"7-day easy returns"],[Lock,"Secure payment"]].map(([Ic, t], i) => (
                <div key={i} className="flex items-center gap-2"><Ic className="h-4 w-4 text-primary" /> {t as string}</div>
              ))}
            </div>

            <ul className="mt-5 space-y-1 text-sm">{product.features.map((f) => <li key={f}>✓ {f}</li>)}</ul>
          </div>
        </div>

        <Tabs defaultValue="desc" className="mt-12">
          <TabsList className="bg-card">
            <TabsTrigger value="desc">Description</TabsTrigger>
            <TabsTrigger value="specs">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.reviewCount})</TabsTrigger>
          </TabsList>
          <TabsContent value="desc" className="mt-4 text-sm text-muted-foreground leading-relaxed">{product.description}</TabsContent>
          <TabsContent value="specs" className="mt-4">
            <table className="w-full text-sm">
              <tbody>{product.specs.map((s) => (
                <tr key={s.key} className="border-b border-border"><td className="py-2 font-semibold w-1/3">{s.key}</td><td className="py-2 text-muted-foreground">{s.value}</td></tr>
              ))}</tbody>
            </table>
          </TabsContent>
          <TabsContent value="reviews" className="mt-4 text-sm text-muted-foreground">No reviews yet — be the first!</TabsContent>
        </Tabs>

        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="section-title">You Might Also Like</h2>
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}

        {recent.length > 0 && (
          <section className="mt-14">
            <h2 className="section-title">Recently Viewed</h2>
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {recent.map((p) => <ProductCard key={p!.id} product={p!} />)}
            </div>
          </section>
        )}
      </div>
    </>
  );
}