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
  const [scrolled, setScrolled] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const shopDropdownRef = useRef<HTMLDivElement>(null)
  const shopButtonRef = useRef<HTMLDivElement>(null)
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [isShopHovered, setIsShopHovered] = useState(false)
  const [expandedMobileItems, setExpandedMobileItems] = useState<string[]>([])

  const location = useLocation()
  const favoriteStore = useFavoriteStore()
  const cartStore = useCartStore()
  const { products } = useProductStore()
  const { pages, getMainPagesWithChildren } = usePageStore()
  const mainPagesWithChildren = getMainPagesWithChildren()

  const toggleMenu = () => setIsOpen(!isOpen)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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

  const toggleMobileItem = (itemId: string) => {
    setExpandedMobileItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop", hasDropdown: true },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ]

  const isHome = location.pathname === "/"

  return (
    <>
      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50 pt-32 px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div ref={searchContainerRef} className="w-full max-w-2xl mx-auto">
              <motion.button
                className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => setIsSearchOpen(false)}
                whileTap={{ scale: 0.9 }}
              >
                <X className="h-6 w-6 text-gray-900" />
              </motion.button>

              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <Input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-14 w-full pr-14 rounded-2xl border-2 focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0 text-lg"
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
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-primary text-white rounded-xl hover:scale-105 transition-transform"
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Aave-style Navigation Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-50 flex justify-center w-full px-4 transition-all duration-300"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          paddingTop: scrolled ? '1rem' : '1.5rem',
          paddingBottom: scrolled ? '1rem' : '1.5rem',
        }}
      >
        <motion.div
          className="bg-white rounded-full shadow-xl w-full max-w-6xl relative backdrop-blur-sm"
          style={{
            boxShadow: scrolled
              ? '0 4px 20px rgba(0, 0, 0, 0.1)'
              : '0 8px 30px rgba(0, 0, 0, 0.12)',
          }}
          animate={{
            scale: scrolled ? 0.98 : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between px-8 py-4">
            {/* Logo */}
            <motion.div
              className="flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/" className="flex items-center">
                <img
                  src={logoImage}
                  alt="IB Electric Store"
                  className="h-10 w-auto transition-all duration-300"
                  style={{ height: scrolled ? '2.5rem' : '2.75rem' }}
                />
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1 flex-1 justify-center">
              {navItems.map((item) => {
                if (item.hasDropdown) {
                  return (
                    <div
                      key={item.name}
                      className="relative"
                      ref={shopButtonRef}
                      onMouseEnter={handleShopMouseEnter}
                      onMouseLeave={handleShopMouseLeave}
                    >
                      <motion.button
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${location.pathname.startsWith(item.path)
                            ? "bg-primary/10 text-primary"
                            : "text-gray-700 hover:bg-gray-100"
                          }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {item.name}
                        <ChevronDown className="h-4 w-4" />
                      </motion.button>
                    </div>
                  )
                }

                return (
                  <motion.div
                    key={item.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to={item.path}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all block ${location.pathname === item.path
                          ? "bg-primary/10 text-primary"
                          : "text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                )
              })}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-2">
              {/* Search Button */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative rounded-full hover:bg-gray-100"
                  onClick={toggleSearch}
                >
                  <Search className="h-5 w-5 text-gray-700" />
                </Button>
              </motion.div>

              {/* Favorites */}
              {favoriteStore.getFavoritesCount() > 0 && (
                <Link to="/favorites">
                  <motion.div
                    className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                    <motion.span
                      className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    >
                      {favoriteStore.getFavoritesCount()}
                    </motion.span>
                  </motion.div>
                </Link>
              )}

              {/* Cart */}
              <Link to="/cart">
                <motion.div
                  className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ShoppingCart className="h-5 w-5 text-gray-700" />
                  {cartStore.getCartCount() > 0 && (
                    <motion.span
                      className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    >
                      {cartStore.getCartCount()}
                    </motion.span>
                  )}
                </motion.div>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="lg:hidden flex items-center p-2 rounded-full hover:bg-gray-100 transition-colors"
              onClick={toggleMenu}
              whileTap={{ scale: 0.9 }}
            >
              <Menu className="h-6 w-6 text-gray-900" />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      {/* Shop dropdown (desktop) - Aave style */}
      <AnimatePresence>
        {isShopHovered && (
          <motion.div
            ref={shopDropdownRef}
            className="fixed left-0 w-screen bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-2xl z-40"
            style={{ top: scrolled ? '5rem' : '6.5rem' }}
            onMouseEnter={handleShopMouseEnter}
            onMouseLeave={handleShopMouseLeave}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="container mx-auto px-6 py-10">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                {mainPagesWithChildren.map((mainPage, index) => (
                  <motion.div
                    key={mainPage.id}
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="text-lg font-bold text-primary pb-2 border-b-2 border-primary/20">
                      {mainPage.name}
                    </div>
                    {mainPage.children && mainPage.children.length > 0 ? (
                      <div className="space-y-2">
                        {mainPage.children.map((subPage) => (
                          <Link
                            key={subPage.id}
                            to={`/${mainPage.slug}/${subPage.slug}`}
                            className="block text-sm text-gray-600 hover:text-primary hover:translate-x-1 transition-all duration-200"
                          >
                            {subPage.name}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400">No subcategories</div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay - Aave style */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-white z-50 lg:hidden overflow-y-auto"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <Link to="/" onClick={toggleMenu}>
                  <img
                    src={logoImage}
                    alt="IB Electric Store"
                    className="h-12 w-auto"
                  />
                </Link>
                <motion.button
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  onClick={toggleMenu}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-6 w-6 text-gray-900" />
                </motion.button>
              </div>

              <div className="flex flex-col space-y-2">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 + 0.1 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    {item.hasDropdown ? (
                      <div className="space-y-1">
                        <div
                          className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-all cursor-pointer ${location.pathname.startsWith(item.path) || expandedMobileItems.includes(item.name)
                              ? "bg-primary/10 text-primary"
                              : "text-gray-700 hover:bg-gray-100"
                            }`}
                          onClick={() => toggleMobileItem(item.name)}
                        >
                          <span>{item.name}</span>
                          <ChevronDown
                            className={`h-4 w-4 transition-transform duration-200 ${expandedMobileItems.includes(item.name) ? "rotate-180" : ""
                              }`}
                          />
                        </div>

                        <AnimatePresence>
                          {expandedMobileItems.includes(item.name) && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="pl-4 space-y-1 pb-2">
                                {mainPagesWithChildren.map((mainPage) => (
                                  <div key={mainPage.id} className="space-y-1">
                                    <div
                                      className="flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary cursor-pointer"
                                      onClick={() => toggleMobileItem(mainPage.id)}
                                    >
                                      <span>{mainPage.name}</span>
                                      {mainPage.children && mainPage.children.length > 0 && (
                                        <ChevronDown
                                          className={`h-3 w-3 transition-transform duration-200 ${expandedMobileItems.includes(mainPage.id) ? "rotate-180" : ""
                                            }`}
                                        />
                                      )}
                                    </div>

                                    {mainPage.children && mainPage.children.length > 0 && expandedMobileItems.includes(mainPage.id) && (
                                      <div className="pl-4 space-y-1 border-l-2 border-gray-100 ml-4">
                                        {mainPage.children.map((subPage) => (
                                          <Link
                                            key={subPage.id}
                                            to={`/${mainPage.slug}/${subPage.slug}`}
                                            className="block px-4 py-2 text-sm text-gray-500 hover:text-primary transition-colors"
                                            onClick={toggleMenu}
                                          >
                                            {subPage.name}
                                          </Link>
                                        ))}
                                      </div>
                                    )}

                                    {(!mainPage.children || mainPage.children.length === 0) && (
                                      <Link // Handle cases where main page has no children if needed, though usually they do or are just links
                                        to={`/${mainPage.slug}`}
                                        className="hidden" // Hidden for now as logic implies main pages are categories
                                      />
                                    )}
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        to={item.path}
                        className={`block px-4 py-3 rounded-xl text-base font-medium transition-all ${location.pathname === item.path
                            ? "bg-primary/10 text-primary"
                            : "text-gray-700 hover:bg-gray-100"
                          }`}
                        onClick={toggleMenu}
                      >
                        {item.name}
                      </Link>
                    )}
                  </motion.div>
                ))}

                {/* Mobile Search */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="pt-6"
                >
                  <form onSubmit={handleSearch}>
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-12 pr-12 rounded-xl border-2 focus:border-primary"
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
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-primary text-white rounded-lg"
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
                  className="pt-6 space-y-2"
                >
                  {favoriteStore.getFavoritesCount() > 0 && (
                    <Link
                      to="/favorites"
                      className="flex items-center justify-between px-4 py-3 rounded-xl text-base text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                      onClick={toggleMenu}
                    >
                      <span className="flex items-center gap-3">
                        <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                        Favorites
                      </span>
                      <span className="bg-primary text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-medium">
                        {favoriteStore.getFavoritesCount()}
                      </span>
                    </Link>
                  )}

                  <Link
                    to="/cart"
                    className="flex items-center justify-between px-4 py-3 rounded-xl text-base text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                    onClick={toggleMenu}
                  >
                    <span className="flex items-center gap-3">
                      <ShoppingCart className="h-5 w-5" />
                      Cart
                    </span>
                    {cartStore.getCartCount() > 0 && (
                      <span className="bg-primary text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-medium">
                        {cartStore.getCartCount()}
                      </span>
                    )}
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}


export { Navbar1 }
