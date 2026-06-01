import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import heroGaming from "@/assets/hero-gaming.jpg";
import heroPower from "@/assets/hero-power.jpg";
import heroAudio from "@/assets/hero-audio.jpg";

const slides = [
  { eyebrow: "Gaming Collection", title: "Level Up Your Setup", desc: "Mechanical keyboards, precision mice, and headsets built for victory.", cta: "/category/gaming-mouse", img: heroGaming, grad: "from-primary/30 to-background" },
  { eyebrow: "Power & Charging", title: "Stay Connected, Stay Charged", desc: "20,000mAh power banks, 100W cables, fast chargers. We've got you covered.", cta: "/category/power-banks", img: heroPower, grad: "from-success/20 to-background" },
  { eyebrow: "Premium Audio", title: "Sound That Moves You", desc: "TWS earbuds, over-ear headphones, neckbands — from JBL-rivalling quality at honest prices.", cta: "/category/tws", img: heroAudio, grad: "from-primary/40 to-background" },
];

export function HeroSlider() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 4000);
    return () => clearInterval(t);
  }, [paused]);

  const s = slides[i];
  return (
    <section className="container-x mt-4">
      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className={cn("relative overflow-hidden rounded-xl bg-gradient-to-br border border-border", s.grad)}
      >
        <div className="grid md:grid-cols-2 gap-6 items-center min-h-[360px] md:min-h-[440px]">
          <div className="p-8 md:p-12 z-10">
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-bold mb-3">{s.eyebrow}</p>
            <h1 className="font-display text-3xl md:text-5xl font-extrabold leading-tight">{s.title}</h1>
            <p className="mt-4 text-muted-foreground text-base md:text-lg max-w-md">{s.desc}</p>
            <Link to={s.cta} className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition">
              Shop now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="relative h-64 md:h-full">
            <img src={s.img} alt={s.title} className="absolute inset-0 w-full h-full object-cover opacity-80" />
          </div>
        </div>

        <button onClick={() => setI((i + slides.length - 1) % slides.length)} aria-label="Previous slide" className="absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 grid place-items-center rounded-full bg-background/60 backdrop-blur hover:bg-primary hover:text-primary-foreground">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button onClick={() => setI((i + 1) % slides.length)} aria-label="Next slide" className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 grid place-items-center rounded-full bg-background/60 backdrop-blur hover:bg-primary hover:text-primary-foreground">
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, idx) => (
            <button key={idx} onClick={() => setI(idx)} aria-label={`Go to slide ${idx+1}`} className={cn("h-1.5 rounded-full transition-all", idx === i ? "w-8 bg-primary" : "w-2 bg-foreground/30")} />
          ))}
        </div>
      </div>
    </section>
  );
}