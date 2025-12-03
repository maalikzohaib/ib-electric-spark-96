import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useProductStore } from '@/store/productStore';
import { usePageStore } from '@/store/pageStore';

export const useProductData = () => {
  const { setFeaturedProducts, setCategories, setBrands } = useProductStore();
  const { setPages } = usePageStore();

  const query = useQuery({
    queryKey: ['boot'],
    queryFn: async () => {
      // Add cache-busting timestamp for critical data
      const resp = await fetch('/api/boot', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })
      if (!resp.ok) throw new Error('Failed to load initial data')
      return resp.json()
    },
    staleTime: 30_000, // Reduced from 60s to 30s
    refetchOnWindowFocus: true, // Changed to true to refetch when user returns to tab
    refetchOnMount: true, // Always refetch when component mounts
  })

  useEffect(() => {
    if (query.data) {
      setPages(query.data.pages || [])
      setCategories(query.data.categories || [])
      setBrands(query.data.brands || [])
      setFeaturedProducts(query.data.featuredProducts || [])
    }
  }, [query.data, setPages, setCategories, setBrands, setFeaturedProducts])

  return { loading: query.isLoading, error: query.error as Error | null };
};
