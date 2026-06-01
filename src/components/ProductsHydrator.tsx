import { useEffect, useState } from "react";
import { hydrateProductsFromDb, subscribeProducts } from "@/data/products";

/**
 * Loads the live product catalogue from the database once on mount and
 * forces a re-render of its children when the data arrives, so that
 * components which import the static `products` array see the latest
 * admin-managed values (images, prices, flags, etc.).
 */
export function ProductsHydrator({ children }: { children: React.ReactNode }) {
  const [, setV] = useState(0);
  useEffect(() => {
    const unsub = subscribeProducts(() => setV((v) => v + 1));
    hydrateProductsFromDb();
    return () => {
      unsub();
    };
  }, []);
  return <>{children}</>;
}