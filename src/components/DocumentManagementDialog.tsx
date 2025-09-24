import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DollarSign, Scale, Users, Folder, FileText } from "lucide-react";

interface CreateCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (name: string, icon: React.ReactNode) => void;
}

interface CreateItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "folder" | "document";
  onConfirm: (name: string, fileType?: string) => void;
}

interface RenameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentName: string;
  type: "category" | "folder" | "document";
  onConfirm: (newName: string) => void;
}

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName: string;
  type: "category" | "folder" | "document";
  onConfirm: () => void;
}

const categoryIcons = {
  financial: <DollarSign className="h-5 w-5 text-primary" />,
  legal: <Scale className="h-5 w-5 text-primary" />,
  operational: <Users className="h-5 w-5 text-primary" />,
  folder: <Folder className="h-5 w-5 text-primary" />
};

export function CreateCategoryDialog({ open, onOpenChange, onConfirm }: CreateCategoryDialogProps) {
  const [name, setName] = useState("");
  const [iconType, setIconType] = useState<keyof typeof categoryIcons>("financial");

  const handleSubmit = () => {
    if (name.trim()) {
      onConfirm(name.trim(), categoryIcons[iconType]);
      setName("");
      setIconType("financial");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Document Category</DialogTitle>
          <DialogDescription>
            Add a new category to organize your documents.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category-name" className="text-right">
              Name
            </Label>
            <Input
              id="category-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="e.g., Financial Documents"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category-icon" className="text-right">
              Icon
            </Label>
            <Select value={iconType} onValueChange={(value: keyof typeof categoryIcons) => setIconType(value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="financial">💰 Financial</SelectItem>
                <SelectItem value="legal">⚖️ Legal</SelectItem>
                <SelectItem value="operational">👥 Operational</SelectItem>
                <SelectItem value="folder">📁 General</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!name.trim()}>
            Create Category
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function CreateItemDialog({ open, onOpenChange, type, onConfirm }: CreateItemDialogProps) {
  const [name, setName] = useState("");
  const [fileType, setFileType] = useState("pdf");

  const handleSubmit = () => {
    if (name.trim()) {
      onConfirm(name.trim(), type === "document" ? fileType : undefined);
      setName("");
      setFileType("pdf");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New {type === "folder" ? "Folder" : "Document"}</DialogTitle>
          <DialogDescription>
            {type === "folder" 
              ? "Create a new folder to organize your documents."
              : "Add a new document requirement to track."
            }
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="item-name" className="text-right">
              Name
            </Label>
            <Input
              id="item-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder={type === "folder" ? "e.g., Annual Reports" : "e.g., Audited Financials"}
            />
          </div>
          {type === "document" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="file-type" className="text-right">
                Type
              </Label>
              <Select value={fileType} onValueChange={setFileType}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="xlsx">Excel</SelectItem>
                  <SelectItem value="docx">Word</SelectItem>
                  <SelectItem value="txt">Text</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!name.trim()}>
            Create {type === "folder" ? "Folder" : "Document"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function RenameDialog({ open, onOpenChange, currentName, type, onConfirm }: RenameDialogProps) {
  const [name, setName] = useState(currentName);

  const handleSubmit = () => {
    if (name.trim() && name.trim() !== currentName) {
      onConfirm(name.trim());
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (isOpen) setName(currentName);
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rename {type}</DialogTitle>
          <DialogDescription>
            Enter a new name for this {type}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="rename-input" className="text-right">
              Name
            </Label>
            <Input
              id="rename-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!name.trim() || name.trim() === currentName}>
            Rename
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteDialog({ open, onOpenChange, itemName, type, onConfirm }: DeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {type}</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{itemName}"? 
            {type === "category" && " This will delete all documents and folders within this category."}
            {type === "folder" && " This will delete all documents within this folder."}
            {" "}This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-danger text-danger-foreground hover:bg-danger/90">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}