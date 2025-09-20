import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Menu, X, ChevronDown, ChevronRight, Heart, ShoppingCart, Plus } from "lucide-react";
import { Button } from "@/components/ui/enhanced-button";
import { Input } from "@/components/ui/input";
import { usePageStore } from "@/store/pageStore";
import { useFavoriteStore } from "@/store/favoriteStore";
import { useCartStore } from "@/store/cartStore";
import { cn } from "@/lib/utils";
import { useProductStore } from "@/store/productStore";
import SearchSuggestions from "@/components/ui/search-suggestions";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredPage, setHoveredPage] = useState<string | null>(null);
  const [isShopHovered, setIsShopHovered] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [expandedMobileItems, setExpandedMobileItems] = useState<string[]>([]);
  const shopDropdownRef = useRef<HTMLDivElement>(null);
  const shopButtonRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const location = useLocation();
  const { fetchPages, getMainPagesWithChildren } = usePageStore();
  const favoriteStore = useFavoriteStore();
  const cartStore = useCartStore();
  const { products } = useProductStore();

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);
  
  // Handle click outside to close dropdown and search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        shopDropdownRef.current && 
        shopButtonRef.current &&
        !shopDropdownRef.current.contains(event.target as Node) &&
        !shopButtonRef.current.contains(event.target as Node)
      ) {
        handleShopMouseLeave();
      }
      
      // Close search when clicking outside
      if (isSearchOpen) {
        const container = searchContainerRef.current;
        if (container && !container.contains(event.target as Node)) {
          setIsSearchOpen(false);
        }
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen]);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const mainPagesWithChildren = getMainPagesWithChildren();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const computedSuggestions = (() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [] as { id: string; name: string; brand?: string; image_url?: string; price?: number }[];
    const matches = products.filter(p =>
      p.name.toLowerCase().includes(q) || (p.brand || '').toLowerCase().includes(q)
    );
    return matches.slice(0, 8);
  })();

  useEffect(() => {
    // Show suggestion container as soon as user types; component hides itself if no items
    const hasQuery = searchQuery.trim().length > 0;
    setShowSuggestions(hasQuery);
    if (!hasQuery) setHighlightedIndex(-1);
  }, [searchQuery]);
  
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    // Focus the input when search is opened
    if (!isSearchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  };
  
  const handleShopMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsShopHovered(true);
  };
  
  const handleShopMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsShopHovered(false);
      closeTimeoutRef.current = null;
    }, 300); // 300ms delay before closing the dropdown
  };
  
  const toggleMobileItem = (itemId: string) => {
    setExpandedMobileItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId) 
        : [...prev, itemId]
    );
  };

  return (
    <header className="bg-background shadow-card border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {
          isSearchOpen && (
            <div className="flex items-center h-16 animate-slide-down-quick">
              <div ref={searchContainerRef} className="w-full relative">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <Input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-12 w-full pr-12 rounded-md border focus:border-input focus-visible:ring-0 focus-visible:ring-offset-0"
                    onFocus={() => setShowSuggestions(searchQuery.trim().length > 0)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                    onKeyDown={(e) => {
                      const hasItems = computedSuggestions.length > 0;
                      if (!hasItems) {
                        if (e.key === 'Enter') handleSearch(e);
                        return;
                      }
                      if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        setHighlightedIndex((prev) => Math.min(prev + 1, computedSuggestions.length - 1));
                      } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        setHighlightedIndex((prev) => Math.max(prev - 1, 0));
                      } else if (e.key === 'Enter') {
                        e.preventDefault();
                        if (highlightedIndex >= 0) {
                          const sel = computedSuggestions[highlightedIndex];
                          window.location.href = `/product/${sel.id}`;
                        } else {
                          handleSearch(e);
                        }
                      } else if (e.key === 'Escape') {
                        setShowSuggestions(false);
                        setIsSearchOpen(false);
                      }
                    }}
                  />
                  <Button 
                    type="submit" 
                    variant="default" 
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 bg-primary text-white rounded-md"
                  >
                    <Search className="h-5 w-5" />
                  </Button>
                  <SearchSuggestions
                    items={computedSuggestions}
                    visible={showSuggestions}
                    highlightedIndex={highlightedIndex}
                    onHover={setHighlightedIndex}
                    onSelect={(item) => {
                      window.location.href = `/product/${item.id}`;
                    }}
                  />
                </div>
              </form>
              </div>
            </div>
        )}
        {!isSearchOpen && (
          <div className="flex items-center justify-between h-16">
            {/* Logo - Left */}
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/2ffc2111-6050-4ee5-b5f5-0768169c2a5b.png" 
              alt="Ijaz Brothers Electric Store" 
              className="h-12 w-auto"
            />
          </Link>

          {/* Navigation - Desktop - Center */}
          <div className="hidden lg:flex items-center justify-center flex-1">
            <nav className="flex space-x-6 items-center">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`text-sm font-medium transition-colors hover:text-primary uppercase ${
                    location.pathname === item.path
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Dynamic Pages Navigation removed - pages now only in Shop dropdown */}
              
              {/* Shop Button */}
              <div 
                className="relative"
                ref={shopButtonRef}
                onMouseEnter={handleShopMouseEnter}
                onMouseLeave={handleShopMouseLeave}
              >
                <div className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary cursor-pointer uppercase">
                  Shop
                  <ChevronDown className="ml-1 h-3 w-3" />
                </div>
              </div>
            </nav>
          </div>

          {/* Right Side - Search, Favorites, Cart */}
          <div className="flex items-center space-x-4">
            {/* Search Button and Input - Only visible on desktop */}
            <div className="relative hidden lg:block">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative" 
                onClick={toggleSearch}
                data-search-button
              >
                <Search className="h-5 w-5" />
              </Button>
              
              {/* inline dropdown removed; full-width bar appears instead */}
            </div>
            
            {/* Favorites Button - Only shown when there are favorites */}
            {favoriteStore.getFavoritesCount() > 0 && (
              <Link to="/favorites">
                <Button variant="ghost" size="icon" className="relative">
                  <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {favoriteStore.getFavoritesCount()}
                  </span>
                </Button>
              </Link>
            )}
            
            {/* Cart Button */}
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                {cartStore.getCartCount() > 0 ? (
                  <>
                    <ShoppingCart className="h-5 w-5 text-primary" />
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartStore.getCartCount()}
                    </span>
                  </>
                ) : (
                  <ShoppingCart className="h-5 w-5" />
                )}
              </Button>
             </Link>
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
          </div>
        )}



        {/* Mobile Navigation */}
        <div className="lg:hidden">
          <nav 
            className={`pb-4 space-y-2 border-t pt-4 ${isMenuOpen ? 'animate-slide-in-from-left' : 'hidden'}`}
          >
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block py-2 text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === item.path
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile Pages Navigation with dropdown arrows */}
            
            <div className="block py-2">
              <div className="space-y-1">
                <div 
                  className="py-2 text-sm font-medium text-muted-foreground flex items-center justify-between cursor-pointer"
                  onClick={() => toggleMobileItem('shop')}
                >
                  <span>Shop</span>
                  <ChevronRight 
                    className={`h-4 w-4 transition-transform ${expandedMobileItems.includes('shop') ? 'rotate-90' : ''}`} 
                  />
                </div>
                
                {expandedMobileItems.includes('shop') && mainPagesWithChildren.map((mainPage) => (
                  <div key={mainPage.id} className="space-y-1">
                    <div 
                      className="py-2 pl-4 text-sm font-medium text-muted-foreground flex items-center justify-between cursor-pointer"
                      onClick={() => toggleMobileItem(mainPage.id)}
                    >
                      <span>{mainPage.name}</span>
                      <ChevronRight 
                        className={`h-4 w-4 transition-transform ${expandedMobileItems.includes(mainPage.id) ? 'rotate-90' : ''}`} 
                      />
                    </div>
                    
                    {expandedMobileItems.includes(mainPage.id) && mainPage.children && mainPage.children.map((subPage) => (
                      <Link
                        key={subPage.id}
                        to={`/${mainPage.slug}/${subPage.slug}`}
                        className="block py-2 pl-8 text-sm text-muted-foreground hover:text-primary transition-colors relative group"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="group-hover:text-primary group-hover:translate-x-1 transition-all duration-200 inline-block">
                          {subPage.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Mobile Search Bar */}
            <div className="py-2 mt-4 border-t pt-4">
              <form onSubmit={handleSearch} className="flex items-center">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10 rounded-md border focus:border-primary"
                    onFocus={() => setShowSuggestions(searchQuery.trim().length > 0)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                    onKeyDown={(e) => {
                      const hasItems = computedSuggestions.length > 0;
                      if (!hasItems) return;
                      if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        setHighlightedIndex((prev) => Math.min(prev + 1, computedSuggestions.length - 1));
                      } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        setHighlightedIndex((prev) => Math.max(prev - 1, 0));
                      } else if (e.key === 'Enter') {
                        if (highlightedIndex >= 0) {
                          e.preventDefault();
                          const sel = computedSuggestions[highlightedIndex];
                          window.location.href = `/product/${sel.id}`;
                        }
                      } else if (e.key === 'Escape') {
                        setShowSuggestions(false);
                      }
                    }}
                  />
                  <Button 
                    type="submit" 
                    variant="default" 
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 bg-primary text-white rounded-md"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                  <SearchSuggestions
                    items={computedSuggestions}
                    visible={showSuggestions}
                    highlightedIndex={highlightedIndex}
                    onHover={setHighlightedIndex}
                    onSelect={(item) => {
                      window.location.href = `/product/${item.id}`;
                    }}
                  />
                </div>
              </form>
            </div>
          </nav>
        </div>

        {/* Full-page Shop dropdown menu */}
        {isShopHovered && (
          <div 
            ref={shopDropdownRef}
            className="fixed left-0 w-screen bg-white border-b border-gray-200 shadow-lg z-50" 
            style={{ top: '4rem', width: '100vw' }}
            onMouseEnter={handleShopMouseEnter}
            onMouseLeave={handleShopMouseLeave}
          >
            <div className="container mx-auto px-4 py-8 flex justify-center">
              <div className="grid grid-cols-4 gap-12 max-w-5xl">
                {/* Main categories view */}
                {mainPagesWithChildren.map((mainPage) => (
                  <div key={mainPage.id} className="space-y-4">
                    <div className="text-2xl font-semibold text-primary border-b pb-2 mb-2 pointer-events-none">
                      {mainPage.name}
                    </div>
                    {mainPage.children && mainPage.children.length > 0 ? (
                      <div className="space-y-2">
                        {mainPage.children.map((subPage) => (
                          <Link
                            key={subPage.id}
                            to={`/${mainPage.slug}/${subPage.slug}`}
                            className="block text-lg text-muted-foreground hover:text-primary transition-colors relative group"
                          >
                            <span className="group-hover:text-primary group-hover:translate-x-1 transition-all duration-200 inline-block">
                              {subPage.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">No subcategories available</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
