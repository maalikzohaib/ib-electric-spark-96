import { create } from 'zustand';
import { supabase, executeNeonQuery, executeNeonQuerySingle } from '@/integrations/supabase/client';

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
      // Use Neon for database operations to avoid RLS recursion issues
      const products = await executeNeonQuery<Product>(
        'SELECT * FROM products ORDER BY created_at DESC'
      );
      
      if (!products) {
        throw new Error('Failed to fetch products. Please try again later.');
      }
      
      set({ products: products, loading: false });
    } catch (error) {
      console.error('Error fetching products from Neon:', error);
      set({ 
        error: (error as Error).message || 'An unexpected error occurred while fetching products', 
        loading: false,
        products: [] // Set empty array on error to prevent undefined issues
      });
      // Re-throw the error to be handled by the component
      throw error;
    }
  },

  addProduct: async (product) => {
    set({ loading: true, error: null });
    try {
      if (!product.name || !product.price || !product.category_id) {
        throw new Error('Missing required product information');
      }
      
      // Use Neon for database operations to avoid RLS recursion issues
      const data = await executeNeonQuerySingle<Product>(
        `INSERT INTO products (name, description, price, category_id, brand, color, variant, in_stock, image_url, images, featured, page_id, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW()) 
         RETURNING *`,
        [product.name, product.description, product.price, product.category_id, product.brand, product.color, product.variant, product.in_stock, product.image_url, product.images, product.featured, product.page_id]
      );

      if (!data) {
        throw new Error('Failed to add product. Please try again.');
      }

      set((state) => ({
        products: [data, ...state.products],
        loading: false
      }));
      
      return data;
    } catch (error) {
      console.error('Error adding product to Neon:', error);
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
      // Build dynamic SQL query for updates
      const updateFields = Object.keys(productUpdate).filter(key => key !== 'id');
      const setClause = updateFields.map((field, index) => `${field} = $${index + 2}`).join(', ');
      
      // Use Neon for database operations to avoid RLS recursion issues
      const data = await executeNeonQuerySingle<Product>(
        `UPDATE products SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`,
        [id, ...updateFields.map(field => productUpdate[field as keyof Product])]
      );

      set((state) => ({
        products: state.products.map((product) =>
          product.id === id ? { ...product, ...data } : product
        ),
        loading: false
      }));
    } catch (error) {
      console.error('Error updating product in Neon:', error);
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      // Use Neon for database operations to avoid RLS recursion issues
      await executeNeonQuery(
        'DELETE FROM products WHERE id = $1',
        [id]
      );

      set((state) => ({
        products: state.products.filter((product) => product.id !== id),
        featuredProducts: state.featuredProducts.filter((product) => product.id !== id),
        loading: false
      }));
    } catch (error) {
      console.error('Error deleting product in Neon:', error);
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
      // Use Neon for database operations to avoid RLS recursion issues
      const categories = await executeNeonQuery<Category>(
        'SELECT * FROM categories ORDER BY name'
      );
      
      set({ categories: categories || [], loading: false });
    } catch (error) {
      console.error('Error fetching categories from Neon:', error);
      set({ error: (error as Error).message, loading: false });
    }
  },

  addCategory: async (category) => {
    set({ loading: true, error: null });
    try {
      // Use Neon for database operations to avoid RLS recursion issues
      const data = await executeNeonQuerySingle<Category>(
        `INSERT INTO categories (name, description, icon, created_at) 
         VALUES ($1, $2, $3, NOW()) 
         RETURNING *`,
        [category.name, category.description, category.icon]
      );

      set((state) => ({
        categories: [...state.categories, data],
        loading: false
      }));
    } catch (error) {
      console.error('Error adding category to Neon:', error);
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  updateCategory: async (id, categoryUpdate) => {
    set({ loading: true, error: null });
    try {
      // Build dynamic SQL query for updates
      const updateFields = Object.keys(categoryUpdate).filter(key => key !== 'id');
      const setClause = updateFields.map((field, index) => `${field} = $${index + 2}`).join(', ');
      
      // Use Neon for database operations to avoid RLS recursion issues
      const data = await executeNeonQuerySingle<Category>(
        `UPDATE categories SET ${setClause} WHERE id = $1 RETURNING *`,
        [id, ...updateFields.map(field => categoryUpdate[field as keyof Category])]
      );

      set((state) => ({
        categories: state.categories.map((category) =>
          category.id === id ? { ...category, ...data } : category
        ),
        loading: false
      }));
    } catch (error) {
      console.error('Error updating category in Neon:', error);
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  deleteCategory: async (id) => {
    set({ loading: true, error: null });
    try {
      // Use Neon for database operations to avoid RLS recursion issues
      await executeNeonQuery(
        'DELETE FROM categories WHERE id = $1',
        [id]
      );

      set((state) => ({
        categories: state.categories.filter((category) => category.id !== id),
        loading: false
      }));
    } catch (error) {
      console.error('Error deleting category from Neon:', error);
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  fetchFeaturedProducts: async () => {
    set({ loading: true, error: null });
    try {
      // Use Neon for database operations to avoid RLS recursion issues
      const featuredProducts = await executeNeonQuery<Product>(
        'SELECT * FROM products WHERE featured = true LIMIT 6'
      );
      
      set({ featuredProducts: featuredProducts || [], loading: false });
    } catch (error) {
      console.error('Error fetching featured products from Neon:', error);
      set({ error: (error as Error).message, loading: false });
    }
  },

  setFeaturedProduct: async (productId, featured) => {
    set({ loading: true, error: null });
    try {
      // Use Neon for database operations to avoid RLS recursion issues
      await executeNeonQuery(
        'UPDATE products SET featured = $1, updated_at = NOW() WHERE id = $2',
        [featured, productId]
      );

      // Refresh products and featured products
      await get().fetchProducts();
      await get().fetchFeaturedProducts();
    } catch (error) {
      console.error('Error updating featured product in Neon:', error);
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },
}));