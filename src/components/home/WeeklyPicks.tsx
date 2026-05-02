import { useMemo, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

const tabs = [
  { key: "all", label: "All", filter: () => true },
  { key: "audio", label: "Audio", filter: (p: typeof products[number]) => ["tws","headphones","earphones","speakers"].includes(p.category) },
  { key: "accessories", label: "Accessories", filter: (p: typeof products[number]) => ["mouse","keyboard","laptop-stands","usb-hubs","bags","webcam","microphone"].includes(p.category) },
  { key: "gaming", label: "Gaming", filter: (p: typeof products[number]) => p.subcategory === "gaming" },
  { key: "power", label: "Power", filter: (p: typeof products[number]) => ["power-banks","power-extensions","charging-cables","car-chargers"].includes(p.category) },
] as const;

export function WeeklyPicks() {
  const [tab, setTab] = useState<typeof tabs[number]["key"]>("all");
  const items = useMemo(() => {
    const f = tabs.find((t) => t.key === tab)!.filter as (p: typeof products[number]) => boolean;
    return products.filter(f).slice(0, 12);
  }, [tab]);
  return (
    <section className="container-x mt-14">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <h2 className="section-title">Weekly Picks</h2>
        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
          <TabsList className="bg-card">
            {tabs.map((t) => (
              <TabsTrigger key={t.key} value={t.key}>{t.label}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}