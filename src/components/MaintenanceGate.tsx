import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useUserRole } from "@/hooks/useUserRole";
import Maintenance from "@/pages/Maintenance";

const ALLOW_PREFIXES = ["/libani", "/auth", "/reset-password"];

export function MaintenanceGate({ children }: { children: ReactNode }) {
  const { settings, isLoading } = useSiteSettings();
  const { isAdmin } = useUserRole();
  const { pathname } = useLocation();

  if (isLoading) return <>{children}</>;
  const allowed = ALLOW_PREFIXES.some((p) => pathname.startsWith(p));
  if (settings.maintenance_mode && !allowed && !isAdmin) {
    return <Maintenance />;
  }
  return <>{children}</>;
}