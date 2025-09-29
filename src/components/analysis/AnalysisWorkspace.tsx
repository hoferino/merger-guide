import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AnalysisSession } from "@/hooks/useAnalysisSessions";
import { Document } from "@/hooks/useDocumentManagement";

interface AnalysisWorkspaceProps {
  session: AnalysisSession | null;
  documents: Document[];
  onUpdateSession: (updates: Partial<AnalysisSession>) => void;
  onOutputGenerated: (type: "summary" | "teaser" | "cim", content: string, prompt?: string) => void;
}

export function AnalysisWorkspace({
  session,
  documents,
  onUpdateSession,
  onOutputGenerated,
}: AnalysisWorkspaceProps) {
  const { toast } = useToast();
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isGeneratingTeaser, setIsGeneratingTeaser] = useState(false);
  const [teaserPrompt, setTeaserPrompt] = useState("");

  const selectedDocuments = session?.selected_document_ids || [];

  const toggleDocument = (docId: string) => {
    const newSelection = selectedDocuments.includes(docId)
      ? selectedDocuments.filter((id) => id !== docId)
      : [...selectedDocuments, docId];
    
    onUpdateSession({ selected_document_ids: newSelection });
  };

  const generateSummary = async () => {
    if (selectedDocuments.length === 0) {
      toast({
        title: "No documents selected",
        description: "Please select at least one document",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingSummary(true);

    try {
      const selectedDocs = documents.filter((doc) => selectedDocuments.includes(doc.id));
      const { data, error } = await supabase.functions.invoke("analyze-documents", {
        body: { documents: selectedDocs },
      });

      if (error) throw error;

      const summary = data.summary;
      onUpdateSession({ summary });
      onOutputGenerated("summary", summary);

      toast({
        title: "Summary generated",
        description: "AI analysis complete",
      });
    } catch (error: any) {
      toast({
        title: "Failed to generate summary",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const generateTeaser = async () => {
    if (!session.summary) {
      toast({
        title: "No summary available",
        description: "Generate a summary first",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingTeaser(true);

    try {
      const prompt = teaserPrompt.trim() || getDefaultTeaserPrompt();

      const { data, error } = await supabase.functions.invoke("generate-teaser", {
        body: {
          summary: session.summary,
          prompt,
        },
      });

      if (error) throw error;

      const teaser = data.teaser;
      onOutputGenerated("teaser", teaser, prompt);

      toast({
        title: "Teaser generated",
        description: "Your teaser document is ready",
      });
    } catch (error: any) {
      toast({
        title: "Failed to generate teaser",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsGeneratingTeaser(false);
    }
  };

  const getDefaultTeaserPrompt = () => {
    return `Create a professional investment teaser document based on this analysis:\n\n${session.summary}\n\nInclude sections for: Executive Summary, Investment Highlights, Financial Overview, Market Position, and Contact Information.`;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Document Selection - Always Visible */}
      <Card className="m-4 mb-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Document Selection</CardTitle>
          <CardDescription className="text-xs">
            {session 
              ? "Select documents to include in this analysis" 
              : "Create or select a session to begin analysis"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No documents available</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {documents.map((doc) => (
                  <Card
                    key={doc.id}
                    className={`p-3 cursor-pointer transition-all border-2 ${
                      !session 
                        ? "border-border opacity-50 cursor-not-allowed" 
                        : selectedDocuments.includes(doc.id)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 hover:bg-accent/30"
                    }`}
                    onClick={() => session && toggleDocument(doc.id)}
                  >
                    <div className="flex items-start gap-2">
                      <Checkbox
                        checked={selectedDocuments.includes(doc.id)}
                        onCheckedChange={() => session && toggleDocument(doc.id)}
                        className="mt-0.5"
                        disabled={!session}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{doc.name}</p>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {doc.type}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3 font-medium">
                {selectedDocuments.length} document{selectedDocuments.length !== 1 ? "s" : ""} selected
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {!session ? (
        <div className="flex-1 flex items-center justify-center text-muted-foreground mx-4 mb-4">
          <div className="text-center">
            <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No analysis session selected</p>
            <p className="text-sm mt-2">Create or select a session to begin generating outputs</p>
          </div>
        </div>
      ) : (
        <Tabs defaultValue="summary" className="flex-1 flex flex-col mx-4 mb-4">
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="teaser">Teaser</TabsTrigger>
          <TabsTrigger value="cim">CIM</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="flex-1 mt-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Generate Analysis Summary</CardTitle>
              <CardDescription className="text-xs">
                AI-powered analysis of selected documents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={generateSummary}
                disabled={isGeneratingSummary || selectedDocuments.length === 0}
                className="w-full"
              >
                {isGeneratingSummary ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Summary
                  </>
                )}
              </Button>

              {session.summary && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Generated Summary</h4>
                  <div className="p-3 rounded-md bg-muted text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
                    {session.summary}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teaser" className="flex-1 mt-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Generate Teaser Document</CardTitle>
              <CardDescription className="text-xs">
                Create an investor teaser based on the analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {session.summary && (
                <div className="p-3 rounded-md bg-blue-500/10 border border-blue-500/20">
                  <p className="text-xs font-medium text-blue-500 mb-1">Using Summary</p>
                  <p className="text-xs text-muted-foreground line-clamp-3">
                    {session.summary}
                  </p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Custom Prompt (Optional)
                </label>
                <Textarea
                  placeholder="Enter custom instructions for the teaser generation..."
                  value={teaserPrompt}
                  onChange={(e) => setTeaserPrompt(e.target.value)}
                  className="min-h-24 text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Leave empty to use default prompt
                </p>
              </div>

              <Button
                onClick={generateTeaser}
                disabled={isGeneratingTeaser || !session.summary}
                className="w-full"
              >
                {isGeneratingTeaser ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Teaser
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cim" className="flex-1 mt-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Generate CIM</CardTitle>
              <CardDescription className="text-xs">
                Create a comprehensive Confidential Information Memorandum
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {session.summary && (
                <div className="p-3 rounded-md bg-blue-500/10 border border-blue-500/20">
                  <p className="text-xs font-medium text-blue-500 mb-1">Using Summary</p>
                  <p className="text-xs text-muted-foreground line-clamp-3">
                    {session.summary}
                  </p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Custom Prompt (Optional)
                </label>
                <Textarea
                  placeholder="Enter custom instructions for the CIM generation..."
                  className="min-h-24 text-sm"
                  disabled
                />
                <p className="text-xs text-muted-foreground mt-1">
                  CIM generation coming soon
                </p>
              </div>

              <Button
                disabled
                className="w-full"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Generate CIM (Coming Soon)
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
