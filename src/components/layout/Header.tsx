import { Link, NavLink } from "react-router-dom";
import { Heart, Search, ShoppingCart, User, Menu, Zap, Phone, Mail, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { SearchOverlay } from "@/components/SearchOverlay";
import { categories, gamingCategories } from "@/data/categories";
import { brands } from "@/data/brands";
import { cn } from "@/lib/utils";

function MegaMenuTrigger({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="relative group">
      <button className="flex items-center gap-1 px-3 py-4 text-sm font-medium hover:text-primary transition-colors">
        {label} <ChevronDown className="h-3 w-3" />
      </button>
      <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all absolute left-1/2 -translate-x-1/2 top-full pt-1 z-50">
        <div className="bg-card border border-border rounded-lg shadow-2xl p-6">{children}</div>
      </div>
    </div>
  );
}

export function Header() {
  const { count, setDrawerOpen } = useCart();
  const { count: wishCount } = useWishlist();
  const { user } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);

  const mainCats = categories.filter((c) => c.group === "main");
  const periphCats = categories.filter((c) => c.group === "peripherals");
  const extraCats = categories.filter((c) => c.group === "extra");

  return (
    <>
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
        {/* Top secondary nav */}
        <div className="hidden lg:block border-b border-border/50 bg-card/50">
          <div className="container-x flex items-center justify-between py-1.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <a href="tel:+923000000000" className="flex items-center gap-1 hover:text-foreground"><Phone className="h-3 w-3" /> +92 300 0000000</a>
              <a href="mailto:hello@techzone.pk" className="flex items-center gap-1 hover:text-foreground"><Mail className="h-3 w-3" /> hello@techzone.pk</a>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/track-order" className="hover:text-foreground">Track Order</Link>
              <Link to="/faq" className="hover:text-foreground">FAQ</Link>
              <Link to="/contact" className="hover:text-foreground">Contact</Link>
            </div>
          </div>
        </div>

        <div className="container-x flex items-center gap-3 py-3">
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost" className="lg:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 bg-card border-border overflow-y-auto">
              <SheetTitle className="font-display">Menu</SheetTitle>
              <nav className="mt-6">
                <Link to="/" className="block py-2 font-medium">Home</Link>
                <Accordion type="multiple" className="border-0">
                  <AccordionItem value="cats" className="border-b border-border">
                    <AccordionTrigger className="text-sm">Categories</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 pl-2">
                        {categories.map((c) => (
                          <li key={c.slug}><Link to={`/category/${c.slug}`} className="text-sm text-muted-foreground hover:text-foreground">{c.name}</Link></li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="gaming" className="border-b border-border">
                    <AccordionTrigger className="text-sm">Gaming</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 pl-2">
                        {gamingCategories.map((c) => (
                          <li key={c.slug}><Link to={`/category/${c.slug}`} className="text-sm text-muted-foreground hover:text-foreground">{c.name}</Link></li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="brands" className="border-b border-border">
                    <AccordionTrigger className="text-sm">Brands</AccordionTrigger>
                    <AccordionContent>
                      <ul className="grid grid-cols-2 gap-2 pl-2">
                        {brands.map((b) => (
                          <li key={b.slug}><Link to={`/brand/${b.slug}`} className="text-sm text-muted-foreground hover:text-foreground">{b.name}</Link></li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <Link to="/blog" className="block py-3 font-medium border-b border-border text-sm">Blog</Link>
                <Link to="/track-order" className="block py-3 font-medium border-b border-border text-sm">Track Order</Link>
                <Link to="/about" className="block py-3 font-medium border-b border-border text-sm">About Us</Link>
                <Link to="/contact" className="block py-3 font-medium text-sm">Contact</Link>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5 shrink-0">
            <span className="grid place-items-center h-8 w-8 rounded bg-primary text-primary-foreground"><Zap className="h-4 w-4" /></span>
            <span className="font-display font-bold text-lg sm:text-xl tracking-tight">
              Tech<span className="text-primary">Zone</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center ml-2">
            <NavLink to="/" className={({ isActive }) => cn("px-3 py-4 text-sm font-medium hover:text-primary transition-colors", isActive && "text-primary")}>Home</NavLink>

            <MegaMenuTrigger label="Categories">
              <div className="grid grid-cols-3 gap-8 w-[720px]">
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Networking & Audio</h4>
                  <ul className="space-y-2">{mainCats.slice(0,5).map((c) => (
                    <li key={c.slug}><Link to={`/category/${c.slug}`} className="text-sm hover:text-primary">{c.name}</Link></li>
                  ))}</ul>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Power & Smart</h4>
                  <ul className="space-y-2">{mainCats.slice(5).map((c) => (
                    <li key={c.slug}><Link to={`/category/${c.slug}`} className="text-sm hover:text-primary">{c.name}</Link></li>
                  ))}</ul>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Computer Peripherals</h4>
                  <ul className="space-y-2">{periphCats.map((c) => (
                    <li key={c.slug}><Link to={`/category/${c.slug}`} className="text-sm hover:text-primary">{c.name}</Link></li>
                  ))}</ul>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border grid grid-cols-4 gap-2">
                {extraCats.slice(0,4).map((c) => (
                  <Link key={c.slug} to={`/category/${c.slug}`} className="text-xs text-muted-foreground hover:text-primary">{c.name}</Link>
                ))}
              </div>
            </MegaMenuTrigger>

            <MegaMenuTrigger label="Gaming">
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 w-[480px]">
                {gamingCategories.map((c) => (
                  <Link key={c.slug} to={`/category/${c.slug}`} className="flex items-center gap-2 text-sm hover:text-primary">
                    <c.icon className="h-4 w-4 text-primary" /> {c.name}
                  </Link>
                ))}
              </div>
            </MegaMenuTrigger>

            <MegaMenuTrigger label="Brands">
              <div className="grid grid-cols-4 gap-3 w-[640px]">
                {brands.map((b) => (
                  <Link key={b.slug} to={`/brand/${b.slug}`} className="px-3 py-2 rounded text-sm bg-surface hover:bg-primary hover:text-primary-foreground transition text-center">
                    {b.name}
                  </Link>
                ))}
              </div>
            </MegaMenuTrigger>

            <NavLink to="/blog" className={({isActive}) => cn("px-3 py-4 text-sm font-medium hover:text-primary transition-colors", isActive && "text-primary")}>Blog</NavLink>
            <NavLink to="/about" className={({isActive}) => cn("px-3 py-4 text-sm font-medium hover:text-primary transition-colors", isActive && "text-primary")}>About</NavLink>
          </nav>

          {/* Right icons */}
          <div className="ml-auto flex items-center gap-1">
            <Button size="icon" variant="ghost" onClick={() => setSearchOpen(true)} aria-label="Search">
              <Search className="h-5 w-5" />
            </Button>
            <Button asChild size="icon" variant="ghost" className="relative" aria-label="Wishlist">
              <Link to="/wishlist">
                <Heart className="h-5 w-5" />
                {wishCount > 0 && <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 grid place-items-center text-[10px] font-bold rounded-full bg-primary text-primary-foreground">{wishCount}</span>}
              </Link>
            </Button>
            <Button asChild size="icon" variant="ghost" aria-label="Account">
              <Link to={user ? "/wishlist" : "/auth"}>
                <User className="h-5 w-5" />
              </Link>
            </Button>
            <Button size="icon" variant="ghost" onClick={() => setDrawerOpen(true)} className="relative" aria-label="Cart">
              <ShoppingCart className="h-5 w-5" />
              {count > 0 && <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 grid place-items-center text-[10px] font-bold rounded-full bg-primary text-primary-foreground">{count}</span>}
            </Button>
          </div>
        </div>
      </header>
      <SearchOverlay open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}