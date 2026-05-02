import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { safeStorage } from "@/lib/storage";
import { products } from "@/data/products";
import type { Product } from "@/data/types";

export type CartItem = {
  productId: string;
  variantId?: string;
  qty: number;
};

type CartCtx = {
  items: CartItem[];
  add: (productId: string, qty?: number, variantId?: string) => void;
  remove: (productId: string, variantId?: string) => void;
  setQty: (productId: string, qty: number, variantId?: string) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  applyCoupon: (code: string) => boolean;
  coupon: string | null;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  enriched: { item: CartItem; product: Product }[];
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "tz.cart";
const COUPON_KEY = "tz.coupon";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => safeStorage.get(KEY, []));
  const [coupon, setCoupon] = useState<string | null>(() => safeStorage.get(COUPON_KEY, null));
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => safeStorage.set(KEY, items), [items]);
  useEffect(() => safeStorage.set(COUPON_KEY, coupon), [coupon]);

  const add: CartCtx["add"] = (productId, qty = 1, variantId) =>
    setItems((cur) => {
      const idx = cur.findIndex((i) => i.productId === productId && i.variantId === variantId);
      if (idx >= 0) {
        const next = [...cur];
        next[idx] = { ...next[idx], qty: next[idx].qty + qty };
        return next;
      }
      return [...cur, { productId, variantId, qty }];
    });

  const remove: CartCtx["remove"] = (productId, variantId) =>
    setItems((cur) => cur.filter((i) => !(i.productId === productId && i.variantId === variantId)));

  const setQty: CartCtx["setQty"] = (productId, qty, variantId) =>
    setItems((cur) =>
      cur
        .map((i) =>
          i.productId === productId && i.variantId === variantId ? { ...i, qty: Math.max(1, qty) } : i,
        )
        .filter((i) => i.qty > 0),
    );

  const clear = () => setItems([]);

  const enriched = useMemo(
    () =>
      items
        .map((item) => {
          const product = products.find((p) => p.id === item.productId);
          return product ? { item, product } : null;
        })
        .filter(Boolean) as { item: CartItem; product: Product }[],
    [items],
  );

  const subtotal = enriched.reduce((acc, { item, product }) => acc + product.price * item.qty, 0);
  const shipping = subtotal === 0 ? 0 : subtotal >= 1000 ? 0 : 200;
  const discount = coupon === "SAVE10" ? Math.round(subtotal * 0.1) : 0;
  const total = Math.max(0, subtotal + shipping - discount);
  const count = items.reduce((a, i) => a + i.qty, 0);

  const applyCoupon = (code: string) => {
    const ok = code.trim().toUpperCase() === "SAVE10";
    setCoupon(ok ? "SAVE10" : null);
    return ok;
  };

  return (
    <Ctx.Provider
      value={{ items, add, remove, setQty, clear, count, subtotal, shipping, discount, total, applyCoupon, coupon, drawerOpen, setDrawerOpen, enriched }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};