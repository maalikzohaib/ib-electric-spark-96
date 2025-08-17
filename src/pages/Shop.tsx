import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useProductStore } from "@/store/productStore";
import ProductCard from "@/components/ProductCard";
import ShopStats from "@/components/ShopStats";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Filter, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/enhanced-button";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, categories } = useProductStore();
  
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'all',
    brand: searchParams.get('brand') || '',
    availability: searchParams.get('availability') || 'all',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
  });

  const [showFilters, setShowFilters] = useState(false);
  const [showStats, setShowStats] = useState(false);

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

  // Filter products based on current filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = !filters.search || 
      product.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      product.brand.toLowerCase().includes(filters.search.toLowerCase()) ||
      product.category.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesCategory = filters.category === 'all' || product.category === filters.category;
    const matchesBrand = !filters.brand || product.brand.toLowerCase().includes(filters.brand.toLowerCase());
    const matchesAvailability = filters.availability === 'all' || product.availability === filters.availability;
    
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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Shop</h1>
              <p className="text-muted-foreground">
                Discover our complete range of electrical products
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowStats(!showStats)}
              className="flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              {showStats ? 'Hide' : 'Show'} Analytics
            </Button>
          </div>
        </div>

        {/* Analytics Section */}
        {showStats && <ShopStats />}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-80">
            <div className="sticky top-24">
              {/* Mobile Filter Toggle */}
              <div className="lg:hidden mb-4">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                </Button>
              </div>

              {/* Filter Panel */}
              <div className={`bg-card rounded-lg border p-6 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-foreground">Filters</h2>
                  {activeFiltersCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      <X className="h-4 w-4 mr-1" />
                      Clear
                    </Button>
                  )}
                </div>

                {/* Search */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Search Products
                  </label>
                  <Input
                    placeholder="Search by name, brand..."
                    value={filters.search}
                    onChange={(e) => updateFilter('search', e.target.value)}
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Category
                  </label>
                  <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.filter(category => category.trim() !== '').map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Brand */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Brand
                  </label>
                  <Input
                    placeholder="Search by brand..."
                    value={filters.brand}
                    onChange={(e) => updateFilter('brand', e.target.value)}
                  />
                  {uniqueBrands.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {uniqueBrands.slice(0, 5).map((brand) => (
                        <Badge
                          key={brand}
                          variant="outline"
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                          onClick={() => updateFilter('brand', brand)}
                        >
                          {brand}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Price Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => updateFilter('minPrice', e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => updateFilter('maxPrice', e.target.value)}
                    />
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Availability
                  </label>
                  <Select value={filters.availability} onValueChange={(value) => updateFilter('availability', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Products" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Products</SelectItem>
                      <SelectItem value="In Stock">In Stock</SelectItem>
                      <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
              </p>
              
              {/* Active Filters */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2">
                  {filters.search && (
                    <Badge variant="secondary">
                      Search: {filters.search}
                      <X 
                        className="h-3 w-3 ml-1 cursor-pointer" 
                        onClick={() => updateFilter('search', '')}
                      />
                    </Badge>
                  )}
                  {filters.category && filters.category !== 'all' && (
                    <Badge variant="secondary">
                      Category: {filters.category}
                      <X 
                        className="h-3 w-3 ml-1 cursor-pointer" 
                        onClick={() => updateFilter('category', 'all')}
                      />
                    </Badge>
                  )}
                  {filters.brand && (
                    <Badge variant="secondary">
                      Brand: {filters.brand}
                      <X 
                        className="h-3 w-3 ml-1 cursor-pointer" 
                        onClick={() => updateFilter('brand', '')}
                      />
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No products found matching your criteria.
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
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