import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

export type BrandGuide = Tables<"brand_guides">;

export const useBrandGuides = () => {
  return useQuery({
    queryKey: ["brand-guides"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("brand_guides")
        .select("*")
        .order("is_default", { ascending: false });

      if (error) throw error;
      return data as BrandGuide[];
    },
  });
};

export const useDefaultBrandGuide = () => {
  return useQuery({
    queryKey: ["brand-guides", "default"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("brand_guides")
        .select("*")
        .eq("is_default", true)
        .maybeSingle();

      if (error) throw error;
      return data as BrandGuide | null;
    },
  });
};
