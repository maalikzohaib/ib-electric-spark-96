import { Navigate, Link, useLocation } from "react-router-dom";
import { useAdminStore } from "@/store/adminStore";
import { Button } from "@/components/ui/enhanced-button";
import { 
  LayoutDashboard, 
  Package, 
  Plus, 
  Settings, 
  Star, 
  LogOut 
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { isAuthenticated, logout } = useAdminStore();
  const location = useLocation();

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
      icon: <Settings className="h-4 w-4" />
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
            <div className="flex items-center space-x-4">
              <img 
                src="/lovable-uploads/2ffc2111-6050-4ee5-b5f5-0768169c2a5b.png" 
                alt="IB Electric Store" 
                className="h-8 w-auto"
              />
              <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r min-h-[calc(100vh-64px)]">
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
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;