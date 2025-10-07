import { useState } from "react";
import { Phase1DocumentSelection } from "./Phase1DocumentSelection";
import { Phase1AnalysisType, AnalysisConfig } from "./Phase1AnalysisType";
import { Phase2ResultsReview } from "./Phase2ResultsReview";
import { Phase3PromptGeneration } from "./Phase3PromptGeneration";
import { Document as DocType } from "@/hooks/useDocumentManagement";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";

interface AnalysisWorkflowHubProps {
  documents: DocType[];
}

type WorkflowPhase = "select-docs" | "select-type" | "processing" | "results" | "generate-prompt";

export function AnalysisWorkflowHub({ documents }: AnalysisWorkflowHubProps) {
  const { toast } = useToast();
  const [phase, setPhase] = useState<WorkflowPhase>("select-docs");
  const [selectedDocs, setSelectedDocs] = useState<DocType[]>([]);
  const [analysisConfig, setAnalysisConfig] = useState<AnalysisConfig | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);

  const handleDocumentSelection = (docs: DocType[]) => {
    setSelectedDocs(docs);
    setPhase("select-type");
  };

  const handleBackToDocSelection = () => {
    setPhase("select-docs");
  };

  const handleStartAnalysis = (config: AnalysisConfig) => {
    setAnalysisConfig(config);
    setPhase("processing");
    
    // Simulate processing
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setProcessingProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setPhase("results");
          toast({
            title: "Analysis complete",
            description: `Successfully analyzed ${selectedDocs.length} documents`,
          });
        }, 500);
      }
    }, 400);
  };

  const handleGeneratePrompt = () => {
    setPhase("generate-prompt");
  };

  const handleBackToResults = () => {
    setPhase("results");
  };

  const handleRunNewAnalysis = () => {
    setPhase("select-docs");
    setSelectedDocs([]);
    setAnalysisConfig(null);
  };

  const handleSaveAnalysis = () => {
    toast({
      title: "Analysis saved",
      description: "Your analysis has been saved successfully",
    });
  };

  const handleCompleteWorkflow = () => {
    toast({
      title: "Workflow complete",
      description: "Your prompt has been saved to the library",
    });
    setPhase("select-docs");
    setSelectedDocs([]);
    setAnalysisConfig(null);
  };

  if (phase === "select-docs") {
    return (
      <Phase1DocumentSelection
        documents={documents}
        onProceed={handleDocumentSelection}
      />
    );
  }

  if (phase === "select-type" && selectedDocs.length > 0) {
    return (
      <Phase1AnalysisType
        documents={selectedDocs}
        onBack={handleBackToDocSelection}
        onStartAnalysis={handleStartAnalysis}
      />
    );
  }

  if (phase === "processing") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 space-y-4">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Analyzing Documents</h3>
              <p className="text-sm text-muted-foreground">
                Processing {selectedDocs.length} document{selectedDocs.length !== 1 ? 's' : ''}...
              </p>
            </div>
            <Progress value={processingProgress} className="w-full" />
            <p className="text-xs text-center text-muted-foreground">
              {processingProgress}% complete
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (phase === "results" && analysisConfig) {
    return (
      <Phase2ResultsReview
        documents={selectedDocs}
        config={analysisConfig}
        onGeneratePrompt={handleGeneratePrompt}
        onRunNewAnalysis={handleRunNewAnalysis}
        onSaveAnalysis={handleSaveAnalysis}
      />
    );
  }

  if (phase === "generate-prompt") {
    return (
      <Phase3PromptGeneration
        onBack={handleBackToResults}
        onComplete={handleCompleteWorkflow}
      />
    );
  }

  return null;
}
