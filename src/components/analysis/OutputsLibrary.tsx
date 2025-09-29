import { Download, Trash2, FileText, FileImage, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { GeneratedOutput, OutputType } from "@/hooks/useGeneratedOutputs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface OutputsLibraryProps {
  outputs: GeneratedOutput[];
  outputsByType: {
    summary: GeneratedOutput[];
    teaser: GeneratedOutput[];
    cim: GeneratedOutput[];
  };
  onDelete: (id: string) => void;
  onDownload: (output: GeneratedOutput) => void;
}

const typeIcons: Record<OutputType, React.ReactNode> = {
  summary: <FileText className="h-4 w-4" />,
  teaser: <FileImage className="h-4 w-4" />,
  cim: <FileSpreadsheet className="h-4 w-4" />,
};

const typeLabels: Record<OutputType, string> = {
  summary: "Summary",
  teaser: "Teaser",
  cim: "CIM",
};

const typeColors: Record<OutputType, string> = {
  summary: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  teaser: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  cim: "bg-green-500/10 text-green-500 border-green-500/20",
};

export function OutputsLibrary({
  outputs,
  outputsByType,
  onDelete,
  onDownload,
}: OutputsLibraryProps) {
  const renderOutput = (output: GeneratedOutput) => (
    <div
      key={output.id}
      className="p-3 rounded-md border border-border bg-card hover:bg-accent/50 transition-colors"
    >
      <div className="flex items-start gap-2 mb-2">
        <div className="mt-0.5">{typeIcons[output.type]}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className={typeColors[output.type]}>
              {typeLabels[output.type]}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {new Date(output.created_at).toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {output.content.substring(0, 100)}...
          </p>
        </div>
      </div>
      <div className="flex gap-1 justify-end">
        <Button
          size="sm"
          variant="ghost"
          className="h-7"
          onClick={() => onDownload(output)}
        >
          <Download className="h-3 w-3 mr-1" />
          Download
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 text-destructive"
          onClick={() => onDelete(output.id)}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col border-l border-border bg-muted/30">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-sm">Outputs Library</h3>
        <p className="text-xs text-muted-foreground mt-1">
          {outputs.length} {outputs.length === 1 ? "output" : "outputs"} generated
        </p>
      </div>

      <Tabs defaultValue="all" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-2">
          <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
          <TabsTrigger value="summary" className="text-xs">Summary</TabsTrigger>
          <TabsTrigger value="teaser" className="text-xs">Teaser</TabsTrigger>
          <TabsTrigger value="cim" className="text-xs">CIM</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="all" className="p-4 space-y-2 mt-0">
            {outputs.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                No outputs generated yet
              </div>
            ) : (
              outputs.map(renderOutput)
            )}
          </TabsContent>

          <TabsContent value="summary" className="p-4 space-y-2 mt-0">
            {outputsByType.summary.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                No summaries generated yet
              </div>
            ) : (
              outputsByType.summary.map(renderOutput)
            )}
          </TabsContent>

          <TabsContent value="teaser" className="p-4 space-y-2 mt-0">
            {outputsByType.teaser.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                No teasers generated yet
              </div>
            ) : (
              outputsByType.teaser.map(renderOutput)
            )}
          </TabsContent>

          <TabsContent value="cim" className="p-4 space-y-2 mt-0">
            {outputsByType.cim.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                No CIMs generated yet
              </div>
            ) : (
              outputsByType.cim.map(renderOutput)
            )}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
