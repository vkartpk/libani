import { Truck, Check, RefreshCw, MessageCircle } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { formatPKR } from "@/lib/storage";

export function TrustBadges() {
  const { settings } = useSiteSettings();
  const items = [
    { icon: Truck, title: "Nationwide Delivery", desc: `Flat ${formatPKR(Number(settings.shipping_fee || 0))} delivery charges` },
    { icon: Check, title: "Genuine Products", desc: "100% authentic" },
    { icon: RefreshCw, title: "Easy Returns", desc: "7-day return window" },
    { icon: MessageCircle, title: "24/7 Support", desc: "We're always here" },
  ];
  return (
    <section className="container-x mt-10">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {items.map((it) => (
          <div key={it.title} className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border">
            <span className="grid place-items-center h-10 w-10 shrink-0 rounded bg-primary/10 text-primary"><it.icon className="h-5 w-5" /></span>
            <div>
              <p className="font-semibold text-sm">{it.title}</p>
              <p className="text-xs text-muted-foreground">{it.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}