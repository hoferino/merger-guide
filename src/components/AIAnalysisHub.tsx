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
    
    // Simulate AI analysis
    setTimeout(() => {
      const selectedDocNames = mockDocuments
        .filter(doc => selectedDocs.includes(doc.id))
        .map(doc => doc.name)
        .join(", ");
      
      setSummary(`Analysis Summary for: ${selectedDocNames}

KEY FINDINGS:
• Strong financial performance with 45% YoY revenue growth
• Diversified product portfolio across 3 main segments
• Customer base of 500+ enterprise clients with 95% retention rate
• Established market presence in North America and Europe
• Recent expansion into Asian markets showing promising traction

FINANCIALS:
• Revenue: $50M (2024), up from $34.5M (2023)
• EBITDA Margin: 28%
• Net Profit Margin: 18%
• Cash Flow: Positive and growing

MARKET POSITION:
• Top 3 player in target market
• Strong brand recognition and customer loyalty
• Competitive advantages in technology and customer service

OPPORTUNITIES:
• Expansion into new geographic markets
• Product line extension potential
• Strategic acquisition targets identified

RISKS:
• Increasing competition in core markets
• Dependence on key customer relationships
• Regulatory changes in target markets`);
      
      setAnalysisStep("summary");
      setIsAnalyzing(false);
      
      toast({
        title: "Summary generated",
        description: "Review the analysis summary below.",
      });
    }, 2000);
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
