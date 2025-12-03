import { useProductStore, formatProductPrice } from "@/store/productStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import { Badge } from "@/components/ui/badge";
import ShopStats from "@/components/ShopStats";
import { 
  Package, 
  Users, 
  TrendingUp, 
  ShoppingCart, 
  Plus,
  Edit,
  Star,
  BarChart3
} from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { products, featuredProducts } = useProductStore();
  
  // Calculate stats
  const totalProducts = products.length;
  const inStockProducts = products.filter(p => p.in_stock).length;
  const outOfStockProducts = products.filter(p => !p.in_stock).length;
  const totalCategories = new Set(products.map(p => p.category_id)).size;
  const totalBrands = new Set(products.map(p => p.brand)).size;

  const recentProducts = products.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your electrical products and store operations
          </p>
        </div>
        <Link to="/admin/add-product" className="w-full sm:w-auto">
          <Button variant="store" size="sm" className="w-full sm:w-auto sm:size-lg">
            <Plus className="mr-1 sm:mr-2 h-4 sm:h-5 w-4 sm:w-5" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Stock</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{inStockProducts}</div>
            <p className="text-xs text-muted-foreground">
              Available products
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{outOfStockProducts}</div>
            <p className="text-xs text-muted-foreground">
              Need restocking
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCategories}</div>
            <p className="text-xs text-muted-foreground">
              {totalBrands} brands
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Products and Featured Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
        {/* Recent Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Products</CardTitle>
            <Link to="/admin/products">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentProducts.length > 0 ? (
              recentProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-2 sm:gap-4 p-2 sm:p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{formatProductPrice(product).display}</p>
                  </div>
                  <Badge variant={product.in_stock ? 'default' : 'destructive'} className="text-xs">
                    {product.in_stock ? 'In Stock' : 'Out of Stock'}
                  </Badge>
                  <Link to={`/admin/edit-product/${product.id}`}>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No products yet</p>
                <Link to="/admin/add-product">
                  <Button variant="outline" size="sm" className="mt-2">
                    Add Your First Product
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Featured Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Featured Products</CardTitle>
            <Link to="/admin/featured">
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-2 sm:gap-4 p-2 sm:p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{formatProductPrice(product).display}</p>
                  </div>
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No featured products</p>
                <Link to="/admin/featured">
                  <Button variant="outline" size="sm" className="mt-2">
                    Set Featured Products
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            <Link to="/admin/add-product">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <Plus className="h-6 w-6" />
                Add Product
              </Button>
            </Link>
            <Link to="/admin/categories">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <Package className="h-6 w-6" />
                Manage Categories
              </Button>
            </Link>
            <Link to="/admin/featured">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <Star className="h-6 w-6" />
                Featured Products
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;