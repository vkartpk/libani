import { Link } from "react-router-dom";
import { X, BarChart2 } from "lucide-react";
import { useCompare } from "@/contexts/CompareContext";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";

export function CompareBar() {
  const { ids, remove, clear, count } = useCompare();
  if (count === 0) return null;
  const items = ids.map((id) => products.find((p) => p.id === id)).filter(Boolean) as typeof products;

  return (
    <div className="fixed bottom-20 lg:bottom-4 right-4 z-40 bg-card border border-border rounded-lg shadow-2xl p-3 flex items-center gap-3 max-w-[calc(100vw-2rem)]">
      <BarChart2 className="h-5 w-5 text-primary shrink-0" />
      <div className="flex gap-2 overflow-x-auto">
        {items.map((p) => (
          <div key={p.id} className="relative shrink-0">
            <img src={p.images[0]} alt={p.name} className="h-12 w-12 object-cover rounded border border-border" />
            <button onClick={() => remove(p.id)} className="absolute -top-1 -right-1 h-4 w-4 grid place-items-center bg-primary text-primary-foreground rounded-full">
              <X className="h-2.5 w-2.5" />
            </button>
          </div>
        ))}
      </div>
      <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0"><Link to="/compare">Compare ({count})</Link></Button>
      <Button size="sm" variant="ghost" onClick={clear} className="shrink-0">Clear</Button>
    </div>
  );
}