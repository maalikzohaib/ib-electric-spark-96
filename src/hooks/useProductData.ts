import { useEffect } from 'react';
import { useProductStore } from '@/store/productStore';

export const useProductData = () => {
  const { fetchProducts, fetchCategories, fetchFeaturedProducts, loading, error } = useProductStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchProducts(),
          fetchCategories(),
          fetchFeaturedProducts()
        ]);
      } catch (error) {
        console.error('Error loading product data:', error);
      }
    };

    loadData();
  }, [fetchProducts, fetchCategories, fetchFeaturedProducts]);

  return { loading, error };
};