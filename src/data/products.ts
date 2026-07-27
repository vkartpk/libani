import type { Product } from "./types";

const img = (seed: string, w = 800, h = 800) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

type Seed = {
  name: string;
  brand: string;
  category: string;
  subcategory?: string;
  price: number;
  compareAtPrice?: number;
  tags?: string[];
  variants?: Product["variants"];
  features?: string[];
  description?: string;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isOnSale?: boolean;
  inStock?: boolean;
  rating?: number;
  reviewCount?: number;
};

const colorVariant = (label: string, value: string, inStock = true) =>
  ({ id: slugify(label), label, type: "color" as const, value, inStock });

const seeds: Seed[] = [
  // Routers
  { name: "TP-Link Archer C6 AC1200 Dual-Band Router", brand: "tp-link", category: "routers", price: 6500, compareAtPrice: 7800, isFeatured: true, isOnSale: true, rating: 4.6, reviewCount: 142, features: ["Dual-band Wi-Fi 5","4 Gigabit LAN","MU-MIMO","Beamforming"] },
  { name: "Tenda AC10 1200Mbps Smart Router", brand: "tenda", category: "routers", price: 5200, rating: 4.4, reviewCount: 88, isNewArrival: true },
  { name: "MT-Link 4G LTE Wireless Router", brand: "mt-link", category: "routers", price: 8900, rating: 4.2, reviewCount: 41 },
  { name: "TP-Link Deco M4 Mesh Wi-Fi (2-Pack)", brand: "tp-link", category: "routers", price: 18500, compareAtPrice: 22000, isOnSale: true, rating: 4.8, reviewCount: 67 },

  // TWS
  { name: "Joyroom JR-TS1 True Wireless Earbuds", brand: "joyroom", category: "tws", price: 3499, compareAtPrice: 4500, isOnSale: true, rating: 4.5, reviewCount: 230, variants: [colorVariant("Black","#111"), colorVariant("White","#f5f5f5")], isFeatured: true, features: ["ENC noise cancelling","30hr playback","Bluetooth 5.3","IPX4 water resistant"] },
  { name: "Lenovo LP40 Pro Wireless Earbuds", brand: "lenovo", category: "tws", price: 2299, isNewArrival: true, rating: 4.4, reviewCount: 412, variants: [colorVariant("Black","#111"), colorVariant("Pink","#f9a8b9")] },
  { name: "Baseus Bowie WX5 TWS Earbuds", brand: "baseus", category: "tws", price: 4200, rating: 4.6, reviewCount: 102 },
  { name: "LDNIO T05 Sport Earbuds", brand: "ldnio", category: "tws", price: 2899, rating: 4.2, reviewCount: 51 },

  // Headphones
  { name: "HyperX Cloud II Gaming Headphones", brand: "hyperx", category: "headphones", price: 18900, compareAtPrice: 21500, isOnSale: true, isFeatured: true, rating: 4.9, reviewCount: 891, features: ["7.1 Surround Sound","Memory foam","Detachable mic","Aluminium frame"] },
  { name: "Joyroom JR-HL2 Wireless Headphones", brand: "joyroom", category: "headphones", price: 5499, rating: 4.4, reviewCount: 78 },
  { name: "Lenovo TH10 Over-Ear Headphones", brand: "lenovo", category: "headphones", price: 3899, isNewArrival: true, rating: 4.3, reviewCount: 165 },

  // Earphones / Neckbands
  { name: "Lenovo HE05 Magnetic Neckband", brand: "lenovo", category: "earphones", price: 1599, compareAtPrice: 2200, isOnSale: true, rating: 4.5, reviewCount: 540 },
  { name: "Joyroom JR-D7 Wired Earphones", brand: "joyroom", category: "earphones", price: 899, rating: 4.2, reviewCount: 91 },

  // Mouse (peripherals)
  { name: "Logitech M170 Wireless Mouse", brand: "logitech", category: "mouse", price: 1899, rating: 4.6, reviewCount: 1241, isFeatured: true },
  { name: "A4Tech OP-720 Wired Mouse", brand: "a4tech", category: "mouse", price: 599, rating: 4.3, reviewCount: 220 },
  { name: "Amaze AM-M9 Silent Wireless Mouse", brand: "amaze", category: "mouse", price: 1399, isNewArrival: true, rating: 4.4, reviewCount: 56 },

  // Keyboard
  { name: "A4Tech KR-83 Comfort Keyboard", brand: "a4tech", category: "keyboard", price: 1499, rating: 4.4, reviewCount: 320 },
  { name: "Redragon K552 Mechanical Keyboard", brand: "redragon", category: "keyboard", price: 7900, compareAtPrice: 9200, isOnSale: true, rating: 4.7, reviewCount: 482, features: ["Cherry-style switches","RGB backlight","Anti-ghosting","Splash proof"] },

  // Speakers
  { name: "Havit SK202 USB Speakers", brand: "havit", category: "speakers", price: 1999, rating: 4.3, reviewCount: 78 },

  // Webcam / Mic / Storage / Printers
  { name: "Logitech C270 HD Webcam", brand: "logitech", category: "webcam", price: 6800, rating: 4.6, reviewCount: 920 },
  { name: "HyperX SoloCast USB Microphone", brand: "hyperx", category: "microphone", price: 11900, rating: 4.7, reviewCount: 312 },
  { name: "WD Elements 1TB Portable Drive", brand: "compro", category: "storage", price: 12500, rating: 4.6, reviewCount: 540 },
  { name: "HP DeskJet 2710 All-in-One Printer", brand: "compro", category: "printers", price: 24900, rating: 4.4, reviewCount: 88 },

  // Power Banks
  { name: "Joyroom JR-T012 20000mAh Power Bank", brand: "joyroom", category: "power-banks", price: 4999, compareAtPrice: 6000, isOnSale: true, isFeatured: true, rating: 4.6, reviewCount: 410, features: ["20000mAh capacity","22.5W PD fast charge","Dual USB + USB-C","LED indicator"] },
  { name: "Amaze 10000mAh Slim Power Bank", brand: "amaze", category: "power-banks", price: 2499, rating: 4.3, reviewCount: 187 },
  { name: "Lenovo PB500 Wireless Power Bank", brand: "lenovo", category: "power-banks", price: 5499, isNewArrival: true, rating: 4.5, reviewCount: 73 },

  // Smart watches / Cameras / TV / Tablets
  { name: "Xiaomi Redmi Watch 4", brand: "xiaomi", category: "smart-watches", price: 18900, rating: 4.7, reviewCount: 245, isFeatured: true },
  { name: "TP-Link Tapo C200 360° Security Camera", brand: "tp-link", category: "security-cameras", price: 5900, compareAtPrice: 7200, isOnSale: true, rating: 4.7, reviewCount: 612 },
  { name: "Xiaomi Mi TV Box S 4K", brand: "xiaomi", category: "android-tv-box", price: 11900, rating: 4.6, reviewCount: 188 },
  { name: "Wacom One CTL-472 Graphic Tablet", brand: "compro", category: "graphic-tablets", price: 14500, rating: 4.5, reviewCount: 64 },

  // Gaming
  { name: "Redragon M711 Cobra Gaming Mouse", brand: "redragon", category: "gaming-mouse", subcategory: "gaming", price: 3499, compareAtPrice: 4200, isOnSale: true, rating: 4.7, reviewCount: 880, features: ["10000 DPI sensor","RGB lighting","7 programmable buttons"] },
  { name: "Bloody V8M Gaming Mouse", brand: "bloody", category: "gaming-mouse", subcategory: "gaming", price: 4500, rating: 4.5, reviewCount: 142 },
  { name: "Redragon K530 Draconic 60% Mechanical", brand: "redragon", category: "gaming-keyboard", subcategory: "gaming", price: 9500, isFeatured: true, rating: 4.8, reviewCount: 320 },
  { name: "T-Dagger Bali TGK315 Gaming Keyboard", brand: "t-dagger", category: "gaming-keyboard", subcategory: "gaming", price: 6800, rating: 4.4, reviewCount: 91 },
  { name: "HyperX Cloud Stinger Core Gaming Headset", brand: "hyperx", category: "gaming-headphones", subcategory: "gaming", price: 7500, rating: 4.6, reviewCount: 412 },
  { name: "Redragon H510 Zeus Gaming Headphones", brand: "redragon", category: "gaming-headphones", subcategory: "gaming", price: 8900, isOnSale: true, compareAtPrice: 10500, rating: 4.7, reviewCount: 230 },
  { name: "Redragon G808 Pro Gamepad", brand: "redragon", category: "gamepads", subcategory: "gaming", price: 4200, rating: 4.4, reviewCount: 64 },
  { name: "Redragon P016 Suzaku Gaming Mousepad XXL", brand: "redragon", category: "gaming-mousepad", subcategory: "gaming", price: 1899, rating: 4.7, reviewCount: 312 },
  { name: "Redragon Coeus GC-101 Gaming Chair", brand: "redragon", category: "gaming-chair", subcategory: "gaming", price: 39900, rating: 4.5, reviewCount: 41 },

  // Cables & power & extras
  { name: "Joyroom S-1030N1 USB-C 100W Cable 1m", brand: "joyroom", category: "charging-cables", price: 1099, rating: 4.6, reviewCount: 180 },
  { name: "Baseus Tungsten Gold Lightning Cable 2m", brand: "baseus", category: "charging-cables", price: 1499, rating: 4.7, reviewCount: 244 },
  { name: "LDNIO SC5614 6-Outlet Power Strip", brand: "ldnio", category: "power-extensions", price: 3299, isFeatured: true, rating: 4.5, reviewCount: 128 },
  { name: "LDNIO A4808Q 4-Port USB Charger", brand: "ldnio", category: "power-extensions", price: 2899, rating: 4.6, reviewCount: 92 },
  { name: "Compro USB-C 7-in-1 Hub", brand: "compro", category: "usb-hubs", price: 4999, rating: 4.5, reviewCount: 76 },
  { name: "Amaze AL-Stand Aluminium Laptop Stand", brand: "amaze", category: "laptop-stands", price: 2999, isNewArrival: true, rating: 4.6, reviewCount: 54 },
  { name: "Amaze CC-PD Car Fast Charger", brand: "amaze", category: "car-chargers", price: 1799, rating: 4.4, reviewCount: 88 },
  { name: "Amaze Pro Laptop Backpack 15.6\"", brand: "amaze", category: "bags", price: 3899, rating: 4.5, reviewCount: 122 },
];

