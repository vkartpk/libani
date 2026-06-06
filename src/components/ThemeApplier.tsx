import { useEffect } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

/**
 * Applies admin-configured theme color tokens to :root as CSS variables.
 * Values in site_settings are stored as HSL triplets ("h s% l%").
 */
export function ThemeApplier() {
  const { settings } = useSiteSettings();
  useEffect(() => {
    const root = document.documentElement;
    const map: Record<string, string | null> = {
      "--primary": settings.theme_primary,
      "--ring": settings.theme_primary,
      "--accent": settings.theme_accent,
      "--background": settings.theme_background,
      "--foreground": settings.theme_foreground,
    };
    Object.entries(map).forEach(([k, v]) => {
      if (v) root.style.setProperty(k, v);
      else root.style.removeProperty(k);
    });
  }, [
    settings.theme_primary,
    settings.theme_accent,
    settings.theme_background,
    settings.theme_foreground,
  ]);
  return null;
}