import { Link } from "react-router-dom";
import { brands } from "@/data/brands";

const featured = ["lenovo","tp-link","joyroom","baseus","amaze","logitech","redragon","hyperx","a4tech","anker","ldnio","wiwu"];

export function BrandStrip() {
  const items = featured.map((s) => brands.find((b) => b.slug === s)!).filter(Boolean);
  const doubled = [...items, ...items];
  return (
    <section className="container-x mt-12">
      <h2 className="section-title">Top Brands</h2>
      <div className="mt-6 overflow-hidden">
        <div className="marquee flex gap-3 w-max">
          {doubled.map((b, i) => (
            <Link key={`${b.slug}-${i}`} to={`/brand/${b.slug}`} className="px-6 py-3 rounded bg-card border border-border hover:border-primary text-sm font-semibold whitespace-nowrap transition">
              {b.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}