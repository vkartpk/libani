import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight } from "lucide-react";
import { products } from "@/data/products";
import { Link } from "react-router-dom";
import { formatPKR, safeStorage } from "@/lib/storage";

const RECENT_KEY = "tz.recent-searches";

export function SearchOverlay({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [q, setQ] = useState("");
  const [recent, setRecent] = useState<string[]>(() => safeStorage.get(RECENT_KEY, []));
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebounced(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  const results = useMemo(() => {
    if (!debounced.trim()) return [];
    const term = debounced.toLowerCase();
    return products
      .filter((p) =>
        [p.name, p.brand, p.category, ...(p.tags ?? [])].join(" ").toLowerCase().includes(term),
      )
      .slice(0, 8);
  }, [debounced]);

  const saveRecent = (term: string) => {
    const next = [term, ...recent.filter((r) => r !== term)].slice(0, 5);
    setRecent(next);
    safeStorage.set(RECENT_KEY, next);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card border-border p-0 gap-0">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products, brands, categories…"
            className="border-0 focus-visible:ring-0 bg-transparent"
          />
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {!debounced && recent.length > 0 && (
            <div className="p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Recent searches</p>
              <div className="flex flex-wrap gap-2">
                {recent.map((r) => (
                  <button key={r} onClick={() => setQ(r)} className="px-3 py-1 text-xs rounded-full bg-surface hover:bg-primary hover:text-primary-foreground transition">
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          {debounced && results.length === 0 && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No results for "{debounced}". Try another term.
            </div>
          )}

          {results.map((p) => (
            <Link
              key={p.id}
              to={`/products/${p.slug}`}
              onClick={() => { saveRecent(debounced); onOpenChange(false); }}
              className="flex items-center gap-3 p-3 hover:bg-surface border-b border-border last:border-0"
            >
              <img src={p.images[0]} alt="" className="h-12 w-12 rounded object-cover bg-surface" loading="lazy" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.brand} · {p.category}</p>
              </div>
              <span className="price text-sm font-bold">{formatPKR(p.price)}</span>
            </Link>
          ))}

          {debounced && results.length > 0 && (
            <Link
              to={`/search?q=${encodeURIComponent(debounced)}`}
              onClick={() => { saveRecent(debounced); onOpenChange(false); }}
              className="flex items-center justify-center gap-2 p-3 text-sm text-primary hover:bg-surface"
            >
              View all results <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}