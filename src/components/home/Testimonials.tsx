import { Star, BadgeCheck } from "lucide-react";

const items = [
  { name: "Ali Raza", quote: "Genuine product, packaged securely, and arrived in 2 days. Will definitely shop again!", role: "Karachi" },
  { name: "Fatima Sheikh", quote: "Great prices and even better customer service. They helped me pick the right router.", role: "Lahore" },
  { name: "Ahmed Khan", quote: "Bought a Redragon mechanical keyboard — feels premium, works flawlessly. Recommended.", role: "Islamabad" },
];

export function Testimonials() {
  return (
    <section className="container-x mt-14">
      <h2 className="section-title">What Our Customers Say</h2>
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        {items.map((t) => (
          <div key={t.name} className="p-6 rounded-lg bg-card border border-border">
            <div className="flex items-center gap-1 text-primary mb-3">
              {Array.from({length:5}).map((_,i) => <Star key={i} className="h-4 w-4 fill-current" />)}
            </div>
            <p className="text-sm text-foreground/90">"{t.quote}"</p>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs text-success"><BadgeCheck className="h-3 w-3" /> Verified</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}