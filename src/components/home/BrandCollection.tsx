import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/products";
import { getBrand } from "@/data/brands";

export function BrandCollection({ slug }: { slug: string }) {
  const brand = getBrand(slug);
  if (!brand) return null;
  const items = products.filter((p) => p.brand === slug).slice(0, 10);
  if (items.length === 0) return null;
  return (
    <section className="container-x mt-14">
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-bold">Featured Brand</p>
          <h2 className="font-display text-2xl md:text-3xl font-bold mt-1">{brand.name} Collection</h2>
        </div>
        <Link to={`/brand/${brand.slug}`} className="text-sm text-primary hover:underline inline-flex items-center gap-1">
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="overflow-x-auto -mx-4 px-4 lg:overflow-visible lg:mx-0 lg:px-0">
        <div className="flex lg:grid lg:grid-cols-5 gap-4 w-max lg:w-auto">
          {items.map((p) => (
            <div key={p.id} className="w-52 lg:w-auto shrink-0"><ProductCard product={p} /></div>
          ))}
        </div>
      </div>
    </section>
  );
}