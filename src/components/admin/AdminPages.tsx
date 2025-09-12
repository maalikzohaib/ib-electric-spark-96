import { useState, useEffect } from "react";
import { usePageStore, Page } from "@/store/pageStore";
import { Button } from "@/components/ui/enhanced-button";
import { Plus, Edit, Trash2, GripVertical } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface CreatePageModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'main' | 'sub';
}

interface EditPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  page: Page | null;
}

const EditPageModal = ({ isOpen, onClose, page }: EditPageModalProps) => {
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const { updatePage } = usePageStore();
  const { pages } = usePageStore();
  const mainPages = pages.filter(page => page.type === 'main');

  useEffect(() => {
    if (page) {
      setName(page.name);
      if (page.type === 'sub' && page.parent_id) {
        setParentId(page.parent_id);
      }
    }
  }, [page]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!page) return;
    
    if (!name.trim()) {
      toast.error("Page name is required");
      return;
    }

    if (page.type === 'sub' && !parentId) {
      toast.error("Please select parent page");
      return;
    }

    try {
      await updatePage(page.id, {
        name: name.trim(),
        ...(page.type === 'sub' ? { parent_id: parentId } : {})
      });
      toast.success("Page updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating page:", error);
      toast.error("Failed to update page");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Edit {page?.type === 'main' ? 'Main Page' : 'Subpage'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-name">
              {page?.type === 'main' ? 'Main Page Name' : 'Subpage Name'}
            </Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={`Enter ${page?.type === 'main' ? 'main page' : 'subpage'} name`}
              required
            />
          </div>
          
          {page?.type === 'sub' && (
            <div>
              <Label htmlFor="edit-parent">Select Parent Page</Label>
              <Select value={parentId} onValueChange={setParentId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Choose parent page" />
                </SelectTrigger>
                <SelectContent>
                  {mainPages.map((mainPage) => (
                    <SelectItem key={mainPage.id} value={mainPage.id}>
                      {mainPage.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="store">
              Update
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const CreatePageModal = ({ isOpen, onClose, type }: CreatePageModalProps) => {
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const { createMainPage, createSubPage, pages } = usePageStore();

  const mainPages = pages.filter(page => page.type === 'main');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Page name is required");
      return;
    }

    if (type === 'sub' && !parentId) {
      toast.error("Please select parent page");
      return;
    }

    try {
      if (type === 'main') {
        await createMainPage(name.trim());
      } else {
        await createSubPage(name.trim(), parentId);
      }
      toast.success(`${type === 'main' ? 'Main page' : 'Subpage'} created successfully!`);
      setName("");
      setParentId("");
      onClose();
    } catch (error) {
      console.error("Error creating page:", error);
      toast.error("Failed to create page");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create {type === 'main' ? 'Main Page' : 'Subpage'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">
              {type === 'main' ? 'Main Page Name' : 'Subpage Name'}
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={`Enter ${type === 'main' ? 'main page' : 'subpage'} name`}
              required
            />
          </div>
          
          {type === 'sub' && (
            <div>
              <Label htmlFor="parent">Select Parent Page</Label>
              <Select value={parentId} onValueChange={setParentId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Choose parent page" />
                </SelectTrigger>
                <SelectContent>
                  {mainPages.map((page) => (
                    <SelectItem key={page.id} value={page.id}>
                      {page.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="store">
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const AdminPages = () => {
  const [isMainPageModalOpen, setIsMainPageModalOpen] = useState(false);
  const [isSubPageModalOpen, setIsSubPageModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [pageToEdit, setPageToEdit] = useState<Page | null>(null);
  const [draggedPage, setDraggedPage] = useState<string | null>(null);
  const [expandedPages, setExpandedPages] = useState<Record<string, boolean>>({});
  const { pages, fetchPages, deletePage, getMainPagesWithChildren, reorderPages } = usePageStore();

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  const mainPagesWithChildren = getMainPagesWithChildren();

  const handleDeletePage = async (page: Page) => {
    // Check if this page has children
    const hasChildren = pages.some(p => p.parent_id === page.id);
    
    let confirmMessage = `Are you sure you want to delete "${page.name}"?`;
    let shouldDelete = false;
    let cascadeDelete = false;
    
    if (hasChildren) {
      const confirmChoice = window.confirm(
        `"${page.name}" has subpages. Do you want to delete all subpages as well?\n\n` +
        `Click OK to delete this page and all its subpages.\n` +
        `Click Cancel to cancel deletion.`
      );
      
      if (confirmChoice) {
        shouldDelete = true;
        cascadeDelete = true;
      }
    } else {
      // Add information about products
      confirmMessage = `Are you sure you want to delete "${page.name}"?\n\n` +
        `Note: If there are products associated with this page, they will be updated to have no page association.`;
      shouldDelete = window.confirm(confirmMessage);
    }
    
    if (shouldDelete) {
      try {
        await deletePage(page.id, cascadeDelete);
        toast.success(`${cascadeDelete ? 'Page and all subpages' : 'Page'} deleted successfully!`);
      } catch (error) {
        console.error("Error deleting page:", error);
        toast.error("Failed to delete page: " + (error as Error).message);
      }
    }
  };

  const handleEditPage = (page: Page) => {
    setPageToEdit(page);
    setIsEditModalOpen(true);
  };

  const handleDragStart = (pageId: string) => {
    setDraggedPage(pageId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (targetIndex: number) => {
    if (!draggedPage) return;
    
    const sourceIndex = mainPagesWithChildren.findIndex(page => page.id === draggedPage);
    if (sourceIndex === -1 || sourceIndex === targetIndex) return;
    
    try {
      // Create a new array with the reordered pages
      const reorderedPages = [...mainPagesWithChildren];
      const [movedPage] = reorderedPages.splice(sourceIndex, 1);
      reorderedPages.splice(targetIndex, 0, movedPage);
      
      // Call reorderPages with the full array of pages
      await reorderPages(reorderedPages);
      setDraggedPage(null);
    } catch (error) {
      console.error("Error reordering pages:", error);
      toast.error("Failed to reorder pages");
    }
  };

  return (
    <div className="container mx-auto py-2 space-y-3">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold">Pages Management</h1>
        <div className="flex flex-col xs:flex-row w-full sm:w-auto gap-2 xs:gap-1">
          <Button onClick={() => setIsMainPageModalOpen(true)} variant="store" size="sm" className="w-full xs:w-auto h-8 sm:h-7 text-xs py-0">
            <Plus className="mr-1 h-3 w-3" /> Add Main Page
          </Button>
          <Button onClick={() => setIsSubPageModalOpen(true)} variant="outline" size="sm" className="w-full xs:w-auto h-8 sm:h-7 text-xs py-0">
            <Plus className="mr-1 h-3 w-3" /> Add Subpage
          </Button>
        </div>
      </div>

      <div className="space-y-1">
        {mainPagesWithChildren.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            No pages found. Create your first page by clicking "Add Main Page".
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-3 max-h-[75vh] overflow-y-auto pr-1 w-full">
            {mainPagesWithChildren.map((mainPage, index) => {
              const isExpanded = expandedPages[mainPage.id] || false;
              const hasChildren = mainPage.children && mainPage.children.length > 0;
              
              const toggleExpand = () => {
                setExpandedPages(prev => ({
                  ...prev,
                  [mainPage.id]: !prev[mainPage.id]
                }));
              };
              
              return (
                <div 
                  key={mainPage.id}
                  className="border rounded-md p-4 sm:p-3 bg-white shadow-sm text-sm"
                  draggable
                  onDragStart={() => handleDragStart(mainPage.id)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(index)}
                >
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center">
                      <GripVertical className="h-3 w-3 text-gray-400 cursor-move mr-1" />
                      <h2 className="font-medium text-base">{mainPage.name}</h2>
                      {hasChildren && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0 ml-1"
                          onClick={toggleExpand}
                        >
                          {isExpanded ? '−' : '+'}
                        </Button>
                      )}
                    </div>
                    <div className="flex space-x-1 sm:space-x-0.5">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-7 w-7 p-0"
                        onClick={() => handleEditPage(mainPage)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-7 w-7 p-0"
                        onClick={() => handleDeletePage(mainPage)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>

                  {hasChildren && isExpanded && (
                    <div className="ml-4 mt-2 border-l border-gray-200 pl-3 space-y-2">
                      {mainPage.children.map((subPage) => (
                        <div key={subPage.id} className="flex items-center justify-between py-1 text-sm">
                          <span className="text-sm truncate max-w-[180px]">{subPage.name}</span>
                          <div className="flex space-x-0.5">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-6 w-6 p-0"
                              onClick={() => handleEditPage(subPage)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-6 w-6 p-0"
                              onClick={() => handleDeletePage(subPage)}
                            >
                              <Trash2 className="h-3 w-3 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      <CreatePageModal
        isOpen={isMainPageModalOpen}
        onClose={() => setIsMainPageModalOpen(false)}
        type="main"
      />
      <CreatePageModal
        isOpen={isSubPageModalOpen}
        onClose={() => setIsSubPageModalOpen(false)}
        type="sub"
      />
      <EditPageModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setPageToEdit(null);
        }}
        page={pageToEdit}
      />
    </div>
  );
};

export default AdminPages;