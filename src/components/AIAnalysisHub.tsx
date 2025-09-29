import { useState } from "react";
import { useParams } from "react-router-dom";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { useAnalysisSessions } from "@/hooks/useAnalysisSessions";
import { useGeneratedOutputs, GeneratedOutput } from "@/hooks/useGeneratedOutputs";
import { AnalysisSessionsList } from "./analysis/AnalysisSessionsList";
import { AnalysisWorkspace } from "./analysis/AnalysisWorkspace";
import { OutputsLibrary } from "./analysis/OutputsLibrary";
import { Document } from "@/hooks/useDocumentManagement";

interface AIAnalysisHubProps {
  documents: Document[];
}

export function AIAnalysisHub({ documents }: AIAnalysisHubProps) {
  const { id: dealId } = useParams<{ id: string }>();
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const {
    sessions,
    isLoading: isLoadingSessions,
    createSession,
    updateSession,
    deleteSession,
  } = useAnalysisSessions(dealId || "");

  const {
    outputs,
    outputsByType,
    createOutput,
    deleteOutput,
  } = useGeneratedOutputs(activeSessionId);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || null;

  const handleCreateSession = async () => {
    const newSession = await createSession(undefined);
    setActiveSessionId(newSession.id);
  };

  const handleRenameSession = async (id: string, name: string) => {
    await updateSession({ id, updates: { name } });
  };

  const handleUpdateSession = async (updates: Partial<any>) => {
    if (!activeSessionId) return;
    await updateSession({ id: activeSessionId, updates });
  };

  const handleOutputGenerated = async (
    type: "summary" | "teaser" | "cim",
    content: string,
    prompt?: string
  ) => {
    await createOutput({
      type,
      content,
      promptUsed: prompt,
    });
  };

  const handleDownload = (output: GeneratedOutput) => {
    const extension = output.type === "teaser" || output.type === "cim" ? "md" : "txt";
    const blob = new Blob([output.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${output.type}-${new Date(output.created_at).toISOString().split("T")[0]}.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoadingSessions) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <AnalysisSessionsList
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSelectSession={setActiveSessionId}
            onCreateSession={handleCreateSession}
            onDeleteSession={deleteSession}
            onRenameSession={handleRenameSession}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={55} minSize={40}>
          <AnalysisWorkspace
            session={activeSession}
            documents={documents}
            onUpdateSession={handleUpdateSession}
            onOutputGenerated={handleOutputGenerated}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
          <OutputsLibrary
            outputs={outputs}
            outputsByType={outputsByType}
            onDelete={deleteOutput}
            onDownload={handleDownload}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
