import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useProductStore } from "@/store/productStore";
import { Button } from "@/components/ui/enhanced-button";
import { Input } from "@/components/ui/input";
import SearchSuggestions from "@/components/ui/search-suggestions";
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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  useEffect(() => {
    const hasQuery = searchQuery.trim().length > 0;
    setShowSuggestions(hasQuery);
    if (!hasQuery) setHighlightedIndex(-1);
  }, [searchQuery]);

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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Products</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your product catalog
          </p>
        </div>
        <Link to="/admin/add-product" className="w-full sm:w-auto">
          <Button variant="store" className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <form onSubmit={handleSearch} className="flex flex-1">
              <div className="relative flex items-center w-full">
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-12 border focus:border-primary rounded-md"
                  onFocus={() => setShowSuggestions(filteredProducts.slice(0, 8).length > 0)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                  onKeyDown={(e) => {
                    const suggestions = filteredProducts.slice(0, 8);
                    if (suggestions.length === 0) return;
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      setHighlightedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
                    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
                      e.preventDefault();
                      const sel = suggestions[highlightedIndex];
                      window.location.href = `/product/${sel.id}`;
                    } else if (e.key === 'Escape') {
                      setShowSuggestions(false);
                    }
                  }}
                />
                <Button 
                  type="submit" 
                  variant="default" 
                  size="icon"
                  className="absolute right-1 h-8 w-8 bg-primary text-white rounded-md"
                >
                  <Search className="h-4 w-4" />
                </Button>
                <SearchSuggestions
                  items={filteredProducts.slice(0, 8)}
                  visible={showSuggestions}
                  highlightedIndex={highlightedIndex}
                  onHover={setHighlightedIndex}
                  onSelect={(item) => {
                    window.location.href = `/product/${item.id}`;
                  }}
                />
              </div>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
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
              
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
                <div className="flex gap-2 sm:gap-2">
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
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDelete(product.id, product.name)}
                  className="text-destructive hover:text-destructive mt-2 sm:mt-0 sm:w-auto"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  <span className="sm:hidden">Delete</span>
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
