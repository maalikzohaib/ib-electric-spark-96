import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useProductStore } from '@/store/productStore';
import { usePageStore } from '@/store/pageStore';

export const useProductData = () => {
  const { setFeaturedProducts, setCategories } = useProductStore();
  const { setPages } = usePageStore();

  const query = useQuery({
    queryKey: ['boot'],
    queryFn: async () => {
      const resp = await fetch('/api/boot')
      if (!resp.ok) throw new Error('Failed to load initial data')
      return resp.json()
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (query.data) {
      setPages(query.data.pages || [])
      setCategories(query.data.categories || [])
      setFeaturedProducts(query.data.featuredProducts || [])
    }
  }, [query.data, setPages, setCategories, setFeaturedProducts])

  return { loading: query.isLoading, error: query.error as Error | null };
};
