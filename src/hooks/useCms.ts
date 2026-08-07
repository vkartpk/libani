import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export type CmsPage = {
  id: string;
  slug: string;
  title: string;
  content: string;
  meta_title: string | null;
  meta_description: string | null;
  footer_label: string | null;
  show_in_footer: boolean;
  sort_order: number;
  is_published: boolean;
};

export type CmsBanner = {
  id: string;
  placement: string;
  title: string;
  subtitle: string | null;
  badge: string | null;
  cta_label: string | null;
  cta_href: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
};

const db = supabase as any;

export function useCmsPages() {
  const q = useQuery({
    queryKey: ["cms_pages"],
    staleTime: 60_000,
    queryFn: async (): Promise<CmsPage[]> => {
      const { data, error } = await db.from("pages").select("*").order("sort_order");
      if (error) return [];
      return (data || []) as CmsPage[];
    },
  });
  return { pages: q.data || [], isLoading: q.isLoading, refetch: q.refetch };
}

export function useCmsPage(slug?: string) {
  const { pages, isLoading } = useCmsPages();
  const page = pages.find((p) => p.slug === slug) || null;
  return { page, pages, isLoading };
}

export function useBanners(placement = "hero") {
  const q = useQuery({
    queryKey: ["cms_banners", placement],
    staleTime: 60_000,
    queryFn: async (): Promise<CmsBanner[]> => {
      const { data, error } = await db
        .from("banners")
        .select("*")
        .eq("placement", placement)
        .eq("is_active", true)
        .order("sort_order");
      if (error) return [];
      return (data || []) as CmsBanner[];
    },
  });
  return { banners: q.data || [], isLoading: q.isLoading };
}
