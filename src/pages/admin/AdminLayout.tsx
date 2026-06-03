import { ReactNode } from "react";
import { Navigate, NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, ShoppingBag, Package, Tags, Building2, Users, ArrowLeft, Sparkles, Wallet, CreditCard, ImageIcon } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const items = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: Tags },
  { to: "/admin/brands", label: "Brands", icon: Building2 },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/finance", label: "Finance", icon: Wallet },
  { to: "/admin/payments", label: "Payments", icon: CreditCard },
  { to: "/admin/image-optimizer", label: "Image Optimizer", icon: ImageIcon },
  { to: "/admin/seo", label: "SEO / AEO / GEO", icon: Sparkles },
];

export function AdminLayout({ children, title }: { children: ReactNode; title: string }) {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading } = useUserRole();
  const location = useLocation();

  if (authLoading || loading) {
    return <div className="container-x py-10"><Skeleton className="h-96 w-full" /></div>;
  }
  if (!user) return <Navigate to={`/auth?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="container-x py-6">
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
        <aside className="lg:sticky lg:top-20 self-start">
          <div className="rounded-lg border bg-card p-3">
            <div className="px-2 pb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Admin</div>
            <nav className="flex flex-col gap-1">
              {items.map((it) => (
                <NavLink
                  key={it.to}
                  to={it.to}
                  end={it.end}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                      isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    )
                  }
                >
                  <it.icon className="h-4 w-4" /> {it.label}
                </NavLink>
              ))}
              <NavLink to="/" className="mt-3 flex items-center gap-2 rounded-md px-3 py-2 text-xs text-muted-foreground hover:bg-muted">
                <ArrowLeft className="h-3 w-3" /> Back to store
              </NavLink>
            </nav>
          </div>
        </aside>
        <section>
          <h1 className="text-2xl font-bold mb-4">{title}</h1>
          {children}
        </section>
      </div>
    </div>
  );
}
