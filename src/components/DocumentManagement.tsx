import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DocumentBox } from "./DocumentBox";
import { DocumentChecklist } from "./DocumentChecklist";
import { MultiSelectToolbar } from "./MultiSelectToolbar";
import { 
  CreateCategoryDialog, 
  CreateItemDialog, 
  RenameDialog, 
  DeleteDialog 
} from "./DocumentManagementDialog";
import { useDocumentManagement, DocumentCategory } from "@/hooks/useDocumentManagement";
import { 
  Upload, 
  Download, 
  Folder,
  DollarSign,
  Scale,
  Users,
  Plus
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

// Initial data with proper IDs
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

export function DocumentManagement() {
  const {
    categories,
    selectedDocuments,
    draggedItem,
    setDraggedItem,
    createCategory,
    deleteCategory,
    renameCategory,
    createFolder,
    createDocument,
    deleteItem,
    renameItem,
    moveItems,
    toggleDocumentSelection,
    clearSelection
  } = useDocumentManagement(initialDocumentCategories);

  // Dialog states
  const [showCreateCategoryDialog, setShowCreateCategoryDialog] = useState(false);
  const [showCreateItemDialog, setShowCreateItemDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Dialog context
  const [dialogContext, setDialogContext] = useState<{
    type: "category" | "folder" | "document";
    categoryId?: string;
    itemId?: string;
    parentId?: string | null;
    currentName?: string;
    itemType?: "folder" | "document";
  }>({
    type: "category"
  });

  const totalRequired = categories.reduce((sum, cat) => sum + cat.required, 0);
  const totalUploaded = categories.reduce((sum, cat) => sum + cat.uploaded, 0);
  const completionPercentage = Math.round((totalUploaded / totalRequired) * 100);

  // Flatten all documents for the checklist
  const allDocuments = categories.flatMap(category => 
    flattenDocuments(category.folderStructure, category.name)
  );

  // Dialog handlers
  const handleCreateCategory = (name: string, icon: React.ReactNode) => {
    createCategory(name, icon);
  };

  const handleRenameCategory = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      setDialogContext({ type: "category", categoryId, currentName: category.name });
      setShowRenameDialog(true);
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      setDialogContext({ type: "category", categoryId, currentName: category.name });
      setShowDeleteDialog(true);
    }
  };

  const handleCreateFolder = (categoryId: string, parentId: string | null = null) => {
    setDialogContext({ type: "folder", categoryId, parentId, itemType: "folder" });
    setShowCreateItemDialog(true);
  };

  const handleCreateDocument = (categoryId: string, parentId: string | null = null) => {
    setDialogContext({ type: "document", categoryId, parentId, itemType: "document" });
    setShowCreateItemDialog(true);
  };

  const handleRenameItem = (categoryId: string, itemId: string) => {
    // Find the item to get its current name
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      const findItem = (items: any[]): any => {
        for (const item of items) {
          if (item.id === itemId) return item;
          if (item.children) {
            const found = findItem(item.children);
            if (found) return found;
          }
        }
        return null;
      };
      
      const item = findItem(category.folderStructure);
      if (item) {
        setDialogContext({ 
          type: item.type, 
          categoryId, 
          itemId, 
          currentName: item.name 
        });
        setShowRenameDialog(true);
      }
    }
  };

  const handleDeleteItem = (categoryId: string, itemId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      const findItem = (items: any[]): any => {
        for (const item of items) {
          if (item.id === itemId) return item;
          if (item.children) {
            const found = findItem(item.children);
            if (found) return found;
          }
        }
        return null;
      };
      
      const item = findItem(category.folderStructure);
      if (item) {
        setDialogContext({ 
          type: item.type, 
          categoryId, 
          itemId, 
          currentName: item.name 
        });
        setShowDeleteDialog(true);
      }
    }
  };

  // Drag and drop handlers
  const handleDragStart = (categoryId: string, item: any) => {
    setDraggedItem({ item, categoryId });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetCategoryId: string) => {
    e.preventDefault();
    if (draggedItem && draggedItem.categoryId !== targetCategoryId) {
      moveItems(draggedItem.categoryId, targetCategoryId, [draggedItem.item.id]);
    }
    setDraggedItem(null);
  };

  // Bulk operations
  const handleBulkMove = (targetCategoryId: string) => {
    const selectedIds = Array.from(selectedDocuments);
    if (selectedIds.length > 0) {
      // Find source category for selected documents
      const sourceCategory = categories.find(cat => 
        flattenDocuments(cat.folderStructure, cat.name)
          .some(doc => selectedIds.includes(doc.id))
      );
      
      if (sourceCategory) {
        moveItems(sourceCategory.id, targetCategoryId, selectedIds);
      }
    }
  };

  const handleBulkDelete = () => {
    const selectedIds = Array.from(selectedDocuments);
    selectedIds.forEach(docId => {
      const sourceCategory = categories.find(cat => 
        flattenDocuments(cat.folderStructure, cat.name)
          .some(doc => doc.id === docId)
      );
      
      if (sourceCategory) {
        deleteItem(sourceCategory.id, docId);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Main Content Area - Two Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Left Side - Document Type Boxes */}
        <div className="xl:col-span-3 space-y-6">
          {/* Category Management Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-card-foreground">Document Categories</h3>
            <Button onClick={() => setShowCreateCategoryDialog(true)} className="animate-fade-in">
              <Plus className="h-4 w-4 mr-2" />
              New Category
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {categories.map((category, index) => (
              <div
                key={category.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('application/json', JSON.stringify({
                    type: 'category',
                    categoryId: category.id
                  }));
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const data = JSON.parse(e.dataTransfer.getData('application/json'));
                  if (data.type === 'category' && data.categoryId !== category.id) {
                    // reorderCategories would be implemented in the hook
                    console.log('Reorder category', data.categoryId, 'after', category.id);
                  }
                }}
                className="group"
              >
                <DocumentBox
                  id={category.id}
                  title={category.name}
                  required={category.required}
                  uploaded={category.uploaded}
                  status={category.status}
                  folderStructure={category.folderStructure || []}
                  icon={category.icon}
                  selectedDocuments={selectedDocuments}
                  onRename={() => handleRenameCategory(category.id)}
                  onDelete={() => handleDeleteCategory(category.id)}
                  onCreateFolder={() => handleCreateFolder(category.id)}
                  onCreateDocument={() => handleCreateDocument(category.id)}
                  onToggleDocumentSelection={toggleDocumentSelection}
                  onItemRename={(itemId) => handleRenameItem(category.id, itemId)}
                  onItemDelete={(itemId) => handleDeleteItem(category.id, itemId)}
                  onItemCreateFolder={(parentId) => handleCreateFolder(category.id, parentId)}
                  onItemCreateDocument={(parentId) => handleCreateDocument(category.id, parentId)}
                  onDragStart={(item) => handleDragStart(category.id, item)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, category.id)}
                />
              </div>
            ))}
            
            {/* Add New Category Card */}
            <Card 
              className="h-[600px] border-2 border-dashed border-border/50 hover:border-primary/50 transition-all duration-200 cursor-pointer group bg-gradient-to-br from-secondary/20 to-background animate-fade-in"
              onClick={() => setShowCreateCategoryDialog(true)}
            >
              <CardContent className="h-full flex flex-col items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                <div className="rounded-full bg-secondary/50 group-hover:bg-primary/10 p-6 mb-4 transition-colors">
                  <Plus className="h-12 w-12" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Add New Category</h3>
                <p className="text-sm text-center px-4">Create a new document category to organize your files</p>
              </CardContent>
            </Card>
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

      {/* Multi-select toolbar */}
      <MultiSelectToolbar
        selectedCount={selectedDocuments.size}
        categories={categories}
        currentCategoryId=""
        onMove={handleBulkMove}
        onDelete={handleBulkDelete}
        onClear={clearSelection}
      />

      {/* Dialogs */}
      <CreateCategoryDialog
        open={showCreateCategoryDialog}
        onOpenChange={setShowCreateCategoryDialog}
        onConfirm={handleCreateCategory}
      />

      <CreateItemDialog
        open={showCreateItemDialog}
        onOpenChange={setShowCreateItemDialog}
        type={dialogContext.itemType || "folder"}
        onConfirm={(name, fileType) => {
          if (dialogContext.itemType === "folder") {
            createFolder(dialogContext.categoryId!, dialogContext.parentId!, name);
          } else {
            createDocument(dialogContext.categoryId!, dialogContext.parentId!, name, fileType!);
          }
        }}
      />

      <RenameDialog
        open={showRenameDialog}
        onOpenChange={setShowRenameDialog}
        currentName={dialogContext.currentName || ""}
        type={dialogContext.type}
        onConfirm={(newName) => {
          if (dialogContext.type === "category") {
            renameCategory(dialogContext.categoryId!, newName);
          } else {
            renameItem(dialogContext.categoryId!, dialogContext.itemId!, newName);
          }
        }}
      />

      <DeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        itemName={dialogContext.currentName || ""}
        type={dialogContext.type}
        onConfirm={() => {
          if (dialogContext.type === "category") {
            deleteCategory(dialogContext.categoryId!);
          } else {
            deleteItem(dialogContext.categoryId!, dialogContext.itemId!);
          }
        }}
      />
    </div>
  );
}