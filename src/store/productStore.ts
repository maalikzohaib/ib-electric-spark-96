import { create } from 'zustand';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  brand: string;
  size?: string;
  color?: string;
  variant?: string;
  in_stock: boolean;
  image_url: string;
  images?: string[];
  featured: boolean;
  page_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  created_at?: string;
}

interface ProductStore {
  products: Product[];
  categories: Category[];
  featuredProducts: Product[];
  loading: boolean;
  error: string | null;
  productsFetched: boolean;
  
  // Product actions
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProductById: (id: string) => Product | undefined;
  
  // Category actions
  fetchCategories: () => Promise<void>;
  addCategory: (category: Omit<Category, 'id' | 'created_at'>) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  
  // Featured products
  fetchFeaturedProducts: () => Promise<void>;
  setFeaturedProduct: (productId: string, featured: boolean) => Promise<void>;

  // Boot setters (from /api/boot)
  setFeaturedProducts: (items: Product[]) => void;
  setCategories: (items: Category[]) => void;
  setProducts: (items: Product[]) => void;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  categories: [],
  featuredProducts: [],
  loading: false,
  error: null,
  productsFetched: false,

  fetchProducts: async () => {
    // Defer heavy product list until needed (lazy-load in Shop)
    set({ loading: true, error: null });
    try {
      const resp = await fetch('/api/products');
      if (!resp.ok) throw new Error('Failed to load products');
      const data = await resp.json();
      set({ products: data?.products || [], loading: false, productsFetched: true });
    } catch (error) {
      console.error('Error fetching products:', error);
      set({ error: (error as Error).message, loading: false, products: [], productsFetched: false });
    }
  },

  addProduct: async (product) => {
    set({ loading: true, error: null });
    try {
      if (!product.name || !product.price || !product.category_id) {
        throw new Error('Missing required product information');
      }
      
      // Route to API (to be implemented server-side); provide optimistic local update as fallback
      const resp = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      })
      if (resp.ok) {
        const data = await resp.json()
        // Only add to local state if products have been fetched before
        // This prevents stale data when products haven't been loaded yet
        set((state) => {
          if (state.productsFetched) {
            return { products: [data, ...state.products], loading: false };
          }
          return { loading: false };
        })
        return data
      }
      throw new Error('Failed to add product. Please try again.')
    } catch (error) {
      console.error('Error adding product:', error);
      set({ 
        error: (error as Error).message || 'An unexpected error occurred while adding the product', 
        loading: false 
      });
      throw error;
    }
  },

  updateProduct: async (id, productUpdate) => {
    set({ loading: true, error: null });
    try {
      const resp = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productUpdate),
      })
      if (!resp.ok) throw new Error('Failed to update product')
      const data = await resp.json()

      set((state) => ({
        products: state.products.map((product) =>
          product.id === id ? { ...product, ...data } : product
        ),
        loading: false
      }));
    } catch (error) {
      console.error('Error updating product:', error);
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      const resp = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      if (!resp.ok) throw new Error('Failed to delete product')

      set((state) => ({
        products: state.products.filter((product) => product.id !== id),
        featuredProducts: state.featuredProducts.filter((product) => product.id !== id),
        loading: false
      }));
    } catch (error) {
      console.error('Error deleting product:', error);
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  getProductById: (id) => {
    return get().products.find((product) => product.id === id);
  },

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const resp = await fetch('/api/boot')
      if (!resp.ok) throw new Error('Failed to load categories')
      const data = await resp.json()
      set({ categories: data?.categories || [], loading: false });
    } catch (error) {
      console.error('Error fetching categories:', error);
      set({ error: (error as Error).message, loading: false, categories: [] });
    }
  },

  addCategory: async (category) => {
    set({ loading: true, error: null });
    try {
      const resp = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category),
      })
      if (!resp.ok) throw new Error('Failed to add category')
      const data = await resp.json()

      set((state) => ({
        categories: [...state.categories, data],
        loading: false
      }));
    } catch (error) {
      console.error('Error adding category:', error);
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  updateCategory: async (id, categoryUpdate) => {
    set({ loading: true, error: null });
    try {
      const resp = await fetch(`/api/categories/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryUpdate),
      })
      if (!resp.ok) throw new Error('Failed to update category')
      const data = await resp.json()

      set((state) => ({
        categories: state.categories.map((category) =>
          category.id === id ? { ...category, ...data } : category
        ),
        loading: false
      }));
    } catch (error) {
      console.error('Error updating category:', error);
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  deleteCategory: async (id) => {
    set({ loading: true, error: null });
    try {
      const resp = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
      if (!resp.ok) throw new Error('Failed to delete category')

      set((state) => ({
        categories: state.categories.filter((category) => category.id !== id),
        loading: false
      }));
    } catch (error) {
      console.error('Error deleting category:', error);
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  fetchFeaturedProducts: async () => {
    set({ loading: true, error: null });
    try {
      // Prefer consolidated boot endpoint
      const resp = await fetch('/api/boot')
      if (!resp.ok) throw new Error('Failed to load featured products')
      const data = await resp.json()
      set({ featuredProducts: data?.featuredProducts || [], loading: false })
    } catch (error) {
      console.error('Error fetching featured products:', error);
      set({ error: (error as Error).message, loading: false, featuredProducts: [] });
    }
  },

  setFeaturedProduct: async (productId, featured) => {
    set({ loading: true, error: null });
    try {
      const resp = await fetch(`/api/products/${productId}/featured`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured }),
      })
      if (!resp.ok) throw new Error('Failed to update featured flag')

      // Refresh products and featured products
      await get().fetchProducts();
      await get().fetchFeaturedProducts();
    } catch (error) {
      console.error('Error updating featured product:', error);
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  setFeaturedProducts: (items) => set({ featuredProducts: items || [] }),
  setCategories: (items) => set({ categories: items || [] }),
  setProducts: (items) => set({ products: items || [] }),
}));
