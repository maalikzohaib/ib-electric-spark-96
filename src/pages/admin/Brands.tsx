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
  Building2
} from "lucide-react";

const Brands = () => {
  const { brands, products, addBrand, updateBrand, deleteBrand } = useProductStore();
  const { toast } = useToast();
  
  const [newBrand, setNewBrand] = useState('');
  const [editingBrand, setEditingBrand] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleAddBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrand.trim()) return;
    
    if (brands.some(brand => brand.name.toLowerCase() === newBrand.trim().toLowerCase())) {
      toast({
        title: "Brand Exists",
        description: "This brand already exists.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await addBrand({ name: newBrand.trim() });
      setNewBrand('');
      
      toast({
        title: "Brand Added",
        description: `"${newBrand.trim()}" has been added to brands.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add brand. Please try again.",
        variant: "destructive",
      });
    }
  };

  const startEdit = (brandId: string, brandName: string) => {
    setEditingBrand(brandId);
    setEditValue(brandName);
  };

  const cancelEdit = () => {
    setEditingBrand(null);
    setEditValue('');
  };

  const saveEdit = async () => {
    if (!editValue.trim()) {
      cancelEdit();
      return;
    }
    
    const currentBrand = brands.find(b => b.id === editingBrand);
    if (!currentBrand || editValue === currentBrand.name) {
      cancelEdit();
      return;
    }
    
    if (brands.some(brand => brand.name.toLowerCase() === editValue.trim().toLowerCase() && brand.id !== editingBrand)) {
      toast({
        title: "Brand Exists",
        description: "This brand name already exists.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await updateBrand(editingBrand!, { name: editValue.trim() });
      
      toast({
        title: "Brand Updated",
        description: `Brand updated to "${editValue.trim()}".`,
      });
      
      cancelEdit();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update brand. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBrand = async (brandId: string, brandName: string) => {
    const productsWithBrand = products.filter(p => p.brand === brandName).length;
    
    const confirmMessage = productsWithBrand > 0 
      ? `Are you sure you want to delete "${brandName}"? There are ${productsWithBrand} product(s) using this brand. The products will keep their current brand text.`
      : `Are you sure you want to delete "${brandName}"?`;
    
    if (window.confirm(confirmMessage)) {
      try {
        await deleteBrand(brandId);
        
        toast({
          title: "Brand Deleted",
          description: `"${brandName}" has been deleted.`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete brand. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const getProductCount = (brandName: string) => {
    return products.filter(p => p.brand === brandName).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Brands</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage product brands for your store
        </p>
      </div>

      {/* Add New Brand */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Brand
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddBrand} className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <div className="flex-1">
              <Label htmlFor="new-brand">Brand Name</Label>
              <Input
                id="new-brand"
                value={newBrand}
                onChange={(e) => setNewBrand(e.target.value)}
                placeholder="Enter brand name (e.g., Samsung, LG, Philips)"
                required
              />
            </div>
            <div className="flex items-center sm:items-end mt-2 sm:mt-0">
              <Button type="submit" variant="store" className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Brand
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Brands List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Existing Brands ({brands.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {brands.map((brand) => (
              <div key={brand.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg">
                <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                  <Building2 className="h-5 w-5 text-primary" />
                  <div>
                    {editingBrand === brand.id ? (
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
                        <h3 className="font-medium text-foreground">{brand.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {getProductCount(brand.name)} product(s)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-end gap-2">
                  {editingBrand === brand.id ? (
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
                        onClick={() => startEdit(brand.id, brand.name)} 
                        size="sm" 
                        variant="outline"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        onClick={() => handleDeleteBrand(brand.id, brand.name)} 
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
            
            {brands.length === 0 && (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No brands yet
                </h3>
                <p className="text-muted-foreground">
                  Add your first brand to start organizing your products.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Brands;
