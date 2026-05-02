import { Link } from "react-router-dom";
import { categories, gamingCategories } from "@/data/categories";

const showcase = [
  ...categories.filter((c) => ["routers","tws","headphones","smart-watches","power-banks","mouse","keyboard","security-cameras","android-tv-box"].includes(c.slug)),
  gamingCategories.find((c) => c.slug === "gaming-mouse")!,
];

export function CategoryShowcase() {
  return (
    <section className="container-x mt-14">
      <h2 className="section-title">Shop by Category</h2>
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {showcase.map((c) => (
          <Link
            key={c.slug}
            to={`/category/${c.slug}`}
            className="group flex flex-col items-center gap-2 p-5 rounded-lg bg-card border border-border hover:border-primary hover:bg-primary/5 transition"
          >
            <span className="grid place-items-center h-12 w-12 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition">
              <c.icon className="h-6 w-6" />
            </span>
            <span className="text-xs font-medium text-center">{c.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}