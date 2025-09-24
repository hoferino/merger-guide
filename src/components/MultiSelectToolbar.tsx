import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  X, 
  Move, 
  Trash2, 
  FolderOpen 
} from "lucide-react";
import { DocumentCategory } from "@/hooks/useDocumentManagement";

interface MultiSelectToolbarProps {
  selectedCount: number;
  categories: DocumentCategory[];
  currentCategoryId: string;
  onMove: (targetCategoryId: string) => void;
  onDelete: () => void;
  onClear: () => void;
}

export function MultiSelectToolbar({ 
  selectedCount, 
  categories, 
  currentCategoryId, 
  onMove, 
  onDelete, 
  onClear 
}: MultiSelectToolbarProps) {
  if (selectedCount === 0) return null;

  const availableCategories = categories.filter(cat => cat.id !== currentCategoryId);

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-card border border-border rounded-lg shadow-large p-4 z-50">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            {selectedCount} selected
          </Badge>
          <Button variant="ghost" size="sm" onClick={onClear}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="h-6 w-px bg-border" />
        
        <div className="flex items-center gap-2">
          <Select onValueChange={onMove}>
            <SelectTrigger className="w-[200px]">
              <Move className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Move to..." />
            </SelectTrigger>
            <SelectContent>
              {availableCategories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  <div className="flex items-center gap-2">
                    {category.icon}
                    <span>{category.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" onClick={onDelete} className="text-danger hover:text-danger">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}