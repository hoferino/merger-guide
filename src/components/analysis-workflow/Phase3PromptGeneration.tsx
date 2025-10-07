import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bot, FileText, Copy, RotateCcw, Save, ChevronLeft, CheckCircle2, Edit2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Phase3Props {
  onBack: () => void;
  onComplete: () => void;
}

export function Phase3PromptGeneration({ onBack, onComplete }: Phase3Props) {
  const { toast } = useToast();
  const [step, setStep] = useState<"method" | "configure" | "review">("method");
  const [method, setMethod] = useState<"ai" | "template">("ai");
  const [promptType, setPromptType] = useState("teaser");
  const [tone, setTone] = useState("professional");
  const [targetAudience, setTargetAudience] = useState("");
  const [customInstructions, setCustomInstructions] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");

  const templates = [
    {
      id: "tech-teaser",
      name: "Investment Teaser - Technology Company",
      description: "Structured teaser for SaaS and tech businesses"
    },
    {
      id: "manu-im",
      name: "Information Memorandum - Manufacturing",
      description: "Comprehensive IM for manufacturing companies"
    },
    {
      id: "service-exec",
      name: "Executive Summary - Services Business",
      description: "Concise summary for service-based businesses"
    }
  ];

  const mockGeneratedPrompt = `INVESTMENT TEASER: Market-Leading B2B SaaS Platform

Overview:
The Company is a rapidly growing B2B software company specializing in enterprise resource planning (ERP) solutions, serving mid-market enterprises across the DACH region. The company has demonstrated strong revenue growth of 23% YoY, reaching €15.4M in 2023, driven by successful market expansion and high customer retention.

Investment Highlights:
• Proven growth trajectory with 23% revenue CAGR (2022-2023)
• Strong recurring revenue base (45% of total, growing 31% annually)
• Established market position in DACH region (#3 ranking, 12% market share)
• Scalable technology platform with integration capabilities (50+ third-party tools)
• Attractive unit economics with improving profitability (72% gross margin, 18% EBITDA margin)
• Blue-chip client base with vertical-specific customization

Financial Highlights:
• Revenue: €15.4M (2023), up 23% YoY
• EBITDA: €2.8M (18% margin)
• Free Cash Flow: €2.4M
• Cash Position: €5.8M (no debt)

Market Opportunity:
The DACH ERP market for mid-market enterprises is estimated at €2.1B and growing at 8% annually. The company is well-positioned to capture market share through its differentiated vertical-specific approach and superior customer service.

Transaction Rationale:
This represents an attractive opportunity to acquire a high-growth, profitable SaaS business with strong market positioning, recurring revenue model, and significant expansion potential.`;

  const handleMethodSelection = (selectedMethod: "ai" | "template") => {
    setMethod(selectedMethod);
    setStep("configure");
  };

  const handleGenerate = () => {
    setGeneratedPrompt(mockGeneratedPrompt);
    setStep("review");
    toast({
      title: "Prompt generated",
      description: "Your prompt has been successfully generated",
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    toast({
      title: "Copied to clipboard",
      description: "Prompt copied successfully",
    });
  };

  const handleSave = () => {
    toast({
      title: "Prompt saved",
      description: "Your prompt has been saved to the library",
    });
    onComplete();
  };

  if (step === "method") {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Prompt Generation Method</h2>
            <p className="text-muted-foreground">
              Choose how you want to generate your investment prompt
            </p>
          </div>
        </div>

        <RadioGroup value={method} onValueChange={(val) => handleMethodSelection(val as any)}>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className={method === "ai" ? "ring-2 ring-primary cursor-pointer" : "cursor-pointer"}>
              <CardHeader>
                <RadioGroupItem value="ai" id="ai" className="sr-only" />
                <Label htmlFor="ai" className="cursor-pointer">
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="h-6 w-6 text-primary" />
                    <CardTitle>AI-Generated Prompt</CardTitle>
                  </div>
                  <CardDescription>
                    AI creates a custom prompt based on selected insights from your analysis
                  </CardDescription>
                </Label>
              </CardHeader>
            </Card>

            <Card className={method === "template" ? "ring-2 ring-primary cursor-pointer" : "cursor-pointer"}>
              <CardHeader>
                <RadioGroupItem value="template" id="template" className="sr-only" />
                <Label htmlFor="template" className="cursor-pointer">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-6 w-6 text-primary" />
                    <CardTitle>Template-Based Prompt</CardTitle>
                  </div>
                  <CardDescription>
                    Choose a pre-defined template structure that AI populates with your analysis findings
                  </CardDescription>
                </Label>
              </CardHeader>
            </Card>
          </div>
        </RadioGroup>
      </div>
    );
  }

  if (step === "configure") {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setStep("method")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">
              {method === "ai" ? "Configure AI Prompt" : "Select Template"}
            </h2>
            <p className="text-muted-foreground">
              {method === "ai" ? "Set parameters for prompt generation" : "Choose a template to populate"}
            </p>
          </div>
        </div>

        {method === "template" && (
          <div className="grid gap-4">
            {templates.map((template) => (
              <Card
                key={template.id}
                className={selectedTemplate === template.id ? "ring-2 ring-primary cursor-pointer" : "cursor-pointer"}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <CardHeader>
                  <CardTitle className="text-base">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Prompt Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prompt-type">Prompt Type</Label>
              <Select value={promptType} onValueChange={setPromptType}>
                <SelectTrigger id="prompt-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="teaser">Investment Teaser</SelectItem>
                  <SelectItem value="memorandum">Information Memorandum</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger id="tone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="compelling">Compelling</SelectItem>
                  <SelectItem value="conservative">Conservative</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="audience">Target Audience</Label>
              <Input
                id="audience"
                placeholder="e.g., Strategic buyers in manufacturing sector"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom-prompt-instructions">
                Custom Instructions <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Textarea
                id="custom-prompt-instructions"
                placeholder="Additional guidance for AI prompt generation..."
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button size="lg" onClick={handleGenerate}>
            Generate Prompt
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setStep("configure")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Review & Edit Prompt</h2>
            <p className="text-muted-foreground">
              {method === "ai" ? "AI-generated" : "Template-based"} • {promptType}
            </p>
          </div>
        </div>
        <Badge variant="outline" className="gap-2">
          <CheckCircle2 className="h-3 w-3 text-green-600" />
          Generated
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Generated Prompt</CardTitle>
              <CardDescription>
                Based on: Analysis findings • Tone: {tone} • Type: {promptType}
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit2 className="h-4 w-4 mr-2" />
              {isEditing ? "Preview" : "Edit"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Textarea
              value={generatedPrompt}
              onChange={(e) => setGeneratedPrompt(e.target.value)}
              rows={20}
              className="font-mono text-sm"
            />
          ) : (
            <div className="whitespace-pre-wrap font-mono text-sm p-4 bg-muted rounded-lg">
              {generatedPrompt}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="sticky bottom-4 shadow-lg">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleGenerate}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Regenerate
            </Button>
            <Button variant="outline" onClick={handleCopy}>
              <Copy className="mr-2 h-4 w-4" />
              Copy to Clipboard
            </Button>
          </div>
          <Button size="lg" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Prompt
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
