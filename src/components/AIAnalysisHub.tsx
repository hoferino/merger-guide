import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FileText, Sparkles, Download, RefreshCw, Loader2 } from "lucide-react";
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

export function AIAnalysisHub() {
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [summary, setSummary] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [analysisStep, setAnalysisStep] = useState<"select" | "summary" | "prompt" | "generate">("select");
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
      setAnalysisStep("summary");
      
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

  const generatePrompt = () => {
    setGeneratedPrompt(`Create a professional teaser document for this company based on the following information:

${summary}

The teaser should:
- Be concise (1-2 pages)
- Highlight key investment opportunities
- Include executive summary, business overview, and financial highlights
- Use professional formatting with clear sections
- Maintain confidentiality (use "The Company" instead of specific names)
- Focus on growth potential and competitive advantages

Target audience: Private equity investors and strategic buyers`);
    
    setAnalysisStep("prompt");
    
    toast({
      title: "Prompt generated",
      description: "You can now edit the prompt or generate the document.",
    });
  };

  const resetAnalysis = () => {
    setSelectedDocs([]);
    setSummary("");
    setGeneratedPrompt("");
    setAnalysisStep("select");
  };

  return (
    <div className="space-y-6">
      {/* Document Selection */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Document Analysis
              </CardTitle>
              <CardDescription>
                Select documents to analyze and generate AI-powered summaries
              </CardDescription>
            </div>
            {analysisStep !== "select" && (
              <Button variant="outline" size="sm" onClick={resetAnalysis}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Start Over
              </Button>
            )}
          </div>
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

          <div className="flex items-center gap-2">
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
          </div>
        </CardContent>
      </Card>

      {/* Analysis Summary */}
      {analysisStep !== "select" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Analysis Summary
            </CardTitle>
            <CardDescription>
              AI-generated summary of selected documents
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="min-h-[400px] font-mono text-sm"
              placeholder="Summary will appear here..."
            />
            {analysisStep === "summary" && (
              <Button onClick={generatePrompt} className="w-full">
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Prompt
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Generated Prompt */}
      {analysisStep === "prompt" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Document Generation Prompt
            </CardTitle>
            <CardDescription>
              Edit the prompt to customize the output document
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={generatedPrompt}
              onChange={(e) => setGeneratedPrompt(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
              placeholder="Prompt will appear here..."
            />
            <div className="flex gap-2">
              <Button className="flex-1">
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Teaser
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export as PowerPoint
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
