import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface AnalysisSession {
  id: string;
  deal_id: string;
  name: string;
  selected_document_ids: string[];
  summary: string | null;
  custom_prompts: {
    teaser?: string;
    cim?: string;
  };
  created_at: string;
  updated_at: string;
}

export function useAnalysisSessions(dealId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ["analysis-sessions", dealId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("analysis_sessions")
        .select("*")
        .eq("deal_id", dealId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as AnalysisSession[];
    },
  });

  const createSession = useMutation({
    mutationFn: async (name?: string) => {
      const { data: nameData, error: nameError } = await supabase
        .rpc("generate_analysis_name");

      const sessionName = name || nameData || "New Analysis";

      const { data, error } = await supabase
        .from("analysis_sessions")
        .insert({
          deal_id: dealId,
          name: sessionName,
          selected_document_ids: [],
          custom_prompts: {},
        })
        .select()
        .single();

      if (error) throw error;
      return data as AnalysisSession;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["analysis-sessions", dealId] });
      toast({
        title: "Analysis session created",
        description: "Your new analysis session is ready",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create session",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateSession = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Omit<AnalysisSession, "id" | "deal_id" | "created_at" | "updated_at">>;
    }) => {
      const { data, error } = await supabase
        .from("analysis_sessions")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as AnalysisSession;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["analysis-sessions", dealId] });
    },
    onError: (error) => {
      toast({
        title: "Failed to update session",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteSession = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("analysis_sessions")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["analysis-sessions", dealId] });
      toast({
        title: "Session deleted",
        description: "Analysis session has been removed",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete session",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    sessions,
    isLoading,
    createSession: createSession.mutateAsync,
    updateSession: updateSession.mutateAsync,
    deleteSession: deleteSession.mutateAsync,
  };
}
