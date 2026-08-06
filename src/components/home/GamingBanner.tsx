import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useBanners } from "@/hooks/useCms";
import gamingBanner from "@/assets/gaming-banner.jpg";

export function GamingBanner() {
  const { banners } = useBanners("gaming");
  const b = banners[0];

  const content = {
    badge: b?.badge || "Built for victory",
    title: b?.title || "Gaming Setup? We've Got Everything.",
    subtitle: b?.subtitle || "From mechanical keyboards to RGB chairs — Pakistan's biggest gaming gear lineup.",
    ctaLabel: b?.cta_label || "Shop gaming",
    ctaHref: b?.cta_href || "/category/gaming-mouse",
    image: b?.image_url || gamingBanner,
  };

  return (
    <section className="container-x mt-14">
      <div className="relative overflow-hidden rounded-xl border border-border min-h-[260px] flex items-center bg-gradient-to-r from-background via-primary/30 to-background">
        <img src={content.image} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="relative p-8 md:p-14 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-primary font-bold">{content.badge}</p>
          <h2 className="mt-2 font-display text-3xl md:text-5xl font-extrabold">{content.title}</h2>
          <p className="mt-3 text-muted-foreground">{content.subtitle}</p>
          <Link to={content.ctaHref} className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition">
            {content.ctaLabel} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
