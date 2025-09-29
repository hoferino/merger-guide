import { useParams, Link } from "react-router-dom";
import { mockDeals } from "@/data/mockDeals";
import { mockClients } from "@/data/mockClients";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Edit, Users, DollarSign, Calendar, TrendingUp, Scale } from "lucide-react";
import { DealOverview } from "@/components/DealOverview";
import { DealTimeline } from "@/components/DealTimeline";
import { TodoSection } from "@/components/TodoSection";
import { KPIMetrics } from "@/components/KPIMetrics";
import DocumentsPage from "@/pages/DocumentsPage";
import { AIAnalysisHub } from "@/components/AIAnalysisHub";
import { DocumentManagement } from "@/components/DocumentManagement";
import { useDocumentManagement, Document as DocType, DocumentCategory } from "@/hooks/useDocumentManagement";

// Mock data for documents (temporary until Supabase integration)
const initialDocumentCategories: DocumentCategory[] = [
  {
    id: "financial-docs",
    name: "Financial Documents",
    icon: <DollarSign className="h-5 w-5 text-primary" />,
    required: 8,
    uploaded: 6,
    status: "in-progress",
    folderStructure: [
      {
        id: "annual-reports",
        name: "Annual Reports",
        type: "folder",
        children: [
          {
            id: "audited-financials",
            name: "Audited Financials (3 years)",
            type: "document",
            document: { id: "doc-1", name: "Audited Financials (3 years)", status: "uploaded", type: "pdf" }
          },
          {
            id: "management-accounts",
            name: "Management Accounts",
            type: "document",
            document: { id: "doc-2", name: "Management Accounts", status: "uploaded", type: "xlsx" }
          }
        ]
      },
      {
        id: "projections-analysis",
        name: "Projections & Analysis",
        type: "folder",
        children: [
          {
            id: "cash-flow-projections",
            name: "Cash Flow Projections",
            type: "document",
            document: { id: "doc-3", name: "Cash Flow Projections", status: "uploaded", type: "xlsx" }
          },
          {
            id: "working-capital-analysis",
            name: "Working Capital Analysis",
            type: "document",
            document: { id: "doc-4", name: "Working Capital Analysis", status: "uploaded", type: "xlsx" }
          }
        ]
      },
      {
        id: "tax-returns",
        name: "Tax Returns",
        type: "document",
        document: { id: "doc-5", name: "Tax Returns", status: "uploaded", type: "pdf" }
      },
      {
        id: "banking-debt",
        name: "Banking & Debt",
        type: "folder",
        children: [
          {
            id: "debt-schedule",
            name: "Debt Schedule",
            type: "document",
            document: { id: "doc-6", name: "Debt Schedule", status: "uploaded", type: "xlsx" }
          },
          {
            id: "banking-agreements",
            name: "Banking Agreements",
            type: "document",
            document: { id: "doc-7", name: "Banking Agreements", status: "pending", type: "pdf" }
          }
        ]
      },
      {
        id: "insurance-documentation",
        name: "Insurance Documentation",
        type: "document",
        document: { id: "doc-8", name: "Insurance Documentation", status: "pending", type: "pdf" }
      }
    ]
  },
  {
    id: "legal-docs",
    name: "Legal Documents",
    icon: <Scale className="h-5 w-5 text-primary" />,
    required: 6,
    uploaded: 4,
    status: "in-progress",
    folderStructure: [
      {
        id: "corporate-structure",
        name: "Corporate Structure",
        type: "folder",
        children: [
          {
            id: "articles-incorporation",
            name: "Articles of Incorporation",
            type: "document",
            document: { id: "doc-9", name: "Articles of Incorporation", status: "uploaded", type: "pdf" }
          },
          {
            id: "board-resolutions",
            name: "Board Resolutions",
            type: "document",
            document: { id: "doc-10", name: "Board Resolutions", status: "uploaded", type: "pdf" }
          }
        ]
      },
      {
        id: "contracts-agreements",
        name: "Contracts & Agreements",
        type: "folder",
        children: [
          {
            id: "material-contracts",
            name: "Material Contracts",
            type: "document",
            document: { id: "doc-11", name: "Material Contracts", status: "uploaded", type: "pdf" }
          },
          {
            id: "employment-agreements",
            name: "Employment Agreements",
            type: "document",
            document: { id: "doc-12", name: "Employment Agreements", status: "pending", type: "pdf" }
          }
        ]
      },
      {
        id: "ip-documentation",
        name: "IP Documentation",
        type: "document",
        document: { id: "doc-13", name: "IP Documentation", status: "uploaded", type: "pdf" }
      },
      {
        id: "compliance-certificates",
        name: "Compliance Certificates",
        type: "document",
        document: { id: "doc-14", name: "Compliance Certificates", status: "pending", type: "pdf" }
      }
    ]
  },
  {
    id: "operational-docs",
    name: "Operational Documents",
    icon: <Users className="h-5 w-5 text-primary" />,
    required: 5,
    uploaded: 5,
    status: "completed",
    folderStructure: [
      {
        id: "organization-personnel",
        name: "Organization & Personnel",
        type: "folder",
        children: [
          {
            id: "organization-chart",
            name: "Organization Chart",
            type: "document",
            document: { id: "doc-15", name: "Organization Chart", status: "uploaded", type: "pdf" }
          },
          {
            id: "key-personnel-cvs",
            name: "Key Personnel CVs",
            type: "document",
            document: { id: "doc-16", name: "Key Personnel CVs", status: "uploaded", type: "pdf" }
          }
        ]
      },
      {
        id: "business-relationships",
        name: "Business Relationships",
        type: "folder",
        children: [
          {
            id: "customer-list",
            name: "Customer List",
            type: "document",
            document: { id: "doc-17", name: "Customer List", status: "uploaded", type: "xlsx" }
          },
          {
            id: "supplier-agreements",
            name: "Supplier Agreements",
            type: "document",
            document: { id: "doc-18", name: "Supplier Agreements", status: "uploaded", type: "pdf" }
          }
        ]
      },
      {
        id: "business-plan",
        name: "Business Plan",
        type: "document",
        document: { id: "doc-19", name: "Business Plan", status: "uploaded", type: "pdf" }
      }
    ]
  }
];

