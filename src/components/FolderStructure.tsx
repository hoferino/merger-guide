import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  FolderOpen, 
  FileText, 
  Upload, 
  Download, 
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle
} from "lucide-react";

interface Document {
  name: string;
  status: "uploaded" | "pending" | "overdue";
  type: string;
}

interface FolderItem {
  name: string;
  type: "folder" | "document";
  children?: FolderItem[];
  document?: Document;
}

interface FolderStructureProps {
  items: FolderItem[];
  level?: number;
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

export function FolderStructure({ items, level = 0 }: FolderStructureProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const toggleFolder = (folderName: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderName)) {
      newExpanded.delete(folderName);
    } else {
      newExpanded.add(folderName);
    }
    setExpandedFolders(newExpanded);
  };

  return (
    <div className="space-y-1">
      {items.map((item, index) => {
        const isExpanded = expandedFolders.has(item.name);
        const paddingLeft = level * 20;

        if (item.type === "folder") {
          return (
            <div key={index}>
              <div
                className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary/50 cursor-pointer transition-colors"
                style={{ paddingLeft: `${paddingLeft + 8}px` }}
                onClick={() => toggleFolder(item.name)}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
                {isExpanded ? (
                  <FolderOpen className="h-4 w-4 text-primary" />
                ) : (
                  <Folder className="h-4 w-4 text-primary" />
                )}
                <span className="font-medium text-card-foreground text-sm">
                  {item.name}
                </span>
                {item.children && (
                  <Badge variant="outline" className="ml-auto text-xs">
                    {item.children.length}
                  </Badge>
                )}
              </div>
              {isExpanded && item.children && (
                <FolderStructure items={item.children} level={level + 1} />
              )}
            </div>
          );
        } else {
          // Document item
          const doc = item.document!;
          return (
            <div
              key={index}
              className="flex items-center justify-between p-2 rounded-md hover:bg-secondary/30 transition-colors"
              style={{ paddingLeft: `${paddingLeft + 28}px` }}
            >
              <div className="flex items-center gap-2 flex-1">
                <StatusIcon status={doc.status} />
                <div className="flex-1">
                  <p className="font-medium text-card-foreground text-sm">
                    {doc.name}
                  </p>
                  <p className="text-xs text-muted-foreground uppercase">
                    {doc.type}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {doc.status === "uploaded" && (
                  <>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <Download className="h-3 w-3" />
                    </Button>
                  </>
                )}
                {doc.status === "pending" && (
                  <Button variant="outline" size="sm" className="h-7 text-xs px-2">
                    <Upload className="h-3 w-3 mr-1" />
                    Upload
                  </Button>
                )}
              </div>
            </div>
          );
        }
      })}
    </div>
  );
}