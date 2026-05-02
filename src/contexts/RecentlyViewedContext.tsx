import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { safeStorage } from "@/lib/storage";

type Ctx = { ids: string[]; track: (id: string) => void };
const C = createContext<Ctx | null>(null);
const KEY = "tz.recent";

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>(() => safeStorage.get(KEY, []));
  useEffect(() => safeStorage.set(KEY, ids), [ids]);
  const track = (id: string) =>
    setIds((cur) => [id, ...cur.filter((x) => x !== id)].slice(0, 10));
  return <C.Provider value={{ ids, track }}>{children}</C.Provider>;
}

export const useRecentlyViewed = () => {
  const ctx = useContext(C);
  if (!ctx) throw new Error("useRecentlyViewed must be used inside RecentlyViewedProvider");
  return ctx;
};