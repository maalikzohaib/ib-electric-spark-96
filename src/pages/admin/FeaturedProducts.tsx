import { useState } from "react";
import { useProductStore } from "@/store/productStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Star } from "lucide-react";

const FeaturedProducts = () => {
  const { products, featuredProducts, setFeaturedProducts } = useProductStore();
  const { toast } = useToast();
  const [selectedProducts, setSelectedProducts] = useState<string[]>(featuredProducts);

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

  const handleSave = () => {
    setFeaturedProducts(selectedProducts);
    toast({
      title: "Featured Products Updated",
      description: `${selectedProducts.length} products set as featured.`,
    });
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
                  src={product.mainImage}
                  alt={product.title}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">{product.title}</h3>
                  <p className="text-sm text-muted-foreground">{product.brand} • {product.category}</p>
                  <p className="text-sm font-medium text-primary">Rs. {product.price.toLocaleString()}</p>
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