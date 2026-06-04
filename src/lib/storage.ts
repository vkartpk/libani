// Safe localStorage wrapper — handles private browsing / quota errors.
export const safeStorage = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  set<T>(key: string, value: T) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore
    }
  },
  remove(key: string) {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  },
};

// Module-level currency cache. Updated by useSiteSettings on data load so
// changing currency in admin reflects across the storefront.
let currentCurrency = { symbol: "Rs.", locale: "en-PK", decimals: 0 };
export const setCurrencyConfig = (c: { symbol: string; locale: string; decimals: number }) => {
  currentCurrency = c;
};
export const formatMoney = (n: number) =>
  `${currentCurrency.symbol}${n.toLocaleString(currentCurrency.locale, { maximumFractionDigits: currentCurrency.decimals, minimumFractionDigits: currentCurrency.decimals })}`;
// Back-compat alias used throughout the codebase.
export const formatPKR = formatMoney;