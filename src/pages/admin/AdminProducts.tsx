import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useProductStore } from "@/store/productStore";
import { Button } from "@/components/ui/enhanced-button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Eye 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminProducts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, deleteProduct } = useProductStore();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || 'all');

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || product.category_id === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const handleDelete = (productId: string, productName: string) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      deleteProduct(productId);
      toast({
        title: "Product Deleted",
        description: `${productName} has been removed from the store.`,
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchQuery) {
      newParams.set('search', searchQuery);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground">
            Manage your product catalog
          </p>
        </div>
        <Link to="/admin/add-product">
          <Button variant="store">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex flex-1 gap-2">
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" variant="outline">
                <Search className="h-4 w-4" />
              </Button>
            </form>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {useProductStore.getState().categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-elegant transition-all duration-300">
            <div className="relative">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-40 object-cover"
              />
              <Badge 
                variant={product.in_stock ? 'default' : 'destructive'}
                className="absolute top-2 right-2"
              >
                {product.in_stock ? 'In Stock' : 'Out of Stock'}
              </Badge>
            </div>
            
            <CardContent className="p-4">
              <div className="space-y-2 mb-4">
                <h3 className="font-semibold text-foreground line-clamp-2 text-sm">
                  {product.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {product.brand}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary text-sm">
                    PKR {product.price.toLocaleString()}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {useProductStore.getState().categories.find(c => c.id === product.category_id)?.name || 'Unknown'}
                  </Badge>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Link to={`/product/${product.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                </Link>
                <Link to={`/admin/edit-product/${product.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDelete(product.id, product.name)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No products found
            </h3>
            <p className="text-muted-foreground mb-4">
              {products.length === 0 
                ? "You haven't added any products yet." 
                : "No products match your current filters."
              }
            </p>
            {products.length === 0 ? (
              <Link to="/admin/add-product">
                <Button variant="store">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Product
                </Button>
              </Link>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('all');
                  setSearchParams({});
                }}
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminProducts;