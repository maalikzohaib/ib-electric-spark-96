import { Navigate, Link, useLocation } from "react-router-dom";
import { useAdminStore } from "@/store/adminStore";
import { Button } from "@/components/ui/enhanced-button";
import { 
  LayoutDashboard, 
  Package, 
  Plus, 
  Star, 
  Tag,
  LogOut,
  FileText,
  Menu,
  X
} from "lucide-react";
import { useState, useEffect } from "react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { isAuthenticated, logout } = useAdminStore();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar when navigating on mobile
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: <Package className="h-4 w-4" />
    },
    {
      name: "Add Product",
      path: "/admin/add-product",
      icon: <Plus className="h-4 w-4" />
    },
    {
      name: "Featured",
      path: "/admin/featured",
      icon: <Star className="h-4 w-4" />
    },
    {
      name: "Categories",
      path: "/admin/categories",
      icon: <Tag className="h-4 w-4" />
    },
    {
      name: "Pages",
      path: "/admin/pages",
      icon: <FileText className="h-4 w-4" />
    }
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b shadow-card">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Mobile menu toggle */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden" 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              
              <img 
                src="/lovable-uploads/2ffc2111-6050-4ee5-b5f5-0768169c2a5b.png" 
                alt="Ijaz Brothers Electric Store" 
                className="h-8 w-auto"
              />
              <h1 className="text-lg md:text-xl font-bold text-foreground">Admin</h1>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <span className="hidden md:inline text-sm text-muted-foreground">
                Logged in as: <span className="font-medium text-foreground">admin</span>
              </span>
              <Link to="/" className="hidden sm:block">
                <Button variant="outline" size={isMobile ? "sm" : "default"}>
                  Back to Website
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size={isMobile ? "sm" : "default"} 
                onClick={handleLogout}
                className="whitespace-nowrap"
              >
                <LogOut className="h-4 w-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex relative">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && isMobile && (
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <aside 
          className={`${isMobile ? 'fixed left-0 top-16 bottom-0 z-50' : 'relative'} 
            ${isMobile && !isSidebarOpen ? '-translate-x-full' : 'translate-x-0'}
            w-64 bg-card border-r min-h-[calc(100vh-64px)] transition-transform duration-300 ease-in-out`}
        >
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                  onClick={() => isMobile && setIsSidebarOpen(false)}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-2 sm:p-3 md:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
