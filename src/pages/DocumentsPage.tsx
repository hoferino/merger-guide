import { DocumentManagement } from "@/components/DocumentManagement";

const DocumentsPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Document Management</h2>
        <p className="text-muted-foreground">
          Secure document upload, review status, and manage due diligence materials
        </p>
      </div>
      
      <DocumentManagement />
    </div>
  );
};

export default DocumentsPage;