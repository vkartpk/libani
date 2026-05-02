import { useEffect, useState } from "react";
import { onSaleProducts } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { Flame } from "lucide-react";

function useCountdown() {
  const [remaining, setRemaining] = useState(() => {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return end.getTime() - Date.now();
  });
  useEffect(() => {
    const t = setInterval(() => setRemaining((r) => Math.max(0, r - 1000)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = Math.floor(remaining / 3600000);
  const m = Math.floor((remaining % 3600000) / 60000);
  const s = Math.floor((remaining % 60000) / 1000);
  return { h, m, s };
}

const Cell = ({ n, label }: { n: number; label: string }) => (
  <div className="flex flex-col items-center">
    <div className="price h-12 w-14 grid place-items-center rounded bg-primary text-primary-foreground text-xl font-bold">{n.toString().padStart(2,"0")}</div>
    <span className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
  </div>
);

export function FlashSale() {
  const { h, m, s } = useCountdown();
  const items = onSaleProducts.slice(0, 8);
  return (
    <section className="container-x mt-14">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="section-title flex items-center gap-2"><Flame className="h-6 w-6 text-primary" /> Today's Deals</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-muted-foreground mr-2">Ends in</span>
          <Cell n={h} label="Hr" /><span className="text-primary text-xl font-bold">:</span>
          <Cell n={m} label="Min" /><span className="text-primary text-xl font-bold">:</span>
          <Cell n={s} label="Sec" />
        </div>
      </div>
      <div className="overflow-x-auto -mx-4 px-4 lg:overflow-visible lg:mx-0 lg:px-0">
        <div className="flex lg:grid lg:grid-cols-4 gap-4 w-max lg:w-auto">
          {items.map((p) => (
            <div key={p.id} className="w-56 lg:w-auto shrink-0"><ProductCard product={p} /></div>
          ))}
        </div>
      </div>
    </section>
  );
}