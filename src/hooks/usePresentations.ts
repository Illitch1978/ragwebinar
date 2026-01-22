import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Presentation {
  id: string;
  title: string;
  content: string;
  client_name: string | null;
  created_at: string;
  updated_at: string;
}

export const usePresentations = () => {
  return useQuery({
    queryKey: ["presentations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("presentations")
        .select("*")
        .order("updated_at", { ascending: false });
      
      if (error) throw error;
      return data as Presentation[];
    },
  });
};

export const useCreatePresentation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      title, 
      content, 
      client_name 
    }: { 
      title: string; 
      content: string; 
      client_name?: string; 
    }) => {
      const { data, error } = await supabase
        .from("presentations")
        .insert({ title, content, client_name })
        .select()
        .single();
      
      if (error) throw error;
      return data as Presentation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["presentations"] });
    },
  });
};

export const useDeletePresentation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("presentations")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["presentations"] });
    },
  });
};
