import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BrandStrip } from "@/components/home/BrandStrip";
import { NewsletterBanner } from "@/components/home/NewsletterBanner";

export default function About() {
  return (
    <>
      <SEO title="About Us | libani" description="Learn the story behind libani — Pakistan's premier tech accessories destination." />
      <div className="container-x py-6">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "About" }]} />
        <div className="mt-6 rounded-xl bg-gradient-to-br from-primary/20 to-card border border-border p-8 md:p-14">
          <h1 className="font-display text-3xl md:text-5xl font-bold">About libani</h1>
          <p className="mt-3 text-muted-foreground max-w-2xl">Pakistan's premier destination for authentic tech accessories — backed by a team obsessed with great gear and fair prices.</p>
        </div>
        <div className="mt-10 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="section-title">Our Story</h2>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">From our humble beginnings in 2018, libani quickly grew to become one of Pakistan's premier tech accessories e-commerce destinations. We started with a simple mission: bring authentic, well-priced tech gear to every doorstep in Pakistan, backed by responsive support that actually listens.</p>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">Today we partner with 18+ top global brands and serve thousands of happy customers from Karachi to Gilgit.</p>
          </div>
          <img src="https://picsum.photos/seed/about/800/600" alt="Our team" className="rounded-lg" />
        </div>
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[["5+","Years Experience"],["10K+","Happy Customers"],["500+","Products"],["18+","Top Brands"]].map(([n, l]) => (
            <div key={l} className="p-6 bg-card border border-border rounded-lg"><p className="font-display text-3xl text-primary font-bold">{n}</p><p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{l}</p></div>
          ))}
        </div>
        <BrandStrip />
        <NewsletterBanner />
      </div>
    </>
  );
}