import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DocumentBox } from "./DocumentBox";
import { DocumentChecklist } from "./DocumentChecklist";
import { 
  Upload, 
  Download, 
  Folder,
  DollarSign,
  Scale,
  Users,
  Settings
} from "lucide-react";

// Helper function to flatten folder structure into document list
const flattenDocuments = (folderStructure: any[], category: string): any[] => {
  const documents: any[] = [];
  
  const traverse = (items: any[]) => {
    items.forEach(item => {
      if (item.type === "document" && item.document) {
        documents.push({
          ...item.document,
          category
        });
      } else if (item.type === "folder" && item.children) {
        traverse(item.children);
      }
    });
  };
  
  traverse(folderStructure);
  return documents;
};

// Transform the existing data structure to support folder organization
const documentCategories = [
  {
    name: "Financial Documents",
    icon: <DollarSign className="h-5 w-5 text-primary" />,
    required: 8,
    uploaded: 6,
    status: "in-progress" as const,
    folderStructure: [
      {
        name: "Annual Reports",
        type: "folder" as const,
        children: [
          {
            name: "Audited Financials (3 years)",
            type: "document" as const,
            document: { name: "Audited Financials (3 years)", status: "uploaded" as const, type: "pdf" }
          },
          {
            name: "Management Accounts",
            type: "document" as const,
            document: { name: "Management Accounts", status: "uploaded" as const, type: "xlsx" }
          }
        ]
      },
      {
        name: "Projections & Analysis",
        type: "folder" as const,
        children: [
          {
            name: "Cash Flow Projections",
            type: "document" as const,
            document: { name: "Cash Flow Projections", status: "uploaded" as const, type: "xlsx" }
          },
          {
            name: "Working Capital Analysis",
            type: "document" as const,
            document: { name: "Working Capital Analysis", status: "uploaded" as const, type: "xlsx" }
          }
        ]
      },
      {
        name: "Tax Returns",
        type: "document" as const,
        document: { name: "Tax Returns", status: "uploaded" as const, type: "pdf" }
      },
      {
        name: "Banking & Debt",
        type: "folder" as const,
        children: [
          {
            name: "Debt Schedule",
            type: "document" as const,
            document: { name: "Debt Schedule", status: "uploaded" as const, type: "xlsx" }
          },
          {
            name: "Banking Agreements",
            type: "document" as const,
            document: { name: "Banking Agreements", status: "pending" as const, type: "pdf" }
          }
        ]
      },
      {
        name: "Insurance Documentation",
        type: "document" as const,
        document: { name: "Insurance Documentation", status: "pending" as const, type: "pdf" }
      }
    ]
  },
  {
    name: "Legal Documents",
    icon: <Scale className="h-5 w-5 text-primary" />,
    required: 6,
    uploaded: 4,
    status: "in-progress" as const,
    folderStructure: [
      {
        name: "Corporate Structure",
        type: "folder" as const,
        children: [
          {
            name: "Articles of Incorporation",
            type: "document" as const,
            document: { name: "Articles of Incorporation", status: "uploaded" as const, type: "pdf" }
          },
          {
            name: "Board Resolutions",
            type: "document" as const,
            document: { name: "Board Resolutions", status: "uploaded" as const, type: "pdf" }
          }
        ]
      },
      {
        name: "Contracts & Agreements",
        type: "folder" as const,
        children: [
          {
            name: "Material Contracts",
            type: "document" as const,
            document: { name: "Material Contracts", status: "uploaded" as const, type: "pdf" }
          },
          {
            name: "Employment Agreements",
            type: "document" as const,
            document: { name: "Employment Agreements", status: "pending" as const, type: "pdf" }
          }
        ]
      },
      {
        name: "IP Documentation",
        type: "document" as const,
        document: { name: "IP Documentation", status: "uploaded" as const, type: "pdf" }
      },
      {
        name: "Compliance Certificates",
        type: "document" as const,
        document: { name: "Compliance Certificates", status: "pending" as const, type: "pdf" }
      }
    ]
  },
  {
    name: "Operational Documents",
    icon: <Users className="h-5 w-5 text-primary" />,
    required: 5,
    uploaded: 5,
    status: "completed" as const,
    folderStructure: [
      {
        name: "Organization & Personnel",
        type: "folder" as const,
        children: [
          {
            name: "Organization Chart",
            type: "document" as const,
            document: { name: "Organization Chart", status: "uploaded" as const, type: "pdf" }
          },
          {
            name: "Key Personnel CVs",
            type: "document" as const,
            document: { name: "Key Personnel CVs", status: "uploaded" as const, type: "pdf" }
          }
        ]
      },
      {
        name: "Business Relationships",
        type: "folder" as const,
        children: [
          {
            name: "Customer List",
            type: "document" as const,
            document: { name: "Customer List", status: "uploaded" as const, type: "xlsx" }
          },
          {
            name: "Supplier Agreements",
            type: "document" as const,
            document: { name: "Supplier Agreements", status: "uploaded" as const, type: "pdf" }
          }
        ]
      },
      {
        name: "Business Plan",
        type: "document" as const,
        document: { name: "Business Plan", status: "uploaded" as const, type: "pdf" }
      }
    ]
  }
];

export function DocumentManagement() {
  const totalRequired = documentCategories.reduce((sum, cat) => sum + cat.required, 0);
  const totalUploaded = documentCategories.reduce((sum, cat) => sum + cat.uploaded, 0);
  const completionPercentage = Math.round((totalUploaded / totalRequired) * 100);

  // Flatten all documents for the checklist
  const allDocuments = documentCategories.flatMap(category => 
    flattenDocuments(category.folderStructure, category.name)
  );

  return (
    <div className="space-y-6">
      {/* Document Overview */}
      <Card className="bg-card shadow-soft border border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Folder className="h-5 w-5 text-primary" />
            Document Management Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-card-foreground">
                {totalUploaded} / {totalRequired}
              </p>
              <p className="text-sm text-muted-foreground">Documents Uploaded</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-card-foreground">{completionPercentage}%</p>
              <p className="text-sm text-muted-foreground">Complete</p>
            </div>
          </div>
          <Progress value={completionPercentage} className="h-2" />
          <div className="flex gap-2">
            <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary-dark">
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

      {/* Main Content Area - Two Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Left Side - Document Type Boxes */}
        <div className="xl:col-span-3 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {documentCategories.map((category, index) => (
              <DocumentBox
                key={index}
                title={category.name}
                required={category.required}
                uploaded={category.uploaded}
                status={category.status}
                folderStructure={category.folderStructure}
                icon={category.icon}
              />
            ))}
          </div>

          {/* Upload Zone */}
          <Card className="border-2 border-dashed border-border">
            <CardContent className="p-8 text-center">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-card-foreground mb-2">Upload Documents</h3>
              <p className="text-muted-foreground mb-4">
                Drag and drop files here, or click to browse
              </p>
              <Button className="bg-primary text-primary-foreground hover:bg-primary-dark">
                Choose Files
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Supports PDF, DOC, DOCX, XLS, XLSX files up to 10MB
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Document Checklist */}
        <div className="xl:col-span-1">
          <DocumentChecklist 
            documents={allDocuments}
            totalRequired={totalRequired}
            totalUploaded={totalUploaded}
            completionPercentage={completionPercentage}
          />
        </div>
      </div>
    </div>
  );
}
