import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, Linkedin, Truck, Clock, Zap, Lock, Phone, Mail, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import libaniLogo from "@/assets/libani-logo.png";

const trust = [
  { icon: Truck, label: "Free Shipping above Rs.1000" },
  { icon: Clock, label: "24/7 Customer Support" },
  { icon: Zap, label: "Fast Delivery 2-3 Days" },
  { icon: Lock, label: "Secure Checkout" },
];

export function Footer() {
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
              width={180}
              height={63}
              className="h-12 w-auto"
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
            <li><Link to="/products" className="hover:text-primary">All Products</Link></li>
            <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
            <li><Link to="/faq" className="hover:text-primary">FAQ</Link></li>
            <li><Link to="/policies/refund" className="hover:text-primary">Refund Policy</Link></li>
            <li><Link to="/policies/privacy" className="hover:text-primary">Privacy Policy</Link></li>
            <li><Link to="/policies/terms" className="hover:text-primary">Terms of Service</Link></li>
            <li><Link to="/policies/shipping" className="hover:text-primary">Shipping Policy</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact Us</Link></li>
            <li><Link to="/track-order" className="hover:text-primary">Track Order</Link></li>
            <li><Link to="/blog" className="hover:text-primary">Blog</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display font-bold text-base mb-4">Get in Touch</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> +92 300 0000000</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> hello@techzone.pk</li>
            <li className="flex items-start gap-2"><MapPin className="h-4 w-4 text-primary mt-0.5" /> Plot 42, Tech Plaza, Karachi, Pakistan</li>
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