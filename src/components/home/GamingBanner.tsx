import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function GamingBanner() {
  return (
    <section className="container-x mt-14">
      <div className="relative overflow-hidden rounded-xl border border-border min-h-[260px] flex items-center bg-gradient-to-r from-background via-primary/30 to-background">
        <img src="https://picsum.photos/seed/gaming-banner/1600/500" alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="relative p-8 md:p-14 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-primary font-bold">Built for victory</p>
          <h2 className="mt-2 font-display text-3xl md:text-5xl font-extrabold">Gaming Setup? We've Got Everything.</h2>
          <p className="mt-3 text-muted-foreground">From mechanical keyboards to RGB chairs — Pakistan's biggest gaming gear lineup.</p>
          <Link to="/category/gaming-mouse" className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition">
            Shop gaming <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}