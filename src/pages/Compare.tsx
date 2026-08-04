import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { useCompare } from "@/contexts/CompareContext";
import { useCart } from "@/contexts/CartContext";
import { products } from "@/data/products";
import { formatPKR } from "@/lib/storage";

export default function Compare() {
  const { ids, remove, clear } = useCompare();
  const { add, setDrawerOpen } = useCart();
  const items = ids.map((id) => products.find((p) => p.id === id)).filter(Boolean) as typeof products;

  if (items.length === 0) {
    return (
      <div className="container-x py-12 text-center">
        <SEO title="Compare | libani" />
        <h1 className="font-display text-2xl font-bold mb-4">Nothing to compare yet</h1>
        <p className="text-muted-foreground mb-6">Pick up to 4 products from any product card to compare them side-by-side.</p>
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground"><Link to="/products">Browse products</Link></Button>
      </div>
    );
  }

  // Collect a unified set of spec keys
  const specKeys = Array.from(new Set(items.flatMap((p) => p.specs.map((s) => s.key))));

  return (
    <>
      <SEO title="Compare products | libani" />
      <div className="container-x py-6">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Compare" }]} />
        <div className="flex items-center justify-between mt-4 mb-6">
          <h1 className="font-display text-2xl md:text-3xl font-bold">Compare ({items.length})</h1>
          <Button variant="outline" onClick={clear}>Clear all</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="sticky left-0 bg-background z-10 text-left text-xs uppercase tracking-wider text-muted-foreground p-3 w-40"></th>
                {items.map((p) => (
                  <th key={p.id} className="p-3 align-top text-left bg-card border border-border rounded-lg min-w-[200px]">
                    <div className="flex justify-end mb-2">
                      <button onClick={() => remove(p.id)} aria-label="Remove" className="h-6 w-6 grid place-items-center rounded hover:bg-surface"><X className="h-4 w-4" /></button>
                    </div>
                    <Link to={`/products/${p.slug}`}><img src={p.images[0]} alt={p.name} className="aspect-square w-full object-cover rounded" /></Link>
                    <Link to={`/products/${p.slug}`} className="block mt-2 font-medium text-sm hover:text-primary line-clamp-2">{p.name}</Link>
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground mt-1">{p.brand}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm">
              <Row label="Price" cols={items.map((p) => <span className="price font-bold">{formatPKR(p.price)}</span>)} />
              <Row label="Rating" cols={items.map((p) => <span><span className="text-primary">★</span> {p.rating.toFixed(1)} ({p.reviewCount})</span>)} />
              <Row label="Availability" cols={items.map((p) => <span className={p.inStock ? "text-success" : "text-destructive"}>{p.inStock ? "In stock" : "Out of stock"}</span>)} />
              <Row label="Category" cols={items.map((p) => p.category)} />
              {specKeys.map((k) => (
                <Row key={k} label={k} cols={items.map((p) => p.specs.find((s) => s.key === k)?.value ?? "—")} />
              ))}
              <Row label="" cols={items.map((p) => (
                <Button size="sm" disabled={!p.inStock} onClick={() => { add(p.id, 1); setDrawerOpen(true); }} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Add to cart</Button>
              ))} />
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function Row({ label, cols }: { label: string; cols: React.ReactNode[] }) {
  return (
    <tr>
      <td className="sticky left-0 bg-background z-10 p-3 text-xs uppercase tracking-wider text-muted-foreground border-b border-border align-top">{label}</td>
      {cols.map((c, i) => (
        <td key={i} className="p-3 border-b border-border align-top bg-card">{c}</td>
      ))}
    </tr>
  );
}