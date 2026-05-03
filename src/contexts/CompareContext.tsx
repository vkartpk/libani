import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { safeStorage } from "@/lib/storage";
import { toast } from "sonner";

const KEY = "tz.compare";
const MAX = 4;

type Ctx = {
  ids: string[];
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  count: number;
};

const C = createContext<Ctx | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>(() => safeStorage.get(KEY, []));
  useEffect(() => safeStorage.set(KEY, ids), [ids]);

  const toggle = (id: string) =>
    setIds((cur) => {
      if (cur.includes(id)) return cur.filter((x) => x !== id);
      if (cur.length >= MAX) {
        toast.error(`You can compare up to ${MAX} products`);
        return cur;
      }
      return [...cur, id];
    });

  return (
    <C.Provider value={{ ids, has: (id) => ids.includes(id), toggle, remove: (id) => setIds((c) => c.filter((x) => x !== id)), clear: () => setIds([]), count: ids.length }}>
      {children}
    </C.Provider>
  );
}

export const useCompare = () => {
  const c = useContext(C);
  if (!c) throw new Error("useCompare must be used inside CompareProvider");
  return c;
};