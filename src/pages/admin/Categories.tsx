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

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    
    if (categories.includes(newCategory.trim())) {
      toast({
        title: "Category Exists",
        description: "This category already exists.",
        variant: "destructive",
      });
      return;
    }
    
    addCategory(newCategory.trim());
    setNewCategory('');
    
    toast({
      title: "Category Added",
      description: `"${newCategory.trim()}" has been added to categories.`,
    });
  };

  const startEdit = (category: string) => {
    setEditingCategory(category);
    setEditValue(category);
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setEditValue('');
  };

  const saveEdit = () => {
    if (!editValue.trim() || editValue === editingCategory) {
      cancelEdit();
      return;
    }
    
    if (categories.includes(editValue.trim()) && editValue.trim() !== editingCategory) {
      toast({
        title: "Category Exists",
        description: "This category name already exists.",
        variant: "destructive",
      });
      return;
    }
    
    updateCategory(editingCategory!, editValue.trim());
    
    toast({
      title: "Category Updated",
      description: `Category updated to "${editValue.trim()}".`,
    });
    
    cancelEdit();
  };

  const handleDeleteCategory = (category: string) => {
    const productsInCategory = products.filter(p => p.category === category).length;
    
    const confirmMessage = productsInCategory > 0 
      ? `Are you sure you want to delete "${category}"? This will also delete ${productsInCategory} product(s) in this category.`
      : `Are you sure you want to delete "${category}"?`;
    
    if (window.confirm(confirmMessage)) {
      deleteCategory(category);
      
      toast({
        title: "Category Deleted",
        description: `"${category}" has been deleted.`,
      });
    }
  };

  const getProductCount = (category: string) => {
    return products.filter(p => p.category === category).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Categories</h1>
        <p className="text-muted-foreground">
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
          <form onSubmit={handleAddCategory} className="flex gap-4">
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
            <div className="flex items-end">
              <Button type="submit" variant="store">
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
              <div key={category} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Tag className="h-5 w-5 text-primary" />
                  <div>
                    {editingCategory === category ? (
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
                        <h3 className="font-medium text-foreground">{category}</h3>
                        <p className="text-sm text-muted-foreground">
                          {getProductCount(category)} product(s)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {editingCategory === category ? (
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
                        onClick={() => startEdit(category)} 
                        size="sm" 
                        variant="outline"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        onClick={() => handleDeleteCategory(category)} 
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