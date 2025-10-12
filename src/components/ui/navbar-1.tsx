import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ShoppingCart, Heart, Search, ChevronDown } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { useFavoriteStore } from "@/store/favoriteStore"
import { useCartStore } from "@/store/cartStore"
import { useProductStore } from "@/store/productStore"
import { usePageStore } from "@/store/pageStore"
import { Button } from "@/components/ui/enhanced-button"
import { Input } from "@/components/ui/input"
import SearchSuggestions from "@/components/ui/search-suggestions"
import logoImage from "@/assets/logo.png"

const Navbar1 = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const shopDropdownRef = useRef<HTMLDivElement>(null)
  const shopButtonRef = useRef<HTMLDivElement>(null)
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [isShopHovered, setIsShopHovered] = useState(false)
  
  const location = useLocation()
  const favoriteStore = useFavoriteStore()
  const cartStore = useCartStore()
  const { products } = useProductStore()
  const { pages, getMainPagesWithChildren } = usePageStore()
  // This will re-render when pages change in the store
  const mainPagesWithChildren = getMainPagesWithChildren()

  const toggleMenu = () => setIsOpen(!isOpen)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`
    }
  }

  const computedSuggestions = (() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return [] as { id: string; name: string; brand?: string; image_url?: string; price?: number }[]
    const matches = products.filter(p =>
      p.name.toLowerCase().includes(q) || (p.brand || '').toLowerCase().includes(q)
    )
    return matches.slice(0, 8)
  })()

  useEffect(() => {
    const hasQuery = searchQuery.trim().length > 0
    setShowSuggestions(hasQuery)
    if (!hasQuery) setHighlightedIndex(-1)
  }, [searchQuery])
  
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
    if (!isSearchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }

  // Handle click outside to close search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isSearchOpen) {
        const container = searchContainerRef.current
        if (container && !container.contains(event.target as Node)) {
          setIsSearchOpen(false)
        }
      }

      // Close shop dropdown when clicking outside
      if (
        shopDropdownRef.current &&
        shopButtonRef.current &&
        !shopDropdownRef.current.contains(event.target as Node) &&
        !shopButtonRef.current.contains(event.target as Node)
      ) {
        setIsShopHovered(false)
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isSearchOpen])

  // Pages load via consolidated /api/boot on app start

  const handleShopMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    setIsShopHovered(true)
  }

  const handleShopMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsShopHovered(false)
      closeTimeoutRef.current = null
    }, 250)
  }

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ]

  const isHome = location.pathname === "/"

  return (
    <div className={`${isHome ? "absolute" : "relative"} top-0 left-0 right-0 z-50 flex justify-center w-full py-6 px-4`}>
      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-white z-50 pt-24 px-6">
          <div ref={searchContainerRef} className="w-full max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 w-full pr-12 rounded-full border focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0"
                  onFocus={() => setShowSuggestions(searchQuery.trim().length > 0)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                  onKeyDown={(e) => {
                    const hasItems = computedSuggestions.length > 0
                    if (!hasItems) {
                      if (e.key === 'Enter') handleSearch(e)
                      return
                    }
                    if (e.key === 'ArrowDown') {
                      e.preventDefault()
                      setHighlightedIndex((prev) => Math.min(prev + 1, computedSuggestions.length - 1))
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault()
                      setHighlightedIndex((prev) => Math.max(prev - 1, 0))
                    } else if (e.key === 'Enter') {
                      e.preventDefault()
                      if (highlightedIndex >= 0) {
                        const sel = computedSuggestions[highlightedIndex]
                        window.location.href = `/product/${sel.id}`
                      } else {
                        handleSearch(e)
                      }
                    } else if (e.key === 'Escape') {
                      setShowSuggestions(false)
                      setIsSearchOpen(false)
                    }
                  }}
                />
                <Button 
                  type="submit" 
                  variant="default" 
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 bg-primary text-white rounded-full"
                >
                  <Search className="h-5 w-5" />
                </Button>
                <SearchSuggestions
                  items={computedSuggestions}
                  visible={showSuggestions}
                  highlightedIndex={highlightedIndex}
                  onHover={setHighlightedIndex}
                  onSelect={(item) => {
                    window.location.href = `/product/${item.id}`
                  }}
                />
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between px-6 py-3 bg-white rounded-full shadow-lg w-full max-w-4xl relative z-10">
        <div className="flex items-center">
          <motion.div
            className="mr-4"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Link to="/" className="flex items-center">
              <img 
                src={logoImage} 
                alt="IB Electric Store" 
                className="h-12 w-auto"
                onLoad={() => {
                  console.log('✅ Logo image loaded successfully');
                  console.log('Image source:', logoImage);
                }}
                onError={(e) => {
                  console.log('❌ Image failed to load');
                  console.log('Error details:', e);
                  console.log('Trying to load from:', logoImage);
                  console.log('Current URL:', window.location.href);
                }}
              />
            </Link>
          </motion.div>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.filter((i) => i.name !== 'Shop').map((item) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              <Link
                to={item.path}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? "text-primary"
                    : "text-gray-900 hover:text-primary"
                }`}
              >
                {item.name}
              </Link>
            </motion.div>
          ))}

          {/* Shop hover trigger (desktop) */}
          <div
            className="relative"
            ref={shopButtonRef}
            onMouseEnter={handleShopMouseEnter}
            onMouseLeave={handleShopMouseLeave}
          >
            <div className="flex items-center text-sm font-medium text-gray-900 hover:text-primary cursor-pointer">
              Shop
              <ChevronDown className="ml-1 h-3.5 w-3.5" />
            </div>
          </div>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Search Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative" 
              onClick={toggleSearch}
            >
              <Search className="h-5 w-5" />
            </Button>
          </motion.div>

          {/* Favorites */}
          {favoriteStore.getFavoritesCount() > 0 && (
            <Link to="/favorites">
              <motion.div
                className="relative p-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {favoriteStore.getFavoritesCount()}
                </span>
              </motion.div>
            </Link>
          )}
          
          {/* Cart */}
          <Link to="/cart">
            <motion.div
              className="relative p-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCart className="h-5 w-5 text-gray-900" />
              {cartStore.getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartStore.getCartCount()}
                </span>
              )}
            </motion.div>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <motion.button className="md:hidden flex items-center" onClick={toggleMenu} whileTap={{ scale: 0.9 }}>
          <Menu className="h-6 w-6 text-gray-900" />
        </motion.button>
      </div>

      {/* Shop dropdown (desktop) */}
      {isShopHovered && (
        <div
          ref={shopDropdownRef}
          className="fixed left-0 w-screen bg-white border-b border-gray-200 shadow-lg z-50"
          style={{ top: '6rem', width: '100vw' }}
          onMouseEnter={handleShopMouseEnter}
          onMouseLeave={handleShopMouseLeave}
        >
          <div className="container mx-auto px-4 py-8 flex justify-center">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-10 max-w-5xl">
              {mainPagesWithChildren.map((mainPage) => (
                <div key={mainPage.id} className="space-y-3">
                  <div className="text-xl font-semibold text-primary border-b pb-2 pointer-events-none">
                    {mainPage.name}
                  </div>
                  {mainPage.children && mainPage.children.length > 0 ? (
                    <div className="space-y-2">
                      {mainPage.children.map((subPage) => (
                        <Link
                          key={subPage.id}
                          to={`/${mainPage.slug}/${subPage.slug}`}
                          className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          {subPage.name}
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

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-white z-50 pt-24 px-6 md:hidden"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <motion.button
              className="absolute top-6 right-6 p-2"
              onClick={toggleMenu}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <X className="h-6 w-6 text-gray-900" />
            </motion.button>
            
            {/* Mobile Logo */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Link to="/" onClick={toggleMenu}>
                <img 
                  src={logoImage} 
                  alt="IB Electric Store" 
                  className="h-16 w-auto mx-auto"
                  onLoad={() => console.log('Mobile logo loaded successfully')}
                  onError={(e) => {
                    console.log('Mobile logo failed to load:', e);
                    console.log('Trying to load from:', logoImage);
                  }}
                />
              </Link>
            </motion.div>
            
            <div className="flex flex-col space-y-6">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.1 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Link
                    to={item.path}
                    className={`text-base font-medium ${
                      location.pathname === item.path
                        ? "text-primary"
                        : "text-gray-900"
                    }`}
                    onClick={toggleMenu}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}

              {/* Mobile Search */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                exit={{ opacity: 0, y: 20 }}
                className="pt-6"
              >
                <form onSubmit={handleSearch} className="flex items-center">
                  <div className="relative flex-1">
                    <Input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-10 rounded-full border focus:border-primary"
                      onFocus={() => setShowSuggestions(searchQuery.trim().length > 0)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                      onKeyDown={(e) => {
                        const hasItems = computedSuggestions.length > 0
                        if (!hasItems) return
                        if (e.key === 'ArrowDown') {
                          e.preventDefault()
                          setHighlightedIndex((prev) => Math.min(prev + 1, computedSuggestions.length - 1))
                        } else if (e.key === 'ArrowUp') {
                          e.preventDefault()
                          setHighlightedIndex((prev) => Math.max(prev - 1, 0))
                        } else if (e.key === 'Enter') {
                          if (highlightedIndex >= 0) {
                            e.preventDefault()
                            const sel = computedSuggestions[highlightedIndex]
                            window.location.href = `/product/${sel.id}`
                          }
                        } else if (e.key === 'Escape') {
                          setShowSuggestions(false)
                        }
                      }}
                    />
                    <Button 
                      type="submit" 
                      variant="default" 
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 bg-primary text-white rounded-full"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                    <SearchSuggestions
                      items={computedSuggestions}
                      visible={showSuggestions}
                      highlightedIndex={highlightedIndex}
                      onHover={setHighlightedIndex}
                      onSelect={(item) => {
                        window.location.href = `/product/${item.id}`
                      }}
                    />
                  </div>
                </form>
              </motion.div>

              {/* Mobile Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                exit={{ opacity: 0, y: 20 }}
                className="pt-6 space-y-4"
              >
                {favoriteStore.getFavoritesCount() > 0 && (
                  <Link
                    to="/favorites"
                    className="flex items-center space-x-2 text-base text-gray-900 font-medium"
                    onClick={toggleMenu}
                  >
                    <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                    <span>Favorites ({favoriteStore.getFavoritesCount()})</span>
                  </Link>
                )}
                
                <Link
                  to="/cart"
                  className="flex items-center space-x-2 text-base text-gray-900 font-medium"
                  onClick={toggleMenu}
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Cart ({cartStore.getCartCount()})</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}


export { Navbar1 }
