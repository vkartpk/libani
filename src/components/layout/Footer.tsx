import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, Linkedin, Truck, Clock, Zap, Lock, Phone, Mail, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import libaniLogo from "@/assets/libani-logo.png";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useCmsPages } from "@/hooks/useCms";
import { formatPKR } from "@/lib/storage";

export function Footer() {
  const { settings } = useSiteSettings();
  const { pages } = useCmsPages();
  const cmsLinks = pages
    .filter((p) => p.is_published && p.show_in_footer)
    .map((p) => ({ to: p.link_url || `/policies/${p.slug}`, label: p.footer_label || p.title }));
  const staticLinks = [
    { to: "/products", label: "All Products" },
    { to: "/about", label: "About Us" },
    { to: "/faq", label: "FAQ" },
    { to: "/contact", label: "Contact Us" },
    { to: "/track-order", label: "Track Order" },
    { to: "/blog", label: "Blog" },
  ];
  const fallbackLinks = [
    { to: "/policies/refund", label: "Refund Policy" },
    { to: "/policies/privacy", label: "Privacy Policy" },
    { to: "/policies/terms", label: "Terms of Service" },
    { to: "/policies/shipping", label: "Shipping Policy" },
  ];
  const quickLinks = cmsLinks.length
    ? [
        // keep built-in links that the CMS does not manage yet
        ...staticLinks.filter((s) => !cmsLinks.some((c) => c.to === s.to)),
        ...cmsLinks,
      ]
    : [...staticLinks, ...fallbackLinks];
  const trust = [
    { icon: Truck, label: `Delivery charges ${formatPKR(Number(settings.shipping_fee || 0))}` },
    { icon: Clock, label: "24/7 Customer Support" },
    { icon: Zap, label: `Fast Delivery ${settings.delivery_days_min}-${settings.delivery_days_max} Days` },
    { icon: Lock, label: "Secure Checkout" },
  ];
  return (
    <footer className="bg-card border-t border-border mt-12">
      {/* Trust badges */}
      <div className="container-x py-8 grid grid-cols-2 md:grid-cols-4 gap-6 border-b border-border">
        {trust.map((t) => (
          <div key={t.label} className="flex items-center gap-3">
            <span className="grid place-items-center h-10 w-10 rounded bg-surface text-primary"><t.icon className="h-5 w-5" /></span>
            <span className="text-sm font-medium">{t.label}</span>
          </div>
        ))}
      </div>

      <div className="container-x py-12 grid md:grid-cols-3 gap-10">
        <div>
          <Link to="/" className="inline-block">
            <img
              src={libaniLogo}
              alt="libani"
              width={220}
              height={77}
              className="h-14 w-auto"
              loading="lazy"
            />
          </Link>
          <p className="mt-3 text-sm text-muted-foreground max-w-sm">Pakistan's premier destination for authentic computer peripherals, mobile accessories, gaming gear, and audio products.</p>
          <div className="mt-4 flex gap-2">
            {[Facebook, Instagram, Youtube, Linkedin].map((Icon, i) => (
              <a key={i} href="#" aria-label="Social" className="grid place-items-center h-9 w-9 rounded bg-surface hover:bg-primary hover:text-primary-foreground transition">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-display font-bold text-base mb-4">Quick Links</h3>
          <ul className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            {quickLinks.map((l) => (
              <li key={l.to}><Link to={l.to} className="hover:text-primary">{l.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display font-bold text-base mb-4">Get in Touch</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> +92 3124339986</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> libaniofficial@gmail.com</li>
            <li className="flex items-start gap-2"><MapPin className="h-4 w-4 text-primary mt-0.5" /> IT Tower, Gulberg, Lahore. Pakistan</li>
            <li>Mon–Sat 10:00 – 19:00</li>
          </ul>
          <form
            onSubmit={(e) => { e.preventDefault(); toast.success("Subscribed! Check your inbox."); (e.currentTarget as HTMLFormElement).reset(); }}
            className="mt-4 flex gap-2"
          >
            <Input type="email" required placeholder="Your email" className="bg-surface" />
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">Subscribe</Button>
          </form>
          <p className="mt-2 text-xs text-muted-foreground">No spam. Unsubscribe anytime.</p>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-x py-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} libani. All rights reserved.</p>
          <div className="flex items-center gap-2">
            {["VISA","Mastercard","JazzCash","EasyPaisa","COD"].map((m) => (
              <span key={m} className="px-2 py-1 rounded bg-surface text-[10px] font-bold tracking-wider">{m}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}