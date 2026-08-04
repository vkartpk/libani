import { ReactNode } from "react";
import { NavLink, Navigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, MapPin, User as UserIcon, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/account", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/account/orders", label: "Orders", icon: Package },
  { to: "/account/addresses", label: "Addresses", icon: MapPin },
  { to: "/account/profile", label: "Profile", icon: UserIcon },
  { to: "/account/security", label: "Security", icon: Lock },
];

export function AccountLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const loc = useLocation();
  if (loading) return <div className="container-x py-12 text-center text-muted-foreground">Loading…</div>;
  if (!user) return <Navigate to="/auth" state={{ from: loc }} replace />;

  return (
    <>
      <SEO title="My Account | libani" />
      <div className="container-x py-6">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "My Account" }]} />
        <h1 className="font-display text-2xl md:text-3xl font-bold mt-4 mb-6">My Account</h1>
        <div className="grid lg:grid-cols-[220px_1fr] gap-6">
          <aside className="bg-card border border-border rounded-lg p-2 h-fit lg:sticky lg:top-32">
            <nav className="flex lg:flex-col gap-1 overflow-x-auto">
              {tabs.map((t) => (
                <NavLink key={t.to} to={t.to} end={t.end}
                  className={({ isActive }) => cn("flex items-center gap-2 px-3 py-2 rounded text-sm whitespace-nowrap", isActive ? "bg-primary text-primary-foreground" : "hover:bg-surface")}>
                  <t.icon className="h-4 w-4" /> {t.label}
                </NavLink>
              ))}
            </nav>
          </aside>
          <section>{children}</section>
        </div>
      </div>
    </>
  );
}