import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: 'Fans' | 'Bulbs';
  brand: string;
  availability: 'In Stock' | 'Out of Stock';
  images: string[];
  mainImage: string;
  color?: string;
  variant?: string;
  isFeatured?: boolean;
}

interface ProductStore {
  products: Product[];
  categories: string[];
  featuredProducts: string[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  setFeaturedProducts: (productIds: string[]) => void;
  getProductById: (id: string) => Product | undefined;
  getFeaturedProducts: () => Product[];
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: [],
      categories: ['Fans', 'Bulbs'],
      featuredProducts: [],
      
      addProduct: (product) => {
        const newProduct: Product = {
          ...product,
          id: Date.now().toString(),
        };
        set((state) => ({
          products: [...state.products, newProduct],
        }));
      },
      
      updateProduct: (id, productUpdate) => {
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id ? { ...product, ...productUpdate } : product
          ),
        }));
      },
      
      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((product) => product.id !== id),
          featuredProducts: state.featuredProducts.filter((fId) => fId !== id),
        }));
      },
      
      setFeaturedProducts: (productIds) => {
        set({ featuredProducts: productIds.slice(0, 3) });
      },
      
      getProductById: (id) => {
        return get().products.find((product) => product.id === id);
      },
      
      getFeaturedProducts: () => {
        const { products, featuredProducts } = get();
        return featuredProducts
          .map((id) => products.find((product) => product.id === id))
          .filter(Boolean) as Product[];
      },
    }),
    {
      name: 'ib-electric-store',
    }
  )
);