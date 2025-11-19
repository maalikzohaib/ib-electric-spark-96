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
  const [isShopHovered, setIsShopHovered] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [expandedMobileItems, setExpandedMobileItems] = useState<string[]>([]);
  const shopDropdownRef = useRef<HTMLDivElement>(null);
  const shopButtonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const location = useLocation();
  const { fetchPages, getMainPagesWithChildren } = usePageStore();
  const favoriteStore = useFavoriteStore();
  const cartStore = useCartStore();
  const { products } = useProductStore();

  // Pages load via consolidated /api/boot on app start
  
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
    <header className="sticky top-0 z-50 bg-gradient-to-b from-white/85 via-white/65 to-transparent backdrop-blur-xl">
      <div className="container mx-auto px-4 py-4">
        {isSearchOpen && (
          <div className="flex items-center h-16 animate-slide-down-quick">
            <div ref={searchContainerRef} className="relative w-full">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <Input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-12 w-full rounded-md border pr-12 focus:border-input focus-visible:ring-0 focus-visible:ring-offset-0"
                    onFocus={() => setShowSuggestions(searchQuery.trim().length > 0)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                    onKeyDown={(e) => {
                      const hasItems = computedSuggestions.length > 0;
                      if (!hasItems) {
                        if (e.key === "Enter") handleSearch(e);
                        return;
                      }
                      if (e.key === "ArrowDown") {
                        e.preventDefault();
                        setHighlightedIndex((prev) => Math.min(prev + 1, computedSuggestions.length - 1));
                      } else if (e.key === "ArrowUp") {
                        e.preventDefault();
                        setHighlightedIndex((prev) => Math.max(prev - 1, 0));
                      } else if (e.key === "Enter") {
                        e.preventDefault();
                        if (highlightedIndex >= 0) {
                          const sel = computedSuggestions[highlightedIndex];
                          window.location.href = `/product/${sel.id}`;
                        } else {
                          handleSearch(e);
                        }
                      } else if (e.key === "Escape") {
                        setShowSuggestions(false);
                        setIsSearchOpen(false);
                      }
                    }}
                  />
                  <Button
                    type="submit"
                    variant="default"
                    size="icon"
                    className="absolute right-1 top-1/2 h-10 w-10 -translate-y-1/2 rounded-md bg-primary text-white"
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
          <div className="relative">
            <div
              className={cn(
                "flex h-16 w-full items-center justify-between rounded-3xl border border-slate-200/60 bg-white/90 px-4 shadow-[0_18px_44px_rgba(15,23,42,0.12)] backdrop-blur-xl transition-all lg:px-8",
                "dark:border-slate-700/60 dark:bg-slate-900/85",
                isShopHovered && "ring-1 ring-primary/25 shadow-[0_24px_60px_rgba(59,130,246,0.18)]"
              )}
            >
              {/* Logo - Left */}
              <Link to="/" className="flex items-center">
                <img
                  src="/lovable-uploads/2ffc2111-6050-4ee5-b5f5-0768169c2a5b.png"
                  alt="Ijaz Brothers Electric Store"
                  className="h-12 w-auto"
                />
              </Link>

              {/* Navigation - Desktop - Center */}
              <div className="hidden flex-1 items-center justify-center lg:flex">
                <nav className="flex items-center gap-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={cn(
                        "relative text-sm font-semibold uppercase tracking-[0.2em] text-slate-600 transition-all duration-200 hover:text-primary",
                        "after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:rounded-full after:bg-primary/70 after:transition-transform after:duration-300",
                        location.pathname === item.path ? "text-primary after:scale-x-100" : "hover:after:scale-x-100"
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}

                  {/* Shop Button + Floating Dropdown (relative wrapper) */}
                  <div className="relative">
                    <button
                      type="button"
                      className={cn(
                        "group flex items-center gap-2 rounded-full border border-transparent px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-600 transition-all duration-200",
                        "cursor-pointer hover:border-primary/40 hover:bg-primary/5 hover:text-primary",
                        isShopHovered && "border-primary/60 bg-primary/10 text-primary shadow-[inset_0_2px_12px_rgba(59,130,246,0.25)]"
                      )}
                      ref={shopButtonRef}
                      onMouseEnter={handleShopMouseEnter}
                      onMouseLeave={handleShopMouseLeave}
                      onFocus={handleShopMouseEnter}
                      onBlur={handleShopMouseLeave}
                      aria-expanded={isShopHovered}
                      aria-haspopup="true"
                    >
                      <span>Shop</span>
                      <ChevronDown
                        className={cn("h-3 w-3 transition-transform duration-200", isShopHovered && "-rotate-180")}
                      />
                    </button>

                    {/* Compact floating dropdown card positioned under the Shop button */}
                    {isShopHovered && (
                      <div
                        ref={shopDropdownRef}
                        className="absolute left-0 top-full z-50 mt-2 min-w-[220px] max-w-[320px] w-auto rounded-[12px] bg-white border border-slate-200 shadow-[0_8px_24px_rgba(2,6,23,0.08)] p-2 transition-all duration-200 ease-out opacity-100 transform translate-y-0 dark:bg-slate-900 dark:border-slate-700"
                        onMouseEnter={handleShopMouseEnter}
                        onMouseLeave={handleShopMouseLeave}
                        onFocus={handleShopMouseEnter}
                        onBlur={handleShopMouseLeave}
                        role="menu"
                        aria-label="Shop menu"
                      >
                        <div className="flex flex-col gap-1">
                          {mainPagesWithChildren.map((mainPage, mIdx) => (
                            <div key={mainPage.id} className="group">
                              <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                {mainPage.name}
                              </div>
                              {mainPage.children && mainPage.children.length > 0 ? (
                                <div className="flex flex-col">
                                  {mainPage.children.map((subPage) => (
                                    <Link
                                      key={subPage.id}
                                      to={`/${mainPage.slug}/${subPage.slug}`}
                                      className="block px-3 py-2 text-sm text-slate-700 rounded-[8px] hover:bg-slate-100 transition-colors duration-150"
                                      role="menuitem"
                                      onClick={() => setIsShopHovered(false)}
                                    >
                                      {subPage.name}
                                    </Link>
                                  ))}
                                </div>
                              ) : (
                                <Link
                                  to={`/${mainPage.slug}`}
                                  className="block px-3 py-2 text-sm text-slate-700 rounded-[8px] hover:bg-slate-100 transition-colors duration-150"
                                  role="menuitem"
                                  onClick={() => setIsShopHovered(false)}
                                >
                                  View
                                </Link>
                              )}
                              {mIdx < mainPagesWithChildren.length - 1 && <div className="mx-2 my-1 h-px bg-slate-100" />}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </nav>
              </div>

              {/* Right Side - Search, Favorites, Cart */}
              <div className="flex items-center gap-3">
                <div className="relative hidden lg:block">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative rounded-full border border-transparent bg-white/60 text-slate-600 transition-all duration-200 hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                    onClick={toggleSearch}
                    data-search-button
                  >
                    <Search className="h-5 w-5" />
                  </Button>
                </div>

                {favoriteStore.getFavoritesCount() > 0 && (
                  <Link to="/favorites">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative rounded-full border border-transparent bg-white/60 text-slate-600 transition-all duration-200 hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                    >
                      <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                        {favoriteStore.getFavoritesCount()}
                      </span>
                    </Button>
                  </Link>
                )}

                <Link to="/cart">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative rounded-full border border-transparent bg-white/60 text-slate-600 transition-all duration-200 hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                  >
                    {cartStore.getCartCount() > 0 ? (
                      <>
                        <ShoppingCart className="h-5 w-5 text-primary" />
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                          {cartStore.getCartCount()}
                        </span>
                      </>
                    ) : (
                      <ShoppingCart className="h-5 w-5" />
                    )}
                  </Button>
                </Link>

                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full border border-transparent bg-white/60 text-slate-600 transition-all duration-200 hover:border-primary/40 hover:bg-primary/10 hover:text-primary lg:hidden"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-label="Toggle navigation menu"
                >
                  {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </div>
            </div>

            {/* Shop mega menu */}
            {isShopHovered && (
              <div
                ref={shopDropdownRef}
                className="absolute left-1/2 top-full z-50 hidden w-[min(92vw,_1080px)] -translate-x-1/2 translate-y-6 overflow-hidden rounded-3xl border border-slate-200/70 bg-white/95 shadow-[0_28px_80px_rgba(15,23,42,0.18)] backdrop-blur-2xl transition-all lg:block dark:border-slate-700/70 dark:bg-slate-900/92"
                onMouseEnter={handleShopMouseEnter}
                onMouseLeave={handleShopMouseLeave}
                onFocus={handleShopMouseEnter}
                onBlur={handleShopMouseLeave}
              >
                <span className="pointer-events-none absolute left-1/2 top-0 h-12 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/25 blur-2xl" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),transparent_65%)]" />
                <div className="relative grid gap-8 px-10 py-12 md:grid-cols-2 lg:grid-cols-4">
                  {/* Main categories view */}
                  {mainPagesWithChildren.map((mainPage, index) => (
                    <div
                      key={mainPage.id}
                      className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-500"
                      style={{ animationDelay: `${index * 75}ms` }}
                    >
                      <div className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                        {mainPage.name}
                      </div>
                      {mainPage.children && mainPage.children.length > 0 ? (
                        <div className="space-y-2.5">
                          {mainPage.children.map((subPage) => (
                            <Link
                              key={subPage.id}
                              to={`/${mainPage.slug}/${subPage.slug}`}
                              className="group flex items-center gap-4 rounded-2xl border border-transparent bg-white/0 px-4 py-3 text-sm font-medium text-slate-600 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-primary/5 hover:text-primary hover:shadow-xl"
                            >
                              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white group-hover:shadow-lg">
                                <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                              </span>
                              <span className="flex-1">{subPage.name}</span>
                              <Plus className="h-4 w-4 opacity-0 text-primary transition-opacity duration-300 group-hover:opacity-100" />
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-dashed border-slate-200/80 bg-slate-50/70 px-4 py-6 text-center text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                          No subcategories
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
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
      </div>
    </header>
  );
};

export default Header;
