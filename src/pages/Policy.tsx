import { Link, useParams } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { cn } from "@/lib/utils";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useCmsPage } from "@/hooks/useCms";
import { formatPKR } from "@/lib/storage";
import { Skeleton } from "@/components/ui/skeleton";

const fallback: Record<string, { title: string; body: string }> = {
  refund: { title: "Refund & Return Policy", body: "We offer a 7-day return window from delivery date for unused items in original packaging." },
  privacy: { title: "Privacy Policy", body: "We collect only the information necessary to fulfil your orders. We never sell your data." },
  terms: { title: "Terms of Service", body: "By using libani, you agree to these terms. We reserve the right to cancel suspicious orders." },
  shipping: { title: "Shipping Policy", body: "We deliver across Pakistan. Delivery charges apply on every order — we charge only when we deliver." },
};

export default function Policy() {
  const { slug = "refund" } = useParams<{ slug: string }>();
  const { page, pages, isLoading } = useCmsPage(slug);
  const { settings } = useSiteSettings();

  const published = pages.filter((p) => p.is_published && (p.kind || "policy") === "policy");
  const nav = published.length
    ? published.map((p) => [p.slug, p.footer_label || p.title] as const)
    : Object.entries(fallback).map(([s, p]) => [s, p.title] as const);

  const fb = fallback[slug] || fallback.refund;
  const title = page?.title || fb.title;
  const raw = page?.content || fb.body;
  const body = raw
    .replace(/%shipping_fee%/g, formatPKR(Number(settings.shipping_fee || 0)))
    .replace(/%delivery_days%/g, `${settings.delivery_days_min}-${settings.delivery_days_max}`)
    .replace(/%site_name%/g, settings.site_name);

  return (
    <>
      <SEO
        title={page?.meta_title || `${title} | ${settings.site_name}`}
        description={page?.meta_description || body.slice(0, 150)}
      />
      <div className="container-x py-6">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Pages" }, { label: title }]} />
        <div className="mt-6 grid md:grid-cols-[220px_1fr] gap-8">
          <aside className="space-y-1">
            {nav.map(([s, l]) => (
              <Link key={s} to={`/policies/${s}`} className={cn("block px-3 py-2 rounded text-sm", slug === s ? "bg-primary text-primary-foreground" : "hover:bg-card")}>{l}</Link>
            ))}
          </aside>
          <article>
            <h1 className="font-display text-2xl md:text-3xl font-bold">{title}</h1>
            {isLoading && !page ? (
              <div className="mt-4 space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-5/6" /><Skeleton className="h-4 w-3/4" /></div>
            ) : (
              <div className="mt-4 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{body}</div>
            )}
          </article>
        </div>
      </div>
    </>
  );
}
