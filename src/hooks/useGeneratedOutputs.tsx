import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type OutputType = "summary" | "teaser" | "cim";

export interface GeneratedOutput {
  id: string;
  session_id: string;
  type: OutputType;
  content: string;
  prompt_used: string | null;
  created_at: string;
  metadata: Record<string, any>;
}

export function useGeneratedOutputs(sessionId: string | null) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: outputs = [], isLoading } = useQuery({
    queryKey: ["generated-outputs", sessionId],
    queryFn: async () => {
      if (!sessionId) return [];

      const { data, error } = await supabase
        .from("generated_outputs")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as GeneratedOutput[];
    },
    enabled: !!sessionId,
  });

  const createOutput = useMutation({
    mutationFn: async ({
      type,
      content,
      promptUsed,
      metadata,
    }: {
      type: OutputType;
      content: string;
      promptUsed?: string;
      metadata?: Record<string, any>;
    }) => {
      if (!sessionId) throw new Error("No session selected");

      const { data, error } = await supabase
        .from("generated_outputs")
        .insert({
          session_id: sessionId,
          type,
          content,
          prompt_used: promptUsed || null,
          metadata: metadata || {},
        })
        .select()
        .single();

      if (error) throw error;
      return data as GeneratedOutput;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["generated-outputs", sessionId] });
    },
    onError: (error) => {
      toast({
        title: "Failed to save output",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteOutput = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("generated_outputs")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["generated-outputs", sessionId] });
      toast({
        title: "Output deleted",
        description: "Generated output has been removed",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete output",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    outputs,
    isLoading,
    createOutput: createOutput.mutateAsync,
    deleteOutput: deleteOutput.mutateAsync,
    outputsByType: {
      summary: outputs.filter((o) => o.type === "summary"),
      teaser: outputs.filter((o) => o.type === "teaser"),
      cim: outputs.filter((o) => o.type === "cim"),
    },
  };
}
