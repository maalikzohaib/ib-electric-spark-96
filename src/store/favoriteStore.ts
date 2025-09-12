import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from './productStore';

interface FavoriteStore {
  favorites: string[];
  addToFavorites: (product: Product | string) => void;
  removeFromFavorites: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  clearFavorites: () => void;
  getFavoritesCount: () => number;
}

export const useFavoriteStore = create<FavoriteStore>(
  persist(
    (set, get) => ({
      favorites: [],
      
      addToFavorites: (product) => {
        const { favorites } = get();
        const productId = typeof product === 'string' ? product : product.id;
        const isAlreadyFavorite = favorites.includes(productId);
        
        if (!isAlreadyFavorite) {
          set({ favorites: [...favorites, productId] });
        }
      },
      
      removeFromFavorites: (productId) => {
        const { favorites } = get();
        set({ favorites: favorites.filter(id => id !== productId) });
      },
      
      isFavorite: (productId) => {
        const { favorites } = get();
        return favorites.includes(productId);
      },
      
      clearFavorites: () => {
        set({ favorites: [] });
      },
      
      getFavoritesCount: () => {
        return get().favorites.length;
      }
    }),
    {
      name: 'favorites-storage',
    }
  )
);