const baseDescription = (name: string) =>
  `${name} brings dependable everyday performance with thoughtful design and the build quality you'd expect from a top-tier brand. Engineered for daily use, backed by warranty, and shipped fast across Pakistan.`;

const baseSpecs = (s: Seed) => [
  { key: "Brand", value: s.brand.toUpperCase() },
  { key: "Category", value: s.category },
  { key: "Warranty", value: "Brand warranty included" },
  { key: "Country of Origin", value: "Imported" },
];

export const products: Product[] = seeds.map((s, i) => {
  const slug = slugify(s.name);
  const id = `p${(i + 1).toString().padStart(3, "0")}`;
  const compareAtPrice = s.compareAtPrice ?? null;
  return {
    id,
    slug,
    name: s.name,
    brand: s.brand,
    category: s.category,
    subcategory: s.subcategory ?? s.category,
    tags: s.tags ?? [s.brand, s.category],
    images: [
      img(`${id}-1`),
      img(`${id}-2`),
      img(`${id}-3`),
      img(`${id}-4`),
    ],
    price: s.price,
    compareAtPrice,
    inStock: s.inStock ?? true,
    stockCount: s.inStock === false ? 0 : 25,
    rating: s.rating ?? 4.5,
    reviewCount: s.reviewCount ?? 24,
    variants: s.variants ?? [],
    description: s.description ?? baseDescription(s.name),
    features: s.features ?? [
      "Premium build quality",
      "Backed by official warranty",
      "Free shipping above Rs.1000",
      "Cash on delivery available",
    ],
    specs: baseSpecs(s),
    isFeatured: !!s.isFeatured,
    isNewArrival: !!s.isNewArrival,
    isOnSale: !!s.isOnSale || compareAtPrice !== null,
    sku: `TZ-${id.toUpperCase()}`,
    weight: "0.5 kg",
    freeShipping: s.price >= 1000,
    metaTitle: `${s.name} | TechZone`,
    metaDescription: `Buy ${s.name} online in Pakistan at TechZone. Genuine product, free shipping above Rs.1000, cash on delivery available.`,
  };
});

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getProductsByBrand = (brand: string) => products.filter((p) => p.brand === brand);
export const getProductsByCategory = (cat: string) => products.filter((p) => p.category === cat);
export const featuredProducts = products.filter((p) => p.isFeatured);
export const onSaleProducts = products.filter((p) => p.isOnSale);
export const newArrivals = products.filter((p) => p.isNewArrival);

