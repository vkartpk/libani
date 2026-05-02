import { Home, Grid3x3, Search, ShoppingCart, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { SearchOverlay } from "@/components/SearchOverlay";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const { pathname } = useLocation();
  const { count, setDrawerOpen } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);

  const items = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/products", icon: Grid3x3, label: "Shop" },
    { onClick: () => setSearchOpen(true), icon: Search, label: "Search" },
    { onClick: () => setDrawerOpen(true), icon: ShoppingCart, label: "Cart", badge: count },
    { to: "/auth", icon: User, label: "Account" },
  ] as const;

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-card/95 backdrop-blur border-t border-border">
        <ul className="grid grid-cols-5">
          {items.map((it, i) => {
            const active = "to" in it && pathname === it.to;
            const cls = cn("flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] relative", active ? "text-primary" : "text-muted-foreground");
            const inner = (
              <>
                <it.icon className="h-5 w-5" />
                <span>{it.label}</span>
                {"badge" in it && it.badge ? (
                  <span className="absolute top-1 right-[20%] h-4 min-w-4 px-1 grid place-items-center text-[9px] font-bold rounded-full bg-primary text-primary-foreground">{it.badge}</span>
                ) : null}
              </>
            );
            return (
              <li key={i}>
                {"to" in it ? <Link to={it.to} className={cls}>{inner}</Link> : <button onClick={it.onClick} className={cls + " w-full"}>{inner}</button>}
              </li>
            );
          })}
        </ul>
      </nav>
      <SearchOverlay open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}