// Helper to flatten all documents from categories
const flattenAllDocuments = (categories: any[]): DocType[] => {
  const allDocs: DocType[] = [];
  
  const traverse = (items: any[]) => {
    items.forEach((item) => {
      if (item.type === "document" && item.document) {
        allDocs.push(item.document);
      } else if (item.type === "folder" && item.children) {
        traverse(item.children);
      }
    });
  };
  
  categories.forEach((category) => {
    traverse(category.folderStructure);
  });
  
  return allDocs;
};

export default function DealDetail() {
  const { id } = useParams();
  const deal = mockDeals.find(d => d.id === id);
  const client = deal ? mockClients.find(c => c.id === deal.clientId) : null;
  
  // Get document management state with mock data
  const documentManagement = useDocumentManagement(initialDocumentCategories);
  const allDocuments = flattenAllDocuments(documentManagement.categories);
  
  console.log("🔍 DealDetail - documentManagement.categories:", documentManagement.categories);
  console.log("🔍 DealDetail - allDocuments:", allDocuments);

  if (!deal) {
    return (
      <div className="py-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Deal not found</h2>
          <Button asChild className="mt-4">
            <Link to="/internal/deals">Back to All Deals</Link>
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "default";
      case "pending": return "secondary";
      case "completed": return "outline";
      case "cancelled": return "destructive";
      default: return "default";
    }
  };

  return (
    <div className="space-y-6 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link to="/internal/deals">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-3xl font-bold tracking-tight">{deal.name}</h2>
              <Badge variant={getStatusColor(deal.status)}>{deal.status}</Badge>
            </div>
            <p className="text-muted-foreground">{deal.client} • {deal.phase}</p>
          </div>
        </div>
        <Button>
          <Edit className="mr-2 h-4 w-4" />
          Edit Deal
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deal Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(deal.value / 1000000).toFixed(1)}M</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deal.progress}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Close Date</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Date(deal.closeDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Client</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">{client?.name || 'N/A'}</div>
            <p className="text-xs text-muted-foreground">{client?.email || ''}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents (Dataroom)</TabsTrigger>
          <TabsTrigger value="ai-analysis">AI Analysis</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="todos">Tasks</TabsTrigger>
          <TabsTrigger value="team">Team & Access</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Deal Information</CardTitle>
              <CardDescription>{deal.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created</p>
                  <p className="text-sm">{new Date(deal.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Last Activity</p>
                  <p className="text-sm">{new Date(deal.lastActivity).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <KPIMetrics />
          <DealOverview />
        </TabsContent>

        <TabsContent value="documents">
          <DocumentsPage />
        </TabsContent>

        <TabsContent value="ai-analysis" className="h-[calc(100vh-16rem)]">
          <AIAnalysisHub documents={allDocuments} />
        </TabsContent>

        <TabsContent value="timeline">
          <DealTimeline />
        </TabsContent>

        <TabsContent value="todos">
          <TodoSection />
        </TabsContent>

        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>Team Members & Access</CardTitle>
              <CardDescription>Manage who has access to this deal</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Team management interface coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
