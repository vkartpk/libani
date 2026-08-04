import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { setCurrencyConfig } from "@/lib/storage";

export type SiteSettings = {
  id?: string;
  site_name: string;
  tagline: string | null;
  support_phone: string | null;
  support_email: string | null;
  whatsapp: string | null;
  address: string | null;
  social: Record<string, string>;
  logo_url: string | null;
  currency_code: string;
  currency_symbol: string;
  currency_locale: string;
  currency_decimals: number;
  shipping_fee: number;
  free_shipping_threshold: number;
  cod_fee: number;
  delivery_days_min: number;
  delivery_days_max: number;
  announcement_text: string | null;
  announcement_link: string | null;
  announcement_enabled: boolean;
  promo: { title?: string; subtitle?: string; cta?: string; href?: string; image?: string; enabled?: boolean; starts_at?: string; ends_at?: string };
  theme_primary: string | null;
  theme_accent: string | null;
  theme_background: string | null;
  theme_foreground: string | null;
  theme_default_mode: "dark" | "light" | "system" | null;
  maintenance_mode: boolean;
  maintenance_message: string | null;
  maintenance_eta: string | null;
};

const DEFAULTS: SiteSettings = {
  site_name: "libani",
  tagline: null,
  support_phone: null,
  support_email: null,
  whatsapp: null,
  address: null,
  social: {},
  logo_url: null,
  currency_code: "PKR",
  currency_symbol: "Rs.",
  currency_locale: "en-PK",
  currency_decimals: 0,
  shipping_fee: 200,
  free_shipping_threshold: 1000,
  cod_fee: 0,
  delivery_days_min: 2,
  delivery_days_max: 5,
  announcement_text: null,
  announcement_link: null,
  announcement_enabled: false,
  promo: {},
  theme_primary: null,
  theme_accent: null,
  theme_background: null,
  theme_foreground: null,
  theme_default_mode: "dark",
  maintenance_mode: false,
  maintenance_message: null,
  maintenance_eta: null,
};

export function useSiteSettings() {
  const q = useQuery({
    queryKey: ["site_settings"],
    staleTime: 5 * 60 * 1000,
    queryFn: async (): Promise<SiteSettings> => {
      const { data } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();
      if (!data) return DEFAULTS;
      return { ...DEFAULTS, ...(data as any), social: (data as any).social || {}, promo: (data as any).promo || {} };
    },
  });

  const settings = q.data || DEFAULTS;

  useEffect(() => {
    setCurrencyConfig({
      symbol: settings.currency_symbol,
      locale: settings.currency_locale,
      decimals: settings.currency_decimals,
    });
  }, [settings.currency_symbol, settings.currency_locale, settings.currency_decimals]);

  return { settings, isLoading: q.isLoading, refetch: q.refetch };
}