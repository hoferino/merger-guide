import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
  AlertTriangle,
  MoreVertical,
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

interface FolderStructureProps {
  items: FolderItem[];
  level?: number;
  selectedDocuments?: Set<string>;
  onToggleDocumentSelection: (documentId: string) => void;
  onItemRename: (itemId: string) => void;
  onItemDelete: (itemId: string) => void;
  onItemCreateFolder: (parentId: string | null) => void;
  onItemCreateDocument: (parentId: string | null) => void;
  onDragStart: (item: FolderItem) => void;
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

export function FolderStructure({ 
  items, 
  level = 0, 
  selectedDocuments, 
  onToggleDocumentSelection,
  onItemRename,
  onItemDelete,
  onItemCreateFolder,
  onItemCreateDocument,
  onDragStart
}: FolderStructureProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);
  const [dropPosition, setDropPosition] = useState<'before' | 'after' | 'inside' | null>(null);
  
  // Safety check for selectedDocuments
  const safeSelectedDocuments = selectedDocuments || new Set<string>();

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleDragOver = (e: React.DragEvent, itemId: string, itemType: 'folder' | 'document') => {
    e.preventDefault();
    e.stopPropagation();
    
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const height = rect.height;
    
    let position: 'before' | 'after' | 'inside' = 'after';
    
    if (itemType === 'folder') {
      if (y < height * 0.25) {
        position = 'before';
      } else if (y > height * 0.75) {
        position = 'after';
      } else {
        position = 'inside';
      }
    } else {
      position = y < height * 0.5 ? 'before' : 'after';
    }
    
    setDragOverItem(itemId);
    setDropPosition(position);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverItem(null);
      setDropPosition(null);
    }
  };

  const handleDrop = (e: React.DragEvent, itemId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverItem(null);
    setDropPosition(null);
    // Handle drop logic would be implemented by parent
  };

  const getDropIndicatorClass = (itemId: string, itemType: 'folder' | 'document') => {
    if (dragOverItem !== itemId) return '';
    
    const baseClass = 'relative ';
    if (dropPosition === 'before') {
      return baseClass + 'before:absolute before:top-0 before:left-0 before:right-0 before:h-0.5 before:bg-primary before:content-[""]';
    } else if (dropPosition === 'after') {
      return baseClass + 'after:absolute after:bottom-0 before:left-0 before:right-0 before:h-0.5 before:bg-primary before:content-[""]';
    } else if (dropPosition === 'inside' && itemType === 'folder') {
      return baseClass + 'ring-2 ring-primary/50 ring-inset';
    }
    return '';
  };

  return (
    <div className="space-y-1">
      {items?.map((item, index) => {
        if (!item) return null;
        
        const isExpanded = expandedFolders.has(item.id);
        const paddingLeft = level * 20;
        const isSelected = item.document && safeSelectedDocuments.has(item.document.id);

        if (item.type === "folder") {
          return (
            <div
              key={item.id}
              className={`${getDropIndicatorClass(item.id, 'folder')}`}
              onDragOver={(e) => handleDragOver(e, item.id, 'folder')}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, item.id)}
            >
              <div
                className={`flex items-center gap-2 p-2 rounded-md hover:bg-secondary/50 transition-colors group ${isSelected ? 'bg-primary/10' : ''}`}
                style={{ paddingLeft: `${paddingLeft + 8}px` }}
                draggable
                onDragStart={() => onDragStart(item)}
              >
                <div
                  className="flex items-center gap-2 flex-1 cursor-pointer"
                  onClick={() => toggleFolder(item.id)}
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
                    <Badge variant="outline" className="text-xs">
                      {item.children.length}
                    </Badge>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100">
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onItemCreateFolder(item.id)}>
                      <FolderPlus className="h-4 w-4 mr-2" />
                      New Folder
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onItemCreateDocument(item.id)}>
                      <FilePlus className="h-4 w-4 mr-2" />
                      New Document
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onItemRename(item.id)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onItemDelete(item.id)} className="text-danger">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {isExpanded && item.children && (
                <FolderStructure 
                  items={item.children} 
                  level={level + 1}
                  selectedDocuments={safeSelectedDocuments}
                  onToggleDocumentSelection={onToggleDocumentSelection}
                  onItemRename={onItemRename}
                  onItemDelete={onItemDelete}
                  onItemCreateFolder={onItemCreateFolder}
                  onItemCreateDocument={onItemCreateDocument}
                  onDragStart={onDragStart}
                />
              )}
            </div>
          );
        } else {
          // Document item
          const doc = item.document!;
          return (
            <div
              key={item.id}
              className={`${getDropIndicatorClass(item.id, 'document')} flex items-center justify-between p-2 rounded-md hover:bg-secondary/30 transition-colors group ${isSelected ? 'bg-primary/10' : ''}`}
              style={{ paddingLeft: `${paddingLeft + 28}px` }}
              draggable
              onDragStart={() => onDragStart(item)}
              onDragOver={(e) => handleDragOver(e, item.id, 'document')}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, item.id)}
            >
              <div className="flex items-center gap-2 flex-1">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => onToggleDocumentSelection(doc.id)}
                  className="h-4 w-4"
                />
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100">
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onItemRename(item.id)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onItemDelete(item.id)} className="text-danger">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
}