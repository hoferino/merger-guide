import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  FileText, 
  Download, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Folder,
  Eye
} from "lucide-react";

const documentCategories = [
  {
    name: "Financial Documents",
    required: 8,
    uploaded: 6,
    status: "in-progress",
    documents: [
      { name: "Audited Financials (3 years)", status: "uploaded", type: "pdf" },
      { name: "Management Accounts", status: "uploaded", type: "xlsx" },
      { name: "Cash Flow Projections", status: "uploaded", type: "xlsx" },
      { name: "Tax Returns", status: "uploaded", type: "pdf" },
      { name: "Working Capital Analysis", status: "uploaded", type: "xlsx" },
      { name: "Debt Schedule", status: "uploaded", type: "xlsx" },
      { name: "Insurance Documentation", status: "pending", type: "pdf" },
      { name: "Banking Agreements", status: "pending", type: "pdf" }
    ]
  },
  {
    name: "Legal Documents",
    required: 6,
    uploaded: 4,
    status: "in-progress",
    documents: [
      { name: "Articles of Incorporation", status: "uploaded", type: "pdf" },
      { name: "Board Resolutions", status: "uploaded", type: "pdf" },
      { name: "Material Contracts", status: "uploaded", type: "pdf" },
      { name: "IP Documentation", status: "uploaded", type: "pdf" },
      { name: "Employment Agreements", status: "pending", type: "pdf" },
      { name: "Compliance Certificates", status: "pending", type: "pdf" }
    ]
  },
  {
    name: "Operational Documents",
    required: 5,
    uploaded: 5,
    status: "completed",
    documents: [
      { name: "Organization Chart", status: "uploaded", type: "pdf" },
      { name: "Key Personnel CVs", status: "uploaded", type: "pdf" },
      { name: "Customer List", status: "uploaded", type: "xlsx" },
      { name: "Supplier Agreements", status: "uploaded", type: "pdf" },
      { name: "Business Plan", status: "uploaded", type: "pdf" }
    ]
  }
];

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

const CategoryStatusBadge = ({ status }: { status: string }) => {
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

export function DocumentManagement() {
  const totalRequired = documentCategories.reduce((sum, cat) => sum + cat.required, 0);
  const totalUploaded = documentCategories.reduce((sum, cat) => sum + cat.uploaded, 0);
  const completionPercentage = Math.round((totalUploaded / totalRequired) * 100);

  return (
    <div className="space-y-6">
      {/* Document Overview */}
      <Card className="bg-gradient-card shadow-medium border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Folder className="h-5 w-5 text-primary" />
            Document Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-foreground">
                {totalUploaded} / {totalRequired}
              </p>
              <p className="text-sm text-muted-foreground">Documents Uploaded</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-foreground">{completionPercentage}%</p>
              <p className="text-sm text-muted-foreground">Complete</p>
            </div>
          </div>
          <Progress value={completionPercentage} className="h-2" />
          <div className="flex gap-2">
            <Button className="flex-1 bg-gradient-primary">
              <Upload className="h-4 w-4 mr-2" />
              Upload Documents
            </Button>
            <Button variant="outline" className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Document Categories */}
      <div className="space-y-4">
        {documentCategories.map((category, index) => (
          <Card key={index} className="shadow-soft">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{category.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <CategoryStatusBadge status={category.status} />
                  <span className="text-sm text-muted-foreground">
                    {category.uploaded}/{category.required}
                  </span>
                </div>
              </div>
              <Progress 
                value={(category.uploaded / category.required) * 100} 
                className="h-1" 
              />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {category.documents.map((doc, docIndex) => (
                  <div key={docIndex} className="flex items-center justify-between p-2 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <StatusIcon status={doc.status} />
                      <div>
                        <p className="font-medium text-foreground text-sm">{doc.name}</p>
                        <p className="text-xs text-muted-foreground uppercase">{doc.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {doc.status === "uploaded" && (
                        <>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {doc.status === "pending" && (
                        <Button variant="outline" size="sm">
                          <Upload className="h-4 w-4 mr-1" />
                          Upload
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upload Zone */}
      <Card className="border-2 border-dashed border-border">
        <CardContent className="p-8 text-center">
          <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-foreground mb-2">Upload Documents</h3>
          <p className="text-muted-foreground mb-4">
            Drag and drop files here, or click to browse
          </p>
          <Button className="bg-gradient-primary">
            Choose Files
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Supports PDF, DOC, DOCX, XLS, XLSX files up to 10MB
          </p>
        </CardContent>
      </Card>
    </div>
  );
}