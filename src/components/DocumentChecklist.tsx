import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { 
  CheckSquare, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  FileText,
  ChevronDown,
  ChevronRight
} from "lucide-react";

interface DocumentItem {
  name: string;
  status: "uploaded" | "pending" | "overdue";
  type: string;
  category: string;
}

interface DocumentChecklistProps {
  documents: DocumentItem[];
  totalRequired: number;
  totalUploaded: number;
  completionPercentage: number;
}

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case "uploaded":
      return <CheckCircle className="h-4 w-4 text-success" />;
    case "pending":
      return <Clock className="h-4 w-4 text-warning" />;
    case "overdue":
      return <AlertTriangle className="h-4 w-4 text-danger" />;
    default:
      return <FileText className="h-4 w-4 text-muted-foreground" />;
  }
};

const CategoryBadge = ({ category }: { category: string }) => {
  const variants = {
    "Financial Documents": "bg-primary/10 text-primary border-primary/20",
    "Legal Documents": "bg-success/10 text-success border-success/20",
    "Operational Documents": "bg-warning/10 text-warning border-warning/20"
  };
  
  return (
    <Badge variant="outline" className={variants[category as keyof typeof variants] || "bg-muted text-muted-foreground border-border"}>
      {category.replace(' Documents', '')}
    </Badge>
  );
};

export function DocumentChecklist({ 
  documents, 
  totalRequired, 
  totalUploaded, 
  completionPercentage 
}: DocumentChecklistProps) {
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

  const toggleSection = (category: string) => {
    setCollapsedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const groupedDocuments = documents.reduce((acc, doc) => {
    if (!acc[doc.category]) {
      acc[doc.category] = [];
    }
    acc[doc.category].push(doc);
    return acc;
  }, {} as Record<string, DocumentItem[]>);

  return (
    <Card className="bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-2 border-border/50 shadow-lg h-[800px] flex flex-col sticky top-6 animate-fade-in">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-t-lg border-b border-border/50 pb-4 shrink-0">
        <CardTitle className="flex items-center gap-2 text-primary">
          <CheckSquare className="h-5 w-5" />
          Document Checklist
        </CardTitle>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-card-foreground">
                {totalUploaded} / {totalRequired}
              </p>
              <p className="text-sm text-muted-foreground">Documents Complete</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-card-foreground">{completionPercentage}%</p>
              <p className="text-sm text-muted-foreground">Progress</p>
            </div>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4 overflow-y-auto flex-1 min-h-0 py-4">
        {Object.entries(groupedDocuments).map(([category, docs]) => {
          const isCollapsed = collapsedSections.has(category);
          const completedDocs = docs.filter(doc => doc.status === "uploaded").length;
          
          return (
            <div key={category} className="space-y-2">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost" 
                  size="sm"
                  onClick={() => toggleSection(category)}
                  className="flex items-center gap-2 p-2 h-auto hover:bg-secondary/50"
                >
                  {isCollapsed ? (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                  <h4 className="font-medium text-card-foreground text-sm">{category}</h4>
                  <CategoryBadge category={category} />
                  <Badge variant="outline" className="text-xs ml-auto">
                    {completedDocs}/{docs.length}
                  </Badge>
                </Button>
              </div>
              
              {!isCollapsed && (
                <div className="space-y-2 ml-6">
                  {docs.map((doc, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                      <Checkbox 
                        checked={doc.status === "uploaded"}
                        disabled
                        className="data-[state=checked]:bg-success data-[state=checked]:border-success"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <StatusIcon status={doc.status} />
                          <p className={`font-medium text-sm ${
                            doc.status === "uploaded" 
                              ? "text-card-foreground line-through" 
                              : "text-card-foreground"
                          }`}>
                            {doc.name}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground uppercase mt-1">
                          {doc.type}
                        </p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={
                          doc.status === "uploaded" 
                            ? "bg-success/10 text-success border-success/20 text-xs" 
                            : doc.status === "pending"
                            ? "bg-warning/10 text-warning border-warning/20 text-xs"
                            : "bg-danger/10 text-danger border-danger/20 text-xs"
                        }
                      >
                        {doc.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}