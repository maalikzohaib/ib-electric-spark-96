import { useProductStore } from "@/store/productStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Package, TrendingUp, DollarSign, ShoppingCart } from "lucide-react";

const ShopStats = () => {
  const { products } = useProductStore();
  
  // Calculate statistics
  const totalProducts = products.length;
  const inStockProducts = products.filter(p => p.availability === 'In Stock').length;
  const avgPrice = products.length > 0 ? (products.reduce((sum, p) => sum + p.price, 0) / products.length) : 0;
  
  // Category distribution data
  const categoryData = products.reduce((acc, product) => {
    const existing = acc.find(item => item.name === product.category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: product.category, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Price range distribution
  const priceRanges = [
    { range: "₹0-500", min: 0, max: 500 },
    { range: "₹500-1000", min: 500, max: 1000 },
    { range: "₹1000-2000", min: 1000, max: 2000 },
    { range: "₹2000+", min: 2000, max: Infinity }
  ];

  const priceData = priceRanges.map(range => ({
    range: range.range,
    count: products.filter(p => p.price >= range.min && p.price < range.max).length
  }));

  // Brand distribution
  const brandData = products.reduce((acc, product) => {
    const existing = acc.find(item => item.name === product.brand);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: product.brand, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]).slice(0, 5); // Top 5 brands

  const COLORS = [
    'hsl(var(--primary))',
    'hsl(var(--secondary))',
    'hsl(var(--accent))',
    'hsl(var(--muted))',
    'hsl(var(--destructive))'
  ];

  const chartConfig = {
    count: {
      label: "Products",
      color: "hsl(var(--primary))",
    },
    value: {
      label: "Count",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {/* Stats Cards */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalProducts}</div>
          <p className="text-xs text-muted-foreground">
            Across all categories
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">In Stock</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inStockProducts}</div>
          <p className="text-xs text-muted-foreground">
            {totalProducts > 0 ? ((inStockProducts / totalProducts) * 100).toFixed(1) : 0}% availability
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Price</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{avgPrice.toFixed(0)}</div>
          <p className="text-xs text-muted-foreground">
            Per product
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Categories</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{categoryData.length}</div>
          <p className="text-xs text-muted-foreground">
            Product categories
          </p>
        </CardContent>
      </Card>

      {/* Charts */}
      {categoryData.length > 0 && (
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {priceData.some(d => d.count > 0) && (
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Price Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priceData}>
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ShopStats;