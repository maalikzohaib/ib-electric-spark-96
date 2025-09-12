import { useState } from "react";
import { useProductStore } from "@/store/productStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  Tag
} from "lucide-react";

const Categories = () => {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useProductStore();
  const { toast } = useToast();
  
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    
    if (categories.some(cat => cat.name === newCategory.trim())) {
      toast({
        title: "Category Exists",
        description: "This category already exists.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await addCategory({ name: newCategory.trim() });
      setNewCategory('');
      
      toast({
        title: "Category Added",
        description: `"${newCategory.trim()}" has been added to categories.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add category. Please try again.",
        variant: "destructive",
      });
    }
  };

  const startEdit = (categoryId: string, categoryName: string) => {
    setEditingCategory(categoryId);
    setEditValue(categoryName);
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setEditValue('');
  };

  const saveEdit = async () => {
    if (!editValue.trim()) {
      cancelEdit();
      return;
    }
    
    const currentCategory = categories.find(c => c.id === editingCategory);
    if (!currentCategory || editValue === currentCategory.name) {
      cancelEdit();
      return;
    }
    
    if (categories.some(cat => cat.name === editValue.trim() && cat.id !== editingCategory)) {
      toast({
        title: "Category Exists",
        description: "This category name already exists.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await updateCategory(editingCategory!, { name: editValue.trim() });
      
      toast({
        title: "Category Updated",
        description: `Category updated to "${editValue.trim()}".`,
      });
      
      cancelEdit();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update category. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = async (categoryId: string, categoryName: string) => {
    const productsInCategory = products.filter(p => p.category_id === categoryId).length;
    
    const confirmMessage = productsInCategory > 0 
      ? `Are you sure you want to delete "${categoryName}"? This will also delete ${productsInCategory} product(s) in this category.`
      : `Are you sure you want to delete "${categoryName}"?`;
    
    if (window.confirm(confirmMessage)) {
      try {
        await deleteCategory(categoryId);
        
        toast({
          title: "Category Deleted",
          description: `"${categoryName}" has been deleted.`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete category. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const getProductCount = (categoryId: string) => {
    return products.filter(p => p.category_id === categoryId).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Categories</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage product categories for your store
        </p>
      </div>

      {/* Add New Category */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <div className="flex-1">
              <Label htmlFor="new-category">Category Name</Label>
              <Input
                id="new-category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter category name"
                required
              />
            </div>
            <div className="flex items-center sm:items-end mt-2 sm:mt-0">
              <Button type="submit" variant="store" className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Categories List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Existing Categories ({categories.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg">
                <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                  <Tag className="h-5 w-5 text-primary" />
                  <div>
                    {editingCategory === category.id ? (
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-48"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit();
                          if (e.key === 'Escape') cancelEdit();
                        }}
                        autoFocus
                      />
                    ) : (
                      <div>
                        <h3 className="font-medium text-foreground">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {getProductCount(category.id)} product(s)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-end gap-2">
                  {editingCategory === category.id ? (
                    <>
                      <Button onClick={saveEdit} size="sm" variant="outline">
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button onClick={cancelEdit} size="sm" variant="outline">
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        onClick={() => startEdit(category.id, category.name)} 
                        size="sm" 
                        variant="outline"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        onClick={() => handleDeleteCategory(category.id, category.name)} 
                        size="sm" 
                        variant="outline"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
            
            {categories.length === 0 && (
              <div className="text-center py-12">
                <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No categories yet
                </h3>
                <p className="text-muted-foreground">
                  Add your first category to start organizing your products.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Categories;