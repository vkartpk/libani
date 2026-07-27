import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { AccountLayout } from "./AccountLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { supabase } from "@/lib/supabase";
import { formatPKR } from "@/lib/storage";

export default function Overview() {
  const { user } = useAuth();
  const { count: wishCount } = useWishlist();
  const [recent, setRecent] = useState<any | null>(null);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    supabase.from("orders").select("*", { count: "exact" }).order("created_at", { ascending: false }).limit(1)
      .then(({ data, count }) => { setRecent(data?.[0] ?? null); setOrderCount(count ?? 0); });
  }, [user]);

  return (
    <AccountLayout>
      <div className="grid sm:grid-cols-3 gap-4">
        <Stat label="Orders" value={orderCount.toString()} to="/account/orders" />
        <Stat label="Wishlist" value={wishCount.toString()} to="/wishlist" />
        <Stat label="Email" value={user?.email ?? "—"} />
      </div>
      <div className="mt-6 bg-card border border-border rounded-lg p-6">
        <h2 className="font-display font-bold mb-4">Recent order</h2>
        {recent ? (
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <div><p className="font-mono">{recent.order_number}</p><p className="text-xs text-muted-foreground">{new Date(recent.created_at).toLocaleString()}</p></div>
            <span className="px-2 py-1 rounded bg-surface text-xs uppercase tracking-wider">{recent.status}</span>
            <span className="price font-bold">{formatPKR(Number(recent.total))}</span>
            <Link to="/account/orders" className="text-primary text-xs">View all →</Link>
          </div>
        ) : <p className="text-sm text-muted-foreground">No orders yet. <Link to="/products" className="text-primary">Start shopping</Link></p>}
      </div>
    </AccountLayout>
  );
}

function Stat({ label, value, to }: { label: string; value: string; to?: string }) {
  const inner = (
    <div className="bg-card border border-border rounded-lg p-4">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="font-display text-xl font-bold mt-1 truncate">{value}</p>
    </div>
  );
  return to ? <Link to={to} className="block hover:border-primary">{inner}</Link> : inner;
}