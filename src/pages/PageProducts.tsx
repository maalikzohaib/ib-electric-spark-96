import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductStore } from '@/store/productStore';
import { usePageStore } from '@/store/pageStore';
import { Button } from '@/components/ui/enhanced-button';
import SearchSuggestions from '@/components/ui/search-suggestions';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Zap } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PageProducts = () => {
  const { mainPageSlug, subPageSlug } = useParams<{ mainPageSlug: string, subPageSlug: string }>();
  const navigate = useNavigate();
  const { products } = useProductStore();
  const { pages, fetchPages } = usePageStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [loading, setLoading] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  useEffect(() => {
    const loadData = async () => {
      await fetchPages();
      setLoading(false);
    };
    loadData();
  }, [fetchPages]);

  // Find the current page by matching the subpage slug
  const currentPage = pages.find(page => page.slug === subPageSlug);
  
  // Find the parent page to verify the URL structure is correct
  const parentPage = currentPage?.parent_id ? pages.find(page => page.id === currentPage.parent_id) : null;
  const isValidUrl = parentPage?.slug === mainPageSlug;
  
  // Filter products by page_id if the URL structure is valid
  const pageProducts = (currentPage && isValidUrl) ? products.filter(product => product.page_id === currentPage.id) : [];
  
  // Apply search and sort filters
  const filteredProducts = pageProducts
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'brand':
          return a.brand.localeCompare(b.brand);
        default:
          return a.name.localeCompare(b.name);
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-card rounded w-1/3"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 bg-card rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentPage || !isValidUrl) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Page Not Found</h1>
          <p className="text-muted-foreground mb-8">The page you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/shop')} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const hasQuery = searchTerm.trim().length > 0;
    setShowSuggestions(hasQuery);
    if (!hasQuery) setHighlightedIndex(-1);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              onClick={() => navigate('/shop')} 
              variant="outline" 
              size="sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shop
            </Button>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {currentPage.name}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover our {currentPage.name.toLowerCase()} products
            </p>
            <div className="flex items-center justify-center">
              <Zap className="h-8 w-8 text-accent mr-3" />
              <span className="text-foreground text-lg font-medium">
                {filteredProducts.length} Products Available
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter Controls */}
        <Card className="mb-8">
          <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                  onFocus={() => setShowSuggestions(searchTerm.trim().length > 0)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                  onKeyDown={(e) => {
                    const suggestions = pageProducts
                      .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || (p.brand || '').toLowerCase().includes(searchTerm.toLowerCase()))
                      .slice(0, 8);
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
                <SearchSuggestions
                  items={pageProducts
                    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || (p.brand || '').toLowerCase().includes(searchTerm.toLowerCase()))
                    .slice(0, 8)
                  }
                  visible={showSuggestions}
                  highlightedIndex={highlightedIndex}
                  onHover={setHighlightedIndex}
                  onSelect={(item) => {
                    window.location.href = `/product/${item.id}`;
                  }}
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                    <SelectItem value="price-low">Price (Low to High)</SelectItem>
                    <SelectItem value="price-high">Price (High to Low)</SelectItem>
                    <SelectItem value="brand">Brand</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {filteredProducts.length} Products Found
            </h2>
            <p className="text-muted-foreground">
              {searchTerm ? `Filtered results for "${searchTerm}"` : `All products in ${currentPage.name}`}
            </p>
          </div>
          
          {searchTerm && (
            <Badge variant="secondary" className="px-3 py-1">
              Search: {searchTerm}
            </Badge>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="animate-fade-in hover-scale">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Zap className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {searchTerm ? 'No Products Found' : 'No Products Available'}
            </h3>
            <p className="text-muted-foreground mb-8">
              {searchTerm 
                ? `No products match your search "${searchTerm}" in ${currentPage.name}`
                : `No products have been added to ${currentPage.name} yet.`
              }
            </p>
            {searchTerm && (
              <Button 
                onClick={() => setSearchTerm('')} 
                variant="outline"
              >
                Clear Search
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageProducts;
