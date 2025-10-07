import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Building2, DollarSign, Combine } from "lucide-react";
import { Document as DocType } from "@/hooks/useDocumentManagement";

export interface AnalysisConfig {
  type: "general" | "financial" | "combined";
  generalFocus: string[];
  financialFocus: string[];
  customInstructions: string;
  depth: "standard" | "deep";
}

interface Phase1AnalysisTypeProps {
  documents: DocType[];
  onBack: () => void;
  onStartAnalysis: (config: AnalysisConfig) => void;
}

const generalFocusOptions = [
  "Company Overview",
  "Products & Services",
  "Market Position & Competition",
  "Team & Leadership",
  "Operations & Infrastructure"
];

const financialFocusOptions = [
  "Revenue Analysis",
  "Profitability Metrics",
  "Cash Flow Analysis",
  "Key Financial Ratios",
  "Risk Flags & Red Flags"
];

export function Phase1AnalysisType({ documents, onBack, onStartAnalysis }: Phase1AnalysisTypeProps) {
  const [analysisType, setAnalysisType] = useState<"general" | "financial" | "combined">("general");
  const [generalFocus, setGeneralFocus] = useState<string[]>([]);
  const [financialFocus, setFinancialFocus] = useState<string[]>([]);
  const [customInstructions, setCustomInstructions] = useState("");
  const [depth, setDepth] = useState<"standard" | "deep">("standard");

  const toggleGeneralFocus = (option: string) => {
    setGeneralFocus(prev =>
      prev.includes(option)
        ? prev.filter(o => o !== option)
        : [...prev, option]
    );
  };

  const toggleFinancialFocus = (option: string) => {
    setFinancialFocus(prev =>
      prev.includes(option)
        ? prev.filter(o => o !== option)
        : [...prev, option]
    );
  };

  const selectAllGeneral = () => {
    setGeneralFocus(generalFocusOptions);
  };

  const selectAllFinancial = () => {
    setFinancialFocus(financialFocusOptions);
  };

  const handleStartAnalysis = () => {
    onStartAnalysis({
      type: analysisType,
      generalFocus: generalFocus.length === 0 ? generalFocusOptions : generalFocus,
      financialFocus: financialFocus.length === 0 ? financialFocusOptions : financialFocus,
      customInstructions,
      depth
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Analysis Type Selection</h2>
          <p className="text-muted-foreground">
            {documents.length} document{documents.length !== 1 ? 's' : ''} ready for analysis
          </p>
        </div>
      </div>

      <RadioGroup value={analysisType} onValueChange={(val) => setAnalysisType(val as any)}>
        <div className="grid gap-4 md:grid-cols-3">
          <Card className={analysisType === "general" ? "ring-2 ring-primary" : ""}>
            <CardHeader>
              <RadioGroupItem value="general" id="general" className="sr-only" />
              <Label htmlFor="general" className="cursor-pointer">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  <CardTitle>General Analysis</CardTitle>
                </div>
                <CardDescription>
                  Comprehensive summary covering company overview, products, services, team, and operations
                </CardDescription>
              </Label>
            </CardHeader>
            {analysisType === "general" && (
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Focus Areas</Label>
                  <Button variant="link" size="sm" onClick={selectAllGeneral}>
                    Select All
                  </Button>
                </div>
                {generalFocusOptions.map((option) => (
                  <div key={option} className="flex items-center gap-2">
                    <Checkbox
                      id={option}
                      checked={generalFocus.includes(option)}
                      onCheckedChange={() => toggleGeneralFocus(option)}
                    />
                    <Label htmlFor={option} className="text-sm cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </CardContent>
            )}
          </Card>

          <Card className={analysisType === "financial" ? "ring-2 ring-primary" : ""}>
            <CardHeader>
              <RadioGroupItem value="financial" id="financial" className="sr-only" />
              <Label htmlFor="financial" className="cursor-pointer">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <CardTitle>Financial DD</CardTitle>
                </div>
                <CardDescription>
                  Detailed financial analysis focusing on revenue, profitability, cash flow, and risk assessment
                </CardDescription>
              </Label>
            </CardHeader>
            {analysisType === "financial" && (
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Focus Areas</Label>
                  <Button variant="link" size="sm" onClick={selectAllFinancial}>
                    Select All
                  </Button>
                </div>
                {financialFocusOptions.map((option) => (
                  <div key={option} className="flex items-center gap-2">
                    <Checkbox
                      id={option}
                      checked={financialFocus.includes(option)}
                      onCheckedChange={() => toggleFinancialFocus(option)}
                    />
                    <Label htmlFor={option} className="text-sm cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </CardContent>
            )}
          </Card>

          <Card className={analysisType === "combined" ? "ring-2 ring-primary" : ""}>
            <CardHeader>
              <RadioGroupItem value="combined" id="combined" className="sr-only" />
              <Label htmlFor="combined" className="cursor-pointer">
                <div className="flex items-center gap-2 mb-2">
                  <Combine className="h-5 w-5 text-primary" />
                  <CardTitle>Combined</CardTitle>
                </div>
                <CardDescription>
                  Both General + Financial DD with all sub-focus options available
                </CardDescription>
              </Label>
            </CardHeader>
            {analysisType === "combined" && (
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label className="text-sm font-medium">General Focus</Label>
                    <Button variant="link" size="sm" onClick={selectAllGeneral}>
                      All
                    </Button>
                  </div>
                  {generalFocusOptions.map((option) => (
                    <div key={option} className="flex items-center gap-2 mb-1">
                      <Checkbox
                        id={`combined-${option}`}
                        checked={generalFocus.includes(option)}
                        onCheckedChange={() => toggleGeneralFocus(option)}
                      />
                      <Label htmlFor={`combined-${option}`} className="text-xs cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label className="text-sm font-medium">Financial Focus</Label>
                    <Button variant="link" size="sm" onClick={selectAllFinancial}>
                      All
                    </Button>
                  </div>
                  {financialFocusOptions.map((option) => (
                    <div key={option} className="flex items-center gap-2 mb-1">
                      <Checkbox
                        id={`combined-fin-${option}`}
                        checked={financialFocus.includes(option)}
                        onCheckedChange={() => toggleFinancialFocus(option)}
                      />
                      <Label htmlFor={`combined-fin-${option}`} className="text-xs cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </RadioGroup>

      <Card>
        <CardHeader>
          <CardTitle>Additional Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="custom-instructions">
              Custom Instructions <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="custom-instructions"
              placeholder="Any specific aspects you want the AI to focus on or questions to answer..."
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="depth">Analysis Depth</Label>
            <Select value={depth} onValueChange={(val) => setDepth(val as any)}>
              <SelectTrigger id="depth">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="deep">Deep Dive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button size="lg" onClick={handleStartAnalysis}>
          Start Analysis
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
