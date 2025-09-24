import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FolderStructure } from "./FolderStructure";
import { FileText, Folder } from "lucide-react";

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

interface DocumentBoxProps {
  title: string;
  required: number;
  uploaded: number;
  status: "completed" | "in-progress" | "pending";
  folderStructure: FolderItem[];
  icon?: React.ReactNode;
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
  title, 
  required, 
  uploaded, 
  status, 
  folderStructure,
  icon 
}: DocumentBoxProps) {
  const completionPercentage = Math.round((uploaded / required) * 100);

  return (
    <Card className="shadow-soft border border-border h-fit">
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
        <FolderStructure items={folderStructure} />
      </CardContent>
    </Card>
  );
}