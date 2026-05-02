import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { AnnouncementBar } from "./AnnouncementBar";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MobileBottomNav } from "./MobileBottomNav";
import { BackToTop } from "./BackToTop";
import { CookieConsent } from "./CookieConsent";
import { CartDrawer } from "@/components/CartDrawer";

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar />
      <Header />
      <main key={pathname} className="flex-1 fade-in-page pb-20 lg:pb-0">
        {children}
      </main>
      <Footer />
      <MobileBottomNav />
      <BackToTop />
      <CookieConsent />
      <CartDrawer />
    </div>
  );
}