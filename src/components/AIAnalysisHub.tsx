import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FileText, Sparkles, Download, RefreshCw, Loader2, Eye } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
}

const mockDocuments: Document[] = [
  { id: "1", name: "Financial Statements 2024.pdf", type: "Financial", size: "2.4 MB" },
  { id: "2", name: "Company Overview.docx", type: "Company Info", size: "1.2 MB" },
  { id: "3", name: "Product Catalog.pdf", type: "Marketing", size: "5.8 MB" },
  { id: "4", name: "Customer List.xlsx", type: "Data", size: "890 KB" },
  { id: "5", name: "Legal Documents.pdf", type: "Legal", size: "3.1 MB" },
];

type WorkflowStep = "choose" | "documents" | "summary" | "teaser" | "cim";

export function AIAnalysisHub() {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>("choose");
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [summary, setSummary] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [generatedTeaser, setGeneratedTeaser] = useState("");
  const [isGeneratingTeaser, setIsGeneratingTeaser] = useState(false);
  const { toast } = useToast();

  const toggleDocument = (docId: string) => {
    setSelectedDocs(prev =>
      prev.includes(docId) ? prev.filter(id => id !== docId) : [...prev, docId]
    );
  };

  const generateSummary = async () => {
    if (selectedDocs.length === 0) {
      toast({
        title: "No documents selected",
        description: "Please select at least one document to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const selectedDocuments = mockDocuments.filter(doc => 
        selectedDocs.includes(doc.id)
      );
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-documents`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ documents: selectedDocuments }),
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          toast({
            title: "Rate limit exceeded",
            description: "AI service is busy. Please wait a moment and try again.",
            variant: "destructive",
          });
          return;
        }
        if (response.status === 402) {
          toast({
            title: "AI credits exhausted",
            description: "Please add credits to continue using AI analysis.",
            variant: "destructive",
          });
          return;
        }
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setSummary(data.summary);
      
      toast({
        title: "Summary generated",
        description: "Review the AI-generated analysis below.",
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis failed",
        description: "Please try again or contact support if the issue persists.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getDefaultTeaserPrompt = () => {
    return `Create a professional teaser document for this company based on the following information:

${summary || "[Analysis summary will be included here]"}

The teaser should:
- Be concise (1-2 pages)
- Highlight key investment opportunities
- Include executive summary, business overview, and financial highlights
- Use professional formatting with clear sections
- Maintain confidentiality (use "The Company" instead of specific names)
- Focus on growth potential and competitive advantages

Target audience: Private equity investors and strategic buyers`;
  };

  const generateTeaser = async () => {
    const promptToUse = customPrompt || getDefaultTeaserPrompt();
    setIsGeneratingTeaser(true);
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-teaser`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ summary, prompt: promptToUse }),
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          toast({
            title: "Rate limit exceeded",
            description: "AI service is busy. Please wait a moment and try again.",
            variant: "destructive",
          });
          return;
        }
        if (response.status === 402) {
          toast({
            title: "AI credits exhausted",
            description: "Please add credits to continue using AI analysis.",
            variant: "destructive",
          });
          return;
        }
        throw new Error('Teaser generation failed');
      }

      const data = await response.json();
      setGeneratedTeaser(data.teaser);
      
      toast({
        title: "Teaser generated",
        description: "Your document is ready to preview.",
      });
    } catch (error) {
      console.error('Teaser generation error:', error);
      toast({
        title: "Generation failed",
        description: "Please try again or contact support if the issue persists.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingTeaser(false);
    }
  };

  const downloadMarkdown = () => {
    const blob = new Blob([generatedTeaser], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'teaser-document.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: "Your teaser document is being downloaded.",
    });
  };

  const resetToStart = () => {
    setCurrentStep("choose");
    setSelectedDocs([]);
    setSummary("");
    setCustomPrompt("");
    setGeneratedTeaser("");
  };

  return (
    <div className="space-y-6">
      {/* Header with Reset */}
      {currentStep !== "choose" && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={resetToStart}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Start Over
          </Button>
        </div>
      )}

      {/* Step 1: Choose Action */}
      {currentStep === "choose" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              What would you like to create?
            </CardTitle>
            <CardDescription>
              Select an action to begin your workflow
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button
              variant="outline"
              className="h-auto p-6 flex flex-col items-start gap-2"
              onClick={() => setCurrentStep("summary")}
            >
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                <span className="font-semibold">Generate Analysis Summary</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Analyze selected documents and create an AI-powered summary
              </p>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-6 flex flex-col items-start gap-2"
              onClick={() => setCurrentStep("teaser")}
            >
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                <span className="font-semibold">Generate Teaser Document</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Create a professional teaser for investors
                {summary && " (using existing summary)"}
              </p>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-6 flex flex-col items-start gap-2"
              disabled
            >
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                <span className="font-semibold">Generate CIM</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Create a comprehensive Confidential Information Memorandum (Coming Soon)
              </p>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Generate Summary */}
      {currentStep === "summary" && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Select Documents to Analyze
              </CardTitle>
              <CardDescription>
                Choose documents for AI-powered analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {mockDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center space-x-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <Checkbox
                      id={doc.id}
                      checked={selectedDocs.includes(doc.id)}
                      onCheckedChange={() => toggleDocument(doc.id)}
                    />
                    <label
                      htmlFor={doc.id}
                      className="flex-1 flex items-center justify-between cursor-pointer"
                    >
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">{doc.size}</p>
                      </div>
                      <Badge variant="secondary">{doc.type}</Badge>
                    </label>
                  </div>
                ))}
              </div>

              <Button
                onClick={generateSummary}
                disabled={isAnalyzing || selectedDocs.length === 0}
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing Documents...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Summary ({selectedDocs.length} selected)
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {summary && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Analysis Summary
                </CardTitle>
                <CardDescription>
                  Review and edit the AI-generated summary
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="min-h-[400px] font-mono text-sm"
                  placeholder="Summary will appear here..."
                />
                <div className="flex gap-2">
                  <Button onClick={() => setCurrentStep("choose")} variant="outline">
                    Back to Menu
                  </Button>
                  <Button onClick={() => setCurrentStep("teaser")} className="flex-1">
                    Use in Teaser Generation
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Step 3: Generate Teaser */}
      {currentStep === "teaser" && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Generate Teaser Document
              </CardTitle>
              <CardDescription>
                Customize your teaser generation prompt
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {summary && (
                <div className="p-3 rounded-lg bg-muted/50 border">
                  <p className="text-sm font-medium mb-1">Using existing summary</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{summary}</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Custom Prompt (Optional)</label>
                <Textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                  placeholder={getDefaultTeaserPrompt()}
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty to use the default prompt. The summary will be automatically included.
                </p>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => setCurrentStep(summary ? "summary" : "choose")} 
                  variant="outline"
                >
                  Back
                </Button>
                <Button 
                  className="flex-1"
                  onClick={generateTeaser}
                  disabled={isGeneratingTeaser}
                >
                  {isGeneratingTeaser ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating Teaser...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Teaser
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {generatedTeaser && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Generated Teaser Document
                </CardTitle>
                <CardDescription>
                  Preview and download your AI-generated teaser
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose prose-sm max-w-none p-4 rounded-lg border bg-muted/50">
                  <pre className="whitespace-pre-wrap font-sans">{generatedTeaser}</pre>
                </div>
                <div className="flex gap-2">
                  <Button onClick={downloadMarkdown} variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download as Markdown
                  </Button>
                  <Button onClick={generateTeaser} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Regenerate
                  </Button>
                  <Button onClick={() => setCurrentStep("choose")} variant="outline">
                    Back to Menu
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