// ---- DB hydration ----
// Storefront uses this static array as the initial value; on app load we
// fetch the live products from the database and replace the contents of
// this array in place so that anything imported as `products` reflects the
// admin-managed catalogue (including uploaded images).

import { supabase } from "@/lib/supabase";

type DbRow = {
  id: string;
  slug: string;
  name: string;
  brand_slug: string;
  category_slug: string;
  subcategory_slug: string | null;
  tags: string[] | null;
  images: string[] | null;
  price: number | string;
  compare_at_price: number | string | null;
  in_stock: boolean;
  stock_count: number;
  rating: number | string;
  review_count: number;
  description: string | null;
  features: unknown;
  specs: unknown;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_on_sale: boolean;
  sku: string | null;
  weight: string | null;
  free_shipping: boolean;
  meta_title: string | null;
  meta_description: string | null;
  is_active: boolean;
};

const num = (v: unknown, fb = 0): number => {
  const n = typeof v === "string" ? parseFloat(v) : (v as number);
  return Number.isFinite(n) ? n : fb;
};

const arr = <T,>(v: unknown, fb: T[]): T[] => (Array.isArray(v) ? (v as T[]) : fb);

const mapRow = (r: DbRow): Product => {
  const fallback = products.find((p) => p.slug === r.slug);
  const images = arr<string>(r.images, []).filter(Boolean);
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    brand: r.brand_slug,
    category: r.category_slug,
    subcategory: r.subcategory_slug ?? r.category_slug,
    tags: arr<string>(r.tags, fallback?.tags ?? [r.brand_slug, r.category_slug]),
    images: images.length ? images : (fallback?.images ?? [img(`${r.slug}-1`)]),
    price: num(r.price),
    compareAtPrice: r.compare_at_price == null ? null : num(r.compare_at_price),
    inStock: !!r.in_stock,
    stockCount: r.stock_count ?? 0,
    rating: num(r.rating, 4.5),
    reviewCount: r.review_count ?? 0,
    variants: fallback?.variants ?? [],
    description: r.description ?? fallback?.description ?? baseDescription(r.name),
    features: arr<string>(r.features, fallback?.features ?? []),
    specs: arr<{ key: string; value: string }>(r.specs, fallback?.specs ?? []),
    isFeatured: !!r.is_featured,
    isNewArrival: !!r.is_new_arrival,
    isOnSale: !!r.is_on_sale,
    sku: r.sku ?? fallback?.sku ?? `TZ-${r.slug.toUpperCase()}`,
    weight: r.weight ?? fallback?.weight ?? "0.5 kg",
    freeShipping: !!r.free_shipping,
    metaTitle: r.meta_title ?? fallback?.metaTitle ?? `${r.name} | TechZone`,
    metaDescription:
      r.meta_description ??
      fallback?.metaDescription ??
      `Buy ${r.name} online in Pakistan at TechZone.`,
  };
};

const refreshDerived = () => {
  featuredProducts.length = 0;
  featuredProducts.push(...products.filter((p) => p.isFeatured));
  onSaleProducts.length = 0;
  onSaleProducts.push(...products.filter((p) => p.isOnSale));
  newArrivals.length = 0;
  newArrivals.push(...products.filter((p) => p.isNewArrival));
};

let hydratePromise: Promise<void> | null = null;
const listeners = new Set<() => void>();
export const subscribeProducts = (fn: () => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

export const hydrateProductsFromDb = async (): Promise<void> => {
  if (hydratePromise) return hydratePromise;
  hydratePromise = (async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1000);
    if (error || !data || !data.length) return;
    const mapped = (data as unknown as DbRow[]).map(mapRow);
    products.length = 0;
    products.push(...mapped);
    refreshDerived();
    listeners.forEach((fn) => fn());
  })();
  return hydratePromise;
};