import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FolderStructure } from "./FolderStructure";
import { 
  FileText, 
  Folder, 
  MoreVertical, 
  Plus, 
  Edit, 
  Trash2,
  FolderPlus,
  FilePlus
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Document {
  id: string;
  name: string;
  status: "uploaded" | "pending" | "overdue";
  type: string;
}

interface FolderItem {
  id: string;
  name: string;
  type: "folder" | "document";
  children?: FolderItem[];
  document?: Document;
}

interface DocumentBoxProps {
  id: string;
  title: string;
  required: number;
  uploaded: number;
  status: "completed" | "in-progress" | "pending";
  folderStructure: FolderItem[];
  icon?: React.ReactNode;
  selectedDocuments: Set<string>;
  onRename: () => void;
  onDelete: () => void;
  onCreateFolder: () => void;
  onCreateDocument: () => void;
  onToggleDocumentSelection: (documentId: string) => void;
  onItemRename: (itemId: string) => void;
  onItemDelete: (itemId: string) => void;
  onItemCreateFolder: (parentId: string | null) => void;
  onItemCreateDocument: (parentId: string | null) => void;
  onDragStart: (item: FolderItem) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

const StatusBadge = ({ status }: { status: string }) => {
  const variants = {
    completed: "bg-success/10 text-success border-success/20",
    "in-progress": "bg-warning/10 text-warning border-warning/20",
    pending: "bg-muted text-muted-foreground border-border"
  };
  
  return (
    <Badge variant="outline" className={variants[status as keyof typeof variants]}>
      {status.replace('-', ' ')}
    </Badge>
  );
};

export function DocumentBox({ 
  id,
  title, 
  required, 
  uploaded, 
  status, 
  folderStructure,
  icon,
  selectedDocuments,
  onRename,
  onDelete,
  onCreateFolder,
  onCreateDocument,
  onToggleDocumentSelection,
  onItemRename,
  onItemDelete,
  onItemCreateFolder,
  onItemCreateDocument,
  onDragStart,
  onDragOver,
  onDrop
}: DocumentBoxProps) {
  const completionPercentage = Math.round((uploaded / required) * 100);

  return (
    <Card 
      className="shadow-soft border border-border h-fit relative group"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            {icon || <Folder className="h-5 w-5 text-primary" />}
            {title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <StatusBadge status={status} />
            <span className="text-sm text-muted-foreground font-medium">
              {uploaded}/{required}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onCreateFolder}>
                  <FolderPlus className="h-4 w-4 mr-2" />
                  New Folder
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onCreateDocument}>
                  <FilePlus className="h-4 w-4 mr-2" />
                  New Document
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onRename}>
                  <Edit className="h-4 w-4 mr-2" />
                  Rename Category
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete} className="text-danger">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Category
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-card-foreground">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-1" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <FolderStructure 
          items={folderStructure}
          selectedDocuments={selectedDocuments}
          onToggleDocumentSelection={onToggleDocumentSelection}
          onItemRename={onItemRename}
          onItemDelete={onItemDelete}
          onItemCreateFolder={onItemCreateFolder}
          onItemCreateDocument={onItemCreateDocument}
          onDragStart={onDragStart}
        />
      </CardContent>
    </Card>
  );
}