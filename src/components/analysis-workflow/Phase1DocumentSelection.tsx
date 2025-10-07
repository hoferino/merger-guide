import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { FileText, ChevronRight, Folder, X } from "lucide-react";
import { Document as DocType } from "@/hooks/useDocumentManagement";

interface Phase1Props {
  documents: DocType[];
  onProceed: (selectedDocs: DocType[]) => void;
}

export function Phase1DocumentSelection({ documents, onProceed }: Phase1Props) {
  const [selectedDocs, setSelectedDocs] = useState<DocType[]>([]);

  const toggleDocument = (doc: DocType) => {
    setSelectedDocs(prev =>
      prev.find(d => d.id === doc.id)
        ? prev.filter(d => d.id !== doc.id)
        : [...prev, doc]
    );
  };

  const removeDocument = (docId: string) => {
    setSelectedDocs(prev => prev.filter(d => d.id !== docId));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Document Selection</h2>
        <p className="text-muted-foreground">
          Select documents from the dataroom to analyze
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Folder className="h-5 w-5" />
                Document Library
              </CardTitle>
              <CardDescription>
                Browse and select documents for analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent/50 cursor-pointer transition-colors"
                  onClick={() => toggleDocument(doc)}
                >
                  <Checkbox
                    checked={selectedDocs.some(d => d.id === doc.id)}
                    onCheckedChange={() => toggleDocument(doc)}
                  />
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {doc.type?.toUpperCase()} • Uploaded recently
                    </p>
                  </div>
                  {doc.status === "uploaded" && (
                    <Badge variant="outline" className="text-xs">
                      Ready
                    </Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Selected Documents</CardTitle>
              <CardDescription>
                {selectedDocs.length} document{selectedDocs.length !== 1 ? 's' : ''} selected
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {selectedDocs.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No documents selected
                </p>
              ) : (
                <>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {selectedDocs.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center gap-2 p-2 rounded border bg-accent/20"
                      >
                        <FileText className="h-3 w-3 text-muted-foreground shrink-0" />
                        <span className="text-xs flex-1 truncate">{doc.name}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removeDocument(doc.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Button
                    className="w-full mt-4"
                    disabled={selectedDocs.length === 0}
                    onClick={() => onProceed(selectedDocs)}
                  >
                    Continue to Analysis Type
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
