import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  brand: string;
  color?: string;
  variant?: string;
  in_stock: boolean;
  image_url: string;
  featured: boolean;
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
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  categories: [],
  featuredProducts: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      set({ products: data || [], loading: false });
    } catch (error) {
      console.error('Error fetching products:', error);
      set({ error: (error as Error).message, loading: false });
    }
  },

  addProduct: async (product) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        products: [data, ...state.products],
        loading: false
      }));
    } catch (error) {
      console.error('Error adding product:', error);
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  updateProduct: async (id, productUpdate) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('products')
        .update(productUpdate)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

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
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

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
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      
      set({ categories: data || [], loading: false });
    } catch (error) {
      console.error('Error fetching categories:', error);
      set({ error: (error as Error).message, loading: false });
    }
  },

  addCategory: async (category) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([category])
        .select()
        .single();

      if (error) throw error;

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
      const { data, error } = await supabase
        .from('categories')
        .update(categoryUpdate)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

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
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

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
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .limit(3);

      if (error) throw error;
      
      set({ featuredProducts: data || [], loading: false });
    } catch (error) {
      console.error('Error fetching featured products:', error);
      set({ error: (error as Error).message, loading: false });
    }
  },

  setFeaturedProduct: async (productId, featured) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('products')
        .update({ featured })
        .eq('id', productId);

      if (error) throw error;

      // Refresh products and featured products
      await get().fetchProducts();
      await get().fetchFeaturedProducts();
    } catch (error) {
      console.error('Error updating featured product:', error);
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },
}));