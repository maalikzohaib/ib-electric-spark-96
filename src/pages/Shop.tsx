import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useProductStore } from "@/store/productStore";
import { useProductData } from "@/hooks/useProductData";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { X, Filter, Search, Zap, ShoppingBag, Package } from "lucide-react";
import { Button } from "@/components/ui/enhanced-button";
import shopHeroBg from "@/assets/shop-hero-bg.jpg";
import electricalPattern from "@/assets/electrical-pattern.jpg";
import emptyCart from "@/assets/empty-cart.jpg";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, categories } = useProductStore();
  const { loading } = useProductData();
  
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'all',
    brand: searchParams.get('brand') || '',
    availability: searchParams.get('availability') || 'all',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
  });

  const [showFilters, setShowFilters] = useState(false);

  // Update filters when URL params change
  useEffect(() => {
    setFilters({
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || 'all',
      brand: searchParams.get('brand') || '',
      availability: searchParams.get('availability') || 'all',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
    });
  }, [searchParams]);

  // Transform categories for filtering
  const categoryOptions = categories.map(cat => ({ id: cat.id, name: cat.name }));
  
  // Filter products based on current filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = !filters.search || 
      product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      product.brand.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesCategory = filters.category === 'all' || product.category_id === filters.category;
    const matchesBrand = !filters.brand || product.brand.toLowerCase().includes(filters.brand.toLowerCase());
    const matchesAvailability = filters.availability === 'all' || 
      (filters.availability === 'In Stock' ? product.in_stock : !product.in_stock);
    
    const matchesPrice = (!filters.minPrice || product.price >= parseFloat(filters.minPrice)) &&
                        (!filters.maxPrice || product.price <= parseFloat(filters.maxPrice));

    return matchesSearch && matchesCategory && matchesBrand && matchesAvailability && matchesPrice;
  });

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => 
    value && value !== 'all'
  ).length;
  const uniqueBrands = [...new Set(products.map(p => p.brand))];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div 
        className="relative h-80 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${shopHeroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/80" />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="text-center w-full">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in">
              Electrical Excellence
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Discover premium electrical products for your home and business
            </p>
            <div className="flex items-center justify-center">
              <Zap className="h-8 w-8 text-accent mr-3" />
              <span className="text-white text-lg font-medium">Quality • Innovation • Trust</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <form onSubmit={(e) => { e.preventDefault(); }}>
              <div className="relative flex items-center w-full">
                <Input
                  placeholder="Search for electrical products, brands, categories..."
                  value={filters.search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                  className="pr-12 h-12 text-base border focus:border-primary shadow-md rounded-md"
                />
                <Button 
                  type="submit" 
                  variant="default" 
                  size="icon"
                  className="absolute right-1 h-10 w-10 bg-primary text-white rounded-md"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </form>
          </div>
        </div>


        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-80">
            <div className="sticky top-24">
              {/* Mobile Filter Toggle */}
              <div className="lg:hidden mb-4">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full h-12"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                </Button>
              </div>

              {/* Filter Panel */}
              <div className={`bg-card rounded-xl border shadow-elegant p-6 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-xl text-foreground flex items-center">
                    <Filter className="h-5 w-5 mr-2 text-primary" />
                    Filters
                  </h2>
                  {activeFiltersCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      <X className="h-4 w-4 mr-1" />
                      Clear All
                    </Button>
                  )}
                </div>

                {/* Category */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground flex items-center">
                    <Package className="h-4 w-4 mr-2 text-primary" />
                    Category
                  </label>
                  <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categoryOptions.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Brand */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground">
                    Brand
                  </label>
                  <Input
                    placeholder="Search by brand..."
                    value={filters.brand}
                    onChange={(e) => updateFilter('brand', e.target.value)}
                    className="h-12"
                  />
                  {uniqueBrands.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {uniqueBrands.slice(0, 5).map((brand) => (
                        <Badge
                          key={brand}
                          variant="outline"
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                          onClick={() => updateFilter('brand', brand)}
                        >
                          {brand}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price Range */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground">
                    Price Range
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      type="number"
                      placeholder="Min ₹"
                      value={filters.minPrice}
                      onChange={(e) => updateFilter('minPrice', e.target.value)}
                      className="h-12"
                    />
                    <Input
                      type="number"
                      placeholder="Max ₹"
                      value={filters.maxPrice}
                      onChange={(e) => updateFilter('maxPrice', e.target.value)}
                      className="h-12"
                    />
                  </div>
                </div>

                {/* Availability */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground">
                    Availability
                  </label>
                  <Select value={filters.availability} onValueChange={(value) => updateFilter('availability', value)}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="All Products" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Products</SelectItem>
                      <SelectItem value="In Stock">In Stock</SelectItem>
                      <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Decorative Element */}
                <div 
                  className="h-32 rounded-lg bg-cover bg-center opacity-20"
                  style={{ backgroundImage: `url(${electricalPattern})` }}
                />
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {filteredProducts.length} Products Found
                </h2>
                <p className="text-muted-foreground">
                  {activeFiltersCount > 0 ? 'Filtered results' : 'Showing all products'}
                </p>
              </div>
              
              {/* Active Filters */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2">
                  {filters.search && (
                    <Badge variant="secondary" className="px-3 py-1">
                      Search: {filters.search}
                      <X 
                        className="h-3 w-3 ml-2 cursor-pointer" 
                        onClick={() => updateFilter('search', '')}
                      />
                    </Badge>
                  )}
                  {filters.category && filters.category !== 'all' && (
                    <Badge variant="secondary" className="px-3 py-1">
                      Category: {filters.category}
                      <X 
                        className="h-3 w-3 ml-2 cursor-pointer" 
                        onClick={() => updateFilter('category', 'all')}
                      />
                    </Badge>
                  )}
                  {filters.brand && (
                    <Badge variant="secondary" className="px-3 py-1">
                      Brand: {filters.brand}
                      <X 
                        className="h-3 w-3 ml-2 cursor-pointer" 
                        onClick={() => updateFilter('brand', '')}
                      />
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Products Grid */}
            {loading ? (
              <div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
                aria-busy="true"
                aria-label="Loading products"
              >
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-96 bg-card rounded-lg animate-pulse" role="presentation"></div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-2 sm:px-0"
                role="region"
                aria-label="Products grid"
              >
                {filteredProducts.map((product) => (
                  <div key={product.id} className="animate-fade-in hover-scale">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div 
                className="text-center py-16"
                role="region"
                aria-label="No products found"
              >
                <img 
                  src={emptyCart} 
                  alt="No products found" 
                  className="w-32 h-32 mx-auto mb-6 opacity-50"
                />
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  No Products Found
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
                </p>
                <Button 
                  variant="outline" 
                  onClick={clearFilters} 
                  className="px-8"
                  aria-label="Clear all filters"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;