import { QueryClient } from '@tanstack/react-query';

// Global query client instance for cache invalidation
let globalQueryClient: QueryClient | null = null;

export const setQueryClient = (client: QueryClient) => {
  globalQueryClient = client;
};

export const getQueryClient = () => globalQueryClient;

// Helper to invalidate boot cache after mutations
export const invalidateBootCache = () => {
  if (globalQueryClient) {
    globalQueryClient.invalidateQueries({ queryKey: ['boot'] });
  }
};
