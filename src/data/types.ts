export type Variant = {
  id: string;
  label: string;
  type: "color" | "size";
  value: string; // hex for color, label for size
  inStock: boolean;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string; // brand slug
  category: string; // category slug
  subcategory: string;
  tags: string[];
  images: string[];
  price: number;
  compareAtPrice: number | null;
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviewCount: number;
  variants: Variant[];
  description: string;
  features: string[];
  specs: { key: string; value: string }[];
  isFeatured: boolean;
  isNewArrival: boolean;
  isOnSale: boolean;
  sku: string;
  weight: string;
  freeShipping: boolean;
  metaTitle: string;
  metaDescription: string;
};

export type Brand = {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
  bannerImage: string;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: "Reviews" | "Guides" | "News" | "Tips";
  author: string;
  date: string;
  coverImage: string;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
};