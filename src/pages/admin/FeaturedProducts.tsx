import { useState } from "react";
import { useProductStore } from "@/store/productStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Star } from "lucide-react";

const FeaturedProducts = () => {
  const { products, featuredProducts, setFeaturedProduct } = useProductStore();
  const { toast } = useToast();
  const [selectedProducts, setSelectedProducts] = useState<string[]>(
    featuredProducts.map(p => p.id)
  );

  const handleProductToggle = (productId: string) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else if (prev.length < 3) {
        return [...prev, productId];
      } else {
        toast({
          title: "Maximum Reached",
          description: "You can only select up to 3 featured products.",
          variant: "destructive",
        });
        return prev;
      }
    });
  };

  const handleSave = async () => {
    try {
      // Update featured status for all products
      for (const product of products) {
        const shouldBeFeatured = selectedProducts.includes(product.id);
        if (product.featured !== shouldBeFeatured) {
          await setFeaturedProduct(product.id, shouldBeFeatured);
        }
      }
      
      toast({
        title: "Featured Products Updated",
        description: `${selectedProducts.length} products set as featured.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update featured products.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Featured Products</h1>
        <p className="text-muted-foreground">
          Select up to 3 products to feature on the homepage
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Select Featured Products ({selectedProducts.length}/3)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products.map((product) => (
              <div key={product.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                <Checkbox
                  checked={selectedProducts.includes(product.id)}
                  onCheckedChange={() => handleProductToggle(product.id)}
                />
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.brand} • {useProductStore.getState().categories.find(c => c.id === product.category_id)?.name || 'Unknown'}</p>
                  <p className="text-sm font-medium text-primary">PKR {product.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end mt-6">
            <Button onClick={handleSave} variant="store">
              Save Featured Products
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeaturedProducts;