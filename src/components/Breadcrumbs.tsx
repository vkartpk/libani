import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Helmet } from "react-helmet-async";

type Crumb = { label: string; to?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: c.to ? `${typeof window !== "undefined" ? window.location.origin : ""}${c.to}` : undefined,
    })),
  };
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
      <Helmet><script type="application/ld+json">{JSON.stringify(ld)}</script></Helmet>
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="h-3 w-3" />}
            {c.to ? (
              <Link to={c.to} className="hover:text-foreground transition-colors">
                {c.label}
              </Link>
            ) : (
              <span className="text-foreground">{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}