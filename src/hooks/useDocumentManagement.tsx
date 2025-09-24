import { useState, useCallback } from "react";

export interface Document {
  id: string;
  name: string;
  status: "uploaded" | "pending" | "overdue";
  type: string;
}

export interface FolderItem {
  id: string;
  name: string;
  type: "folder" | "document";
  children?: FolderItem[];
  document?: Document;
}

export interface DocumentCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  required: number;
  uploaded: number;
  status: "completed" | "in-progress" | "pending";
  folderStructure: FolderItem[];
}

export function useDocumentManagement(initialCategories: DocumentCategory[]) {
  const [categories, setCategories] = useState<DocumentCategory[]>(initialCategories);
  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(new Set());
  const [draggedItem, setDraggedItem] = useState<{ item: FolderItem; categoryId: string } | null>(null);

  const updateCategoryStats = useCallback((categoryId: string) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== categoryId) return cat;
      
      const flattenDocuments = (items: FolderItem[]): Document[] => {
        const docs: Document[] = [];
        const traverse = (items: FolderItem[]) => {
          items.forEach(item => {
            if (item.type === "document" && item.document) {
              docs.push(item.document);
            } else if (item.type === "folder" && item.children) {
              traverse(item.children);
            }
          });
        };
        traverse(items);
        return docs;
      };

      const allDocs = flattenDocuments(cat.folderStructure);
      const uploadedCount = allDocs.filter(doc => doc.status === "uploaded").length;
      const status = uploadedCount === cat.required ? "completed" : uploadedCount > 0 ? "in-progress" : "pending";

      return {
        ...cat,
        uploaded: uploadedCount,
        status
      };
    }));
  }, []);

  const createCategory = useCallback((name: string, icon: React.ReactNode) => {
    const newCategory: DocumentCategory = {
      id: `cat-${Date.now()}`,
      name,
      icon,
      required: 0,
      uploaded: 0,
      status: "pending",
      folderStructure: []
    };
    setCategories(prev => [...prev, newCategory]);
    return newCategory.id;
  }, []);

  const deleteCategory = useCallback((categoryId: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
  }, []);

  const renameCategory = useCallback((categoryId: string, newName: string) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId ? { ...cat, name: newName } : cat
    ));
  }, []);

  const createFolder = useCallback((categoryId: string, parentId: string | null, name: string) => {
    const newFolder: FolderItem = {
      id: `folder-${Date.now()}`,
      name,
      type: "folder",
      children: []
    };

    setCategories(prev => prev.map(cat => {
      if (cat.id !== categoryId) return cat;

      const addFolder = (items: FolderItem[]): FolderItem[] => {
        if (parentId === null) {
          return [...items, newFolder];
        }
        return items.map(item => {
          if (item.id === parentId && item.type === "folder") {
            return { ...item, children: [...(item.children || []), newFolder] };
          } else if (item.children) {
            return { ...item, children: addFolder(item.children) };
          }
          return item;
        });
      };

      return { ...cat, folderStructure: addFolder(cat.folderStructure) };
    }));
  }, []);

  const createDocument = useCallback((categoryId: string, parentId: string | null, name: string, type: string) => {
    const newDocument: Document = {
      id: `doc-${Date.now()}`,
      name,
      status: "pending",
      type
    };

    const newDocumentItem: FolderItem = {
      id: `item-${Date.now()}`,
      name,
      type: "document",
      document: newDocument
    };

    setCategories(prev => prev.map(cat => {
      if (cat.id !== categoryId) return cat;

      const addDocument = (items: FolderItem[]): FolderItem[] => {
        if (parentId === null) {
          return [...items, newDocumentItem];
        }
        return items.map(item => {
          if (item.id === parentId && item.type === "folder") {
            return { ...item, children: [...(item.children || []), newDocumentItem] };
          } else if (item.children) {
            return { ...item, children: addDocument(item.children) };
          }
          return item;
        });
      };

      const updatedCat = { ...cat, folderStructure: addDocument(cat.folderStructure), required: cat.required + 1 };
      return updatedCat;
    }));

    setTimeout(() => updateCategoryStats(categoryId), 0);
  }, [updateCategoryStats]);

  const deleteItem = useCallback((categoryId: string, itemId: string) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== categoryId) return cat;

      const removeItem = (items: FolderItem[]): FolderItem[] => {
        return items.filter(item => {
          if (item.id === itemId) return false;
          if (item.children) {
            item.children = removeItem(item.children);
          }
          return true;
        });
      };

      return { ...cat, folderStructure: removeItem(cat.folderStructure) };
    }));

    setTimeout(() => updateCategoryStats(categoryId), 0);
  }, [updateCategoryStats]);

  const renameItem = useCallback((categoryId: string, itemId: string, newName: string) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== categoryId) return cat;

      const updateItem = (items: FolderItem[]): FolderItem[] => {
        return items.map(item => {
          if (item.id === itemId) {
            if (item.type === "document" && item.document) {
              return { ...item, name: newName, document: { ...item.document, name: newName } };
            }
            return { ...item, name: newName };
          } else if (item.children) {
            return { ...item, children: updateItem(item.children) };
          }
          return item;
        });
      };

      return { ...cat, folderStructure: updateItem(cat.folderStructure) };
    }));
  }, []);

  const moveItems = useCallback((sourceCategory: string, targetCategory: string, itemIds: string[]) => {
    const itemsToMove: FolderItem[] = [];
    
    // First, collect items to move
    setCategories(prev => {
      const sourceCat = prev.find(cat => cat.id === sourceCategory);
      if (!sourceCat) return prev;

      const collectItems = (items: FolderItem[]) => {
        return items.filter(item => {
          if (itemIds.includes(item.id)) {
            itemsToMove.push(item);
            return false;
          }
          if (item.children) {
            item.children = collectItems(item.children);
          }
          return true;
        });
      };

      return prev.map(cat => {
        if (cat.id === sourceCategory) {
          return { ...cat, folderStructure: collectItems(cat.folderStructure) };
        }
        return cat;
      });
    });

    // Then add items to target category
    if (itemsToMove.length > 0) {
      setCategories(prev => prev.map(cat => {
        if (cat.id === targetCategory) {
          return { ...cat, folderStructure: [...cat.folderStructure, ...itemsToMove] };
        }
        return cat;
      }));

      setTimeout(() => {
        updateCategoryStats(sourceCategory);
        updateCategoryStats(targetCategory);
      }, 0);
    }

    setSelectedDocuments(new Set());
  }, [updateCategoryStats]);

  const toggleDocumentSelection = useCallback((documentId: string) => {
    setSelectedDocuments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(documentId)) {
        newSet.delete(documentId);
      } else {
        newSet.add(documentId);
      }
      return newSet;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedDocuments(new Set());
  }, []);

  return {
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
    clearSelection,
    updateCategoryStats
  };
}