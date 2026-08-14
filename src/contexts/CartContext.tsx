import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { safeStorage } from "@/lib/storage";
import { products, subscribeProducts, hydrateProductsFromDb } from "@/data/products";
import type { Product } from "@/data/types";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { supabase } from "@/lib/supabase";

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
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [freeShipFromCoupon, setFreeShipFromCoupon] = useState(false);
  const { settings } = useSiteSettings();

  useEffect(() => safeStorage.set(KEY, items), [items]);
  useEffect(() => safeStorage.set(COUPON_KEY, coupon), [coupon]);

  // `products` is a mutable module-level array: it starts as static seed data
  // and gets swapped for the live Supabase catalogue asynchronously (see
  // hydrateProductsFromDb / ProductsHydrator). CartProvider sits ABOVE
  // ProductsHydrator in the tree, so its own re-renders don't get triggered
  // when that hydration finishes — meaning `enriched` below could stay
  // memoized against the stale/empty seed data forever (cart badge shows a
  // count, but the drawer renders "empty" until some unrelated `items`
  // change forces a recompute). Subscribing here directly guarantees the
  // cart re-resolves products as soon as the live catalogue is in.
  const [productsTick, setProductsTick] = useState(0);
  useEffect(() => {
    const unsub = subscribeProducts(() => setProductsTick((v) => v + 1));
    hydrateProductsFromDb();
    return unsub;
  }, []);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, productsTick],
  );

  const subtotal = enriched.reduce((acc, { item, product }) => acc + product.price * item.qty, 0);
  const baseShipping = subtotal === 0
    ? 0
    : (settings.free_shipping_threshold > 0 && subtotal >= settings.free_shipping_threshold)
      ? 0
      : Number(settings.shipping_fee || 0);
  const shipping = freeShipFromCoupon ? 0 : baseShipping;
  const discount = Math.min(appliedDiscount, subtotal);
  const total = Math.max(0, subtotal + shipping - discount);
  const count = items.reduce((a, i) => a + i.qty, 0);

  // Re-evaluate coupon whenever subtotal or coupon changes
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!coupon) { setAppliedDiscount(0); setFreeShipFromCoupon(false); return; }
      const { data } = await supabase.from("coupons").select("*").eq("code", coupon).eq("active", true).maybeSingle();
      if (cancelled) return;
      if (!data) { setAppliedDiscount(0); setFreeShipFromCoupon(false); return; }
      const now = new Date();
      if (data.starts_at && new Date(data.starts_at) > now) { setAppliedDiscount(0); setFreeShipFromCoupon(false); return; }
      if (data.ends_at && new Date(data.ends_at) < now) { setAppliedDiscount(0); setFreeShipFromCoupon(false); return; }
      if (Number(data.min_subtotal || 0) > subtotal) { setAppliedDiscount(0); setFreeShipFromCoupon(false); return; }
      if (data.type === "free_shipping") { setFreeShipFromCoupon(true); setAppliedDiscount(0); return; }
      let d = data.type === "percent" ? Math.round(subtotal * (Number(data.value) / 100)) : Number(data.value);
      if (data.max_discount) d = Math.min(d, Number(data.max_discount));
      setAppliedDiscount(d);
      setFreeShipFromCoupon(false);
    };
    run();
    return () => { cancelled = true; };
  }, [coupon, subtotal]);

  const applyCoupon = (code: string) => {
    const c = code.trim().toUpperCase();
    setCoupon(c || null);
    return !!c;
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