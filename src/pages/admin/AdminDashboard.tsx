import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import { useProductStore } from "@/store/productStore";
import { Package, Plus, Star, TrendingUp } from "lucide-react";

const AdminDashboard = () => {
  const { products, getFeaturedProducts } = useProductStore();
  const featuredProducts = getFeaturedProducts();
  
  const totalProducts = products.length;
  const inStockProducts = products.filter(p => p.availability === 'In Stock').length;
  const outOfStockProducts = products.filter(p => p.availability === 'Out of Stock').length;
  const fansCount = products.filter(p => p.category === 'Fans').length;
  const bulbsCount = products.filter(p => p.category === 'Bulbs').length;

  const stats = [
    {
      title: "Total Products",
      value: totalProducts,
      icon: <Package className="h-6 w-6 text-primary" />,
      color: "bg-primary/10"
    },
    {
      title: "In Stock",
      value: inStockProducts,
      icon: <TrendingUp className="h-6 w-6 text-success" />,
      color: "bg-success/10"
    },
    {
      title: "Out of Stock",
      value: outOfStockProducts,
      icon: <Package className="h-6 w-6 text-destructive" />,
      color: "bg-destructive/10"
    },
    {
      title: "Featured",
      value: featuredProducts.length,
      icon: <Star className="h-6 w-6 text-accent" />,
      color: "bg-accent/10"
    }
  ];

  const categoryStats = [
    { name: "Fans", count: fansCount },
    { name: "Bulbs", count: bulbsCount }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to the IB Electric Store admin panel
          </p>
        </div>
        <Link to="/admin/add-product">
          <Button variant="store">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-elegant transition-all duration-300">
            <CardContent className="flex items-center p-6">
              <div className={`p-3 rounded-full mr-4 ${stat.color}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/admin/add-product" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Add New Product
              </Button>
            </Link>
            <Link to="/admin/products" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Package className="h-4 w-4 mr-2" />
                Manage Products
              </Button>
            </Link>
            <Link to="/admin/featured" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Star className="h-4 w-4 mr-2" />
                Set Featured Products
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Category Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Category Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryStats.map((category) => (
                <div key={category.name} className="flex items-center justify-between">
                  <span className="font-medium text-foreground">{category.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground">{category.count} products</span>
                    <Link to={`/admin/products?category=${category.name}`}>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Products */}
      {products.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {products.slice(-5).reverse().map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <img
                      src={product.mainImage}
                      alt={product.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium text-foreground">{product.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.brand} • {product.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">Rs. {product.price.toLocaleString()}</p>
                    <p className={`text-sm ${
                      product.availability === 'In Stock' ? 'text-success' : 'text-destructive'
                    }`}>
                      {product.availability}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminDashboard;