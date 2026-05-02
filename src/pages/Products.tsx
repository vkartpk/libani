import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/products";
import { brands } from "@/data/brands";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Filter as FilterIcon } from "lucide-react";

type Props = { title?: string; preset?: { brand?: string; category?: string }; description?: string };

export default function Products({ title = "All Products", preset, description }: Props) {
  const [params] = useSearchParams();
  const q = params.get("q")?.toLowerCase() ?? "";
  const [price, setPrice] = useState<[number, number]>([0, 50000]);
  const [selBrands, setSelBrands] = useState<string[]>(preset?.brand ? [preset.brand] : []);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState("featured");

  const list = useMemo(() => {
    let l = products.slice();
    if (preset?.brand) l = l.filter((p) => p.brand === preset.brand);
    if (preset?.category) l = l.filter((p) => p.category === preset.category);
    if (q) l = l.filter((p) => (p.name + " " + p.brand + " " + p.tags.join(" ")).toLowerCase().includes(q));
    if (selBrands.length && !preset?.brand) l = l.filter((p) => selBrands.includes(p.brand));
    if (inStockOnly) l = l.filter((p) => p.inStock);
    l = l.filter((p) => p.price >= price[0] && p.price <= price[1]);
    switch (sort) {
      case "price-asc": l.sort((a, b) => a.price - b.price); break;
      case "price-desc": l.sort((a, b) => b.price - a.price); break;
      case "rating": l.sort((a, b) => b.rating - a.rating); break;
      case "newest": l.sort((a, b) => Number(b.isNewArrival) - Number(a.isNewArrival)); break;
      default: l.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
    }
    return l;
  }, [q, price, selBrands, inStockOnly, sort, preset]);

  const FilterPanel = (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-sm mb-3">Price (Rs.)</h3>
        <Slider value={price} onValueChange={(v) => setPrice(v as [number, number])} min={0} max={50000} step={500} />
        <div className="mt-2 flex justify-between text-xs text-muted-foreground"><span>Rs.{price[0]}</span><span>Rs.{price[1]}</span></div>
      </div>
      {!preset?.brand && (
        <div>
          <h3 className="font-semibold text-sm mb-3">Brand</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {brands.map((b) => (
              <label key={b.slug} className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox checked={selBrands.includes(b.slug)} onCheckedChange={(c) => setSelBrands((cur) => c ? [...cur, b.slug] : cur.filter((x) => x !== b.slug))} />
                {b.name}
              </label>
            ))}
          </div>
        </div>
      )}
      <div>
        <h3 className="font-semibold text-sm mb-3">Availability</h3>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <Checkbox checked={inStockOnly} onCheckedChange={(c) => setInStockOnly(!!c)} /> In stock only
        </label>
      </div>
    </div>
  );

  return (
    <>
      <SEO title={`${title} | TechZone`} description={description ?? `Browse ${title.toLowerCase()} at TechZone Pakistan.`} />
      <div className="container-x py-6">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: title }]} />
        <h1 className="font-display text-2xl md:text-3xl font-bold mt-4">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}

        <div className="mt-6 grid lg:grid-cols-[260px_1fr] gap-8">
          <aside className="hidden lg:block sticky top-32 self-start">{FilterPanel}</aside>
          <div>
            <div className="flex items-center justify-between gap-3 mb-4">
              <p className="text-sm text-muted-foreground">Showing {list.length} products</p>
              <div className="flex items-center gap-2">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden gap-2"><FilterIcon className="h-4 w-4" /> Filters</Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 bg-card border-border overflow-y-auto">
                    <SheetTitle>Filters</SheetTitle>
                    <div className="mt-6">{FilterPanel}</div>
                  </SheetContent>
                </Sheet>
                <Select value={sort} onValueChange={setSort}>
                  <SelectTrigger className="w-44 bg-card"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="rating">Best Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {list.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">No products match your filters.</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {list.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}