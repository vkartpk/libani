import { Link, useParams } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { cn } from "@/lib/utils";

const policies = {
  refund: { title: "Refund & Return Policy", body: "We offer a 7-day return window from delivery date for unused items in original packaging. Contact support to initiate a return; once we receive the item, refunds are processed within 3-5 business days to your original payment method (or via JazzCash/EasyPaisa for COD orders)." },
  privacy: { title: "Privacy Policy", body: "We collect only the information necessary to fulfil your orders — name, address, contact details, and payment information. We never sell your data. Cookies are used to remember your cart and preferences. You may request deletion of your data at any time." },
  terms: { title: "Terms of Service", body: "By using TechZone, you agree to these terms. Prohibited activities include scraping, abuse, fraudulent orders, and reselling for resale outside Pakistan. We reserve the right to cancel suspicious orders. Our liability is limited to the purchase price of the item." },
  shipping: { title: "Shipping Policy", body: "We deliver across Pakistan within 2-3 working days. Free shipping on orders above Rs.1000; otherwise Rs.200 flat. Damaged or wrong items are replaced free of charge — just notify us within 48 hours of delivery." },
} as const;

const list = [
  ["refund","Refund Policy"],["privacy","Privacy Policy"],["terms","Terms of Service"],["shipping","Shipping Policy"],
] as const;

export default function Policy() {
  const { slug = "refund" } = useParams<{ slug: keyof typeof policies }>();
  const p = policies[slug as keyof typeof policies] ?? policies.refund;
  return (
    <>
      <SEO title={`${p.title} | TechZone`} description={p.body.slice(0, 150)} />
      <div className="container-x py-6">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Policies" }, { label: p.title }]} />
        <div className="mt-6 grid md:grid-cols-[220px_1fr] gap-8">
          <aside className="space-y-1">
            {list.map(([s, l]) => (
              <Link key={s} to={`/policies/${s}`} className={cn("block px-3 py-2 rounded text-sm", slug === s ? "bg-primary text-primary-foreground" : "hover:bg-card")}>{l}</Link>
            ))}
          </aside>
          <article>
            <h1 className="font-display text-2xl md:text-3xl font-bold">{p.title}</h1>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{p.body}</p>
          </article>
        </div>
      </div>
    </>
  );
}