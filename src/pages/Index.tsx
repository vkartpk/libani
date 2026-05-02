import { SEO } from "@/components/SEO";
import { HeroSlider } from "@/components/home/HeroSlider";
import { TrustBadges } from "@/components/home/TrustBadges";
import { BrandStrip } from "@/components/home/BrandStrip";
import { FeaturedSpotlight } from "@/components/home/FeaturedSpotlight";
import { FlashSale } from "@/components/home/FlashSale";
import { BrandCollection } from "@/components/home/BrandCollection";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { GamingBanner } from "@/components/home/GamingBanner";
import { WeeklyPicks } from "@/components/home/WeeklyPicks";
import { Testimonials } from "@/components/home/Testimonials";
import { NewsletterBanner } from "@/components/home/NewsletterBanner";

const Index = () => (
  <>
    <SEO
      title="TechZone — Premium Tech Accessories in Pakistan"
      description="Shop authentic computer peripherals, gaming gear, mobile accessories, audio, networking, and power gear. Free shipping above Rs.1000."
      jsonLd={[
        { "@context": "https://schema.org", "@type": "Organization", name: "TechZone", url: typeof window !== "undefined" ? window.location.origin : "" },
        { "@context": "https://schema.org", "@type": "WebSite", name: "TechZone", url: typeof window !== "undefined" ? window.location.origin : "" },
      ]}
    />
    <HeroSlider />
    <TrustBadges />
    <BrandStrip />
    <FeaturedSpotlight />
    <FlashSale />
    <BrandCollection slug="amaze" />
    <CategoryShowcase />
    <BrandCollection slug="joyroom" />
    <GamingBanner />
    <BrandCollection slug="lenovo" />
    <WeeklyPicks />
    <BrandCollection slug="ldnio" />
    <BrandCollection slug="tp-link" />
    <Testimonials />
    <NewsletterBanner />
  </>
);

export default Index;
