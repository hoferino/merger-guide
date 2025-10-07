import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Copy, ChevronRight, Save, Play, FileText, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Document as DocType } from "@/hooks/useDocumentManagement";
import { AnalysisConfig } from "./Phase1AnalysisType";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface ResultSection {
  title: string;
  findings: string[];
  evidence: string[];
}

interface AnalysisResults {
  general?: ResultSection[];
  financial?: ResultSection[];
}

interface Phase2Props {
  documents: DocType[];
  config: AnalysisConfig;
  onGeneratePrompt: () => void;
  onRunNewAnalysis: () => void;
  onSaveAnalysis: () => void;
}

export function Phase2ResultsReview({
  documents,
  config,
  onGeneratePrompt,
  onRunNewAnalysis,
  onSaveAnalysis
}: Phase2Props) {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<"aggregated" | "individual">("aggregated");

  // Mock results - in real implementation, these would come from API
  const mockGeneralResults: ResultSection[] = [
    {
      title: "Company Overview",
      findings: [
        "B2B SaaS platform serving mid-market enterprises",
        "Founded in 2019, headquartered in Munich",
        "Operates across DACH region with 120+ employees",
        "Subscription-based business model with tiered pricing"
      ],
      evidence: [
        "Company_Overview_Presentation.pptx (Slide 3-5)",
        "Articles of Incorporation (Page 1)"
      ]
    },
    {
      title: "Products & Services",
      findings: [
        "Core product: Enterprise resource planning platform",
        "Additional modules: CRM, inventory management, analytics",
        "Integration capabilities with 50+ third-party tools",
        "White-label options for enterprise clients"
      ],
      evidence: [
        "Product_Catalog_2024.pdf (Pages 2-8)",
        "Customer contracts (Multiple)"
      ]
    },
    {
      title: "Market Position & Competition",
      findings: [
        "Ranked #3 in DACH market for mid-market ERP solutions",
        "Market share estimated at 12% in target segment",
        "Key competitors: SAP Business One, Microsoft Dynamics",
        "Differentiation through vertical-specific customization"
      ],
      evidence: [
        "Market_Analysis_Report.pdf (Pages 15-22)"
      ]
    }
  ];

  const mockFinancialResults: ResultSection[] = [
    {
      title: "Revenue Analysis",
      findings: [
        "Revenue grew 23% YoY from €12.5M (2022) to €15.4M (2023)",
        "Primary growth driver: Expansion into DACH markets (+€2.1M)",
        "Revenue concentration: Top 5 clients represent 67% of total revenue",
        "Recurring revenue: 45% of total, growing at 31% annually"
      ],
      evidence: [
        "Financial_Statements_2023.pdf (Page 7)",
        "Company_Overview_Presentation.pptx (Slide 12)"
      ]
    },
    {
      title: "Profitability Metrics",
      findings: [
        "Gross margin improved from 68% to 72% YoY",
        "EBITDA margin: 18% in 2023, up from 14% in 2022",
        "Net profit: €2.1M in 2023, representing 14% net margin",
        "SG&A expenses at 28% of revenue, declining trend"
      ],
      evidence: [
        "Financial_Statements_2023.pdf (Pages 8-10)"
      ]
    },
    {
      title: "Cash Flow Analysis",
      findings: [
        "Operating cash flow: €3.2M in 2023",
        "Free cash flow: €2.4M after CapEx",
        "Cash conversion rate: 112% of EBITDA",
        "Current cash position: €5.8M with no debt"
      ],
      evidence: [
        "Financial_Statements_2023.pdf (Page 11)",
        "Banking documentation"
      ]
    }
  ];

  const copySection = (section: ResultSection) => {
    const text = `${section.title}\n\n${section.findings.map(f => `• ${f}`).join('\n')}\n\nSupporting Evidence:\n${section.evidence.map(e => `→ ${e}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `${section.title} section copied successfully`,
    });
  };

  const results: AnalysisResults = {};
  if (config.type === "general" || config.type === "combined") {
    results.general = mockGeneralResults;
  }
  if (config.type === "financial" || config.type === "combined") {
    results.financial = mockFinancialResults;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analysis Results</h2>
          <p className="text-muted-foreground">
            Analysis complete for {documents.length} document{documents.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Badge variant="outline" className="gap-2">
          <CheckCircle2 className="h-3 w-3 text-green-600" />
          Complete
        </Badge>
      </div>

      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
        <TabsList>
          <TabsTrigger value="aggregated">Aggregated View</TabsTrigger>
          <TabsTrigger value="individual">Individual Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="aggregated" className="space-y-6 mt-6">
          {results.general && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">General Analysis</h3>
              <div className="grid gap-4">
                {results.general.map((section, idx) => (
                  <Collapsible key={idx} defaultOpen>
                    <Card>
                      <CollapsibleTrigger className="w-full">
                        <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{section.title}</CardTitle>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                copySection(section);
                              }}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Key Findings</h4>
                            <ul className="space-y-1.5">
                              {section.findings.map((finding, fidx) => (
                                <li key={fidx} className="text-sm flex gap-2">
                                  <span className="text-primary">•</span>
                                  <span>{finding}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-2">Supporting Evidence</h4>
                            <div className="space-y-1">
                              {section.evidence.map((evidence, eidx) => (
                                <div key={eidx} className="text-sm text-muted-foreground flex gap-2">
                                  <span>→</span>
                                  <span className="hover:text-primary cursor-pointer underline underline-offset-2">
                                    {evidence}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                ))}
              </div>
            </div>
          )}

          {results.financial && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Financial Due Diligence</h3>
              <div className="grid gap-4">
                {results.financial.map((section, idx) => (
                  <Collapsible key={idx} defaultOpen>
                    <Card>
                      <CollapsibleTrigger className="w-full">
                        <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{section.title}</CardTitle>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                copySection(section);
                              }}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Key Findings</h4>
                            <ul className="space-y-1.5">
                              {section.findings.map((finding, fidx) => (
                                <li key={fidx} className="text-sm flex gap-2">
                                  <span className="text-primary">•</span>
                                  <span>{finding}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-2">Supporting Evidence</h4>
                            <div className="space-y-1">
                              {section.evidence.map((evidence, eidx) => (
                                <div key={eidx} className="text-sm text-muted-foreground flex gap-2">
                                  <span>→</span>
                                  <span className="hover:text-primary cursor-pointer underline underline-offset-2">
                                    {evidence}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="individual" className="space-y-4 mt-6">
          <Tabs defaultValue={documents[0]?.id}>
            <TabsList>
              {documents.slice(0, 3).map((doc) => (
                <TabsTrigger key={doc.id} value={doc.id}>
                  <FileText className="h-3 w-3 mr-2" />
                  {doc.name.slice(0, 20)}...
                </TabsTrigger>
              ))}
            </TabsList>

            {documents.slice(0, 3).map((doc) => (
              <TabsContent key={doc.id} value={doc.id}>
                <Card>
                  <CardHeader>
                    <CardTitle>{doc.name}</CardTitle>
                    <CardDescription>Individual document analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Individual document analysis results would appear here...
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </TabsContent>
      </Tabs>

      <Card className="sticky bottom-4 shadow-lg">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex gap-2">
            <Button variant="outline" onClick={onRunNewAnalysis}>
              <Play className="mr-2 h-4 w-4" />
              Run New Analysis
            </Button>
            <Button variant="outline" onClick={onSaveAnalysis}>
              <Save className="mr-2 h-4 w-4" />
              Save Analysis State
            </Button>
          </div>
          <Button size="lg" onClick={onGeneratePrompt}>
            Generate Prompt
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
