import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { setQueryClient } from "@/lib/queryClient";
import { createBrowserRouter, RouterProvider, useParams, Navigate, ScrollRestoration, useLocation } from "react-router-dom";
import { useProductData } from "@/hooks/useProductData";
import { Navbar1 } from "./components/ui/navbar-1";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Favorites from "./pages/Favorites";
import Cart from "./pages/Cart";
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AddProduct = lazy(() => import('./pages/admin/AddProduct'));
const EditProduct = lazy(() => import('./pages/admin/EditProduct'));
const FeaturedProducts = lazy(() => import('./pages/admin/FeaturedProducts'));
const Categories = lazy(() => import('./pages/admin/Categories'));
const Brands = lazy(() => import('./pages/admin/Brands'));
const AdminPages = lazy(() => import('./components/admin/AdminPages'));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
import NotFound from "./pages/NotFound";
import PageProducts from "./pages/PageProducts";
import { usePageStore } from "./store/pageStore";

// Component to handle redirecting from main page to first subpage
const MainPageRedirect = () => {
  const { mainPageSlug } = useParams<{ mainPageSlug: string }>();
  const { getMainPagesWithChildren } = usePageStore();

  const mainPagesWithChildren = getMainPagesWithChildren();
  const mainPage = mainPagesWithChildren.find(page => page.slug === mainPageSlug);

  if (mainPage && mainPage.children && mainPage.children.length > 0) {
    // Redirect to the first subpage
    return <Navigate to={`/${mainPageSlug}/${mainPage.children[0].slug}`} replace />;
  }

  // If no subpages found, redirect to shop
  return <Navigate to="/shop" replace />;
};

const queryClient = new QueryClient();

// Make query client globally accessible for cache invalidation
// Make query client globally accessible for cache invalidation
setQueryClient(queryClient);

// Layout component to wrap public routes
const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <>
      <Navbar1 />
      <main className={!isHome ? "pt-32" : ""}>
        {children}
      </main>
      <Footer />
    </>
  );
};

function AppContent() {
  useProductData(); // Load product data on app start

  // Define routes using createBrowserRouter
  const router = createBrowserRouter([
    {
      path: "/",
      element: <PublicLayout><Home /></PublicLayout>,
    },
    {
      path: "/shop",
      element: <PublicLayout><Shop /></PublicLayout>,
    },
    {
      path: "/product/:id",
      element: <PublicLayout><ProductDetail /></PublicLayout>,
    },
    {
      path: "/about",
      element: <PublicLayout><About /></PublicLayout>,
    },
    {
      path: "/contact",
      element: <PublicLayout><Contact /></PublicLayout>,
    },
    {
      path: "/favorites",
      element: <PublicLayout><Favorites /></PublicLayout>,
    },
    {
      path: "/cart",
      element: <PublicLayout><Cart /></PublicLayout>,
    },
    {
      path: "/:mainPageSlug",
      element: <MainPageRedirect />,
    },
    {
      path: "/:mainPageSlug/:subPageSlug",
      element: <PublicLayout><PageProducts /></PublicLayout>,
    },

    // Admin Routes
    {
      path: "/admin",
      element: <AdminLogin />,
    },
    {
      path: "/admin/dashboard",
      element: <AdminLayout><AdminDashboard /></AdminLayout>,
    },
    {
      path: "/admin/products",
      element: <AdminLayout><AdminProducts /></AdminLayout>,
    },
    {
      path: "/admin/add-product",
      element: <AdminLayout><AddProduct /></AdminLayout>,
    },
    {
      path: "/admin/edit-product/:id",
      element: <AdminLayout><EditProduct /></AdminLayout>,
    },
    {
      path: "/admin/featured",
      element: <AdminLayout><FeaturedProducts /></AdminLayout>,
    },
    {
      path: "/admin/categories",
      element: <AdminLayout><Categories /></AdminLayout>,
    },
    {
      path: "/admin/brands",
      element: <AdminLayout><Brands /></AdminLayout>,
    },
    {
      path: "/admin/pages",
      element: <AdminLayout><AdminPages /></AdminLayout>,
    },

    // Catch-all route
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return (
    <Suspense fallback={null}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
