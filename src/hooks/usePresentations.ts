import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Presentation {
  id: string;
  title: string;
  content: string;
  client_name: string | null;
  brand_guide_id: string | null;
  generated_slides: unknown[] | null;
  is_locked: boolean;
  created_by: string | null;
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
      client_name,
      brand_guide_id,
      created_by,
    }: { 
      title: string; 
      content: string; 
      client_name?: string;
      brand_guide_id?: string;
      created_by?: string;
    }) => {
      const { data, error } = await supabase
        .from("presentations")
        .insert({ title, content, client_name, brand_guide_id, created_by })
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
      // Check if presentation is locked before deleting
      const { data: presentation } = await supabase
        .from("presentations")
        .select("is_locked")
        .eq("id", id)
        .single();
      
      if (presentation?.is_locked) {
        throw new Error("Cannot delete a locked presentation");
      }
      
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

export const useTogglePresentationLock = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, is_locked }: { id: string; is_locked: boolean }) => {
      const { data, error } = await supabase
        .from("presentations")
        .update({ is_locked })
        .eq("id", id)
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

export const useUpdatePresentation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      title 
    }: { 
      id: string; 
      title: string; 
    }) => {
      // Check if presentation is locked before updating
      const { data: presentation } = await supabase
        .from("presentations")
        .select("is_locked")
        .eq("id", id)
        .single();
      
      if (presentation?.is_locked) {
        throw new Error("Cannot edit a locked presentation");
      }
      
      const { data, error } = await supabase
        .from("presentations")
        .update({ title, updated_at: new Date().toISOString() })
        .eq("id", id)
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
