import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { safeStorage } from "@/lib/storage";

type WishCtx = {
  ids: string[];
  has: (id: string) => boolean;
  toggle: (id: string) => boolean; // returns new state (true = added)
  remove: (id: string) => void;
  clear: () => void;
  count: number;
};

const Ctx = createContext<WishCtx | null>(null);
const KEY = "tz.wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>(() => safeStorage.get(KEY, []));
  useEffect(() => safeStorage.set(KEY, ids), [ids]);

  const has = (id: string) => ids.includes(id);
  const toggle = (id: string) => {
    let added = false;
    setIds((cur) => {
      if (cur.includes(id)) return cur.filter((x) => x !== id);
      added = true;
      return [...cur, id];
    });
    return added;
  };
  const remove = (id: string) => setIds((cur) => cur.filter((x) => x !== id));
  const clear = () => setIds([]);

  return <Ctx.Provider value={{ ids, has, toggle, remove, clear, count: ids.length }}>{children}</Ctx.Provider>;
}

export const useWishlist = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
};