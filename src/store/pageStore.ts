import { create } from 'zustand';
import { invalidateBootCache } from '@/lib/queryClient';

let pagesInFlight: Promise<void> | null = null;

export interface Page {
  id: string;
  name: string;
  title: string;
  slug: string;
  parent_id: string | null;
  type: 'main' | 'sub';
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface PageWithChildren extends Page {
  children?: Page[];
}

interface PageStore {
  pages: Page[];
  mainPages: PageWithChildren[];
  loading: boolean;
  error: string | null;

  // CRUD operations
  fetchPages: (force?: boolean) => Promise<void>;
  createMainPage: (name: string) => Promise<Page>;
  createSubPage: (name: string, parentId: string) => Promise<Page>;
  updatePage: (id: string, updates: Partial<Page>) => Promise<void>;
  deletePage: (id: string, cascadeDelete?: boolean) => Promise<void>;
  reorderPages: (pages: Page[]) => Promise<void>;

  // Helper functions
  getPageById: (id: string) => Page | undefined;
  getMainPagesWithChildren: () => PageWithChildren[];
  getSubPagesByParent: (parentId: string) => Page[];

  // Boot setter
  setPages: (pages: Page[]) => void;
}

export const usePageStore = create<PageStore>((set, get) => ({
  pages: [],
  mainPages: [],
  loading: false,
  error: null,

  fetchPages: async (force: boolean = false) => {
    // Skip if pages already loaded and not forcing refresh
    if (!force && get().pages.length > 0) return;
    // Avoid duplicate concurrent fetches
    if (pagesInFlight) { await pagesInFlight; return; }
    set({ loading: true, error: null });
    try {
      pagesInFlight = (async () => {
        const resp = await fetch('/api/boot');
        if (!resp.ok) throw new Error('Failed to load pages');
        const data = await resp.json();
        const pages = data?.pages || [];
        set({ pages, loading: false });
        const mainPagesWithChildren = get().getMainPagesWithChildren();
        set({ mainPages: mainPagesWithChildren });
      })();
      await pagesInFlight;
    } catch (error) {
      console.error('Error fetching pages:', error);
      set({ error: (error as Error).message, loading: false, pages: [], mainPages: [] });
    }
    finally { pagesInFlight = null; }
  },

  createMainPage: async (name: string) => {
    set({ loading: true, error: null });
    try {
      const resp = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type: 'main' })
      })
      if (!resp.ok) throw new Error('Failed to create page')
      const data: Page = await resp.json()
      set((state) => ({ pages: [...state.pages, data], loading: false }))
      const mainPagesWithChildren = get().getMainPagesWithChildren();
      set({ mainPages: mainPagesWithChildren });
      
      // Invalidate React Query cache to ensure fresh data on next fetch
      invalidateBootCache();
      
      return data
    } catch (error) {
      console.error('Error creating main page:', error);
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  createSubPage: async (name: string, parentId: string) => {
    set({ loading: true, error: null });
    try {
      const resp = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type: 'sub', parent_id: parentId })
      })
      if (!resp.ok) throw new Error('Failed to create subpage')
      const data: Page = await resp.json()
      set((state) => ({ pages: [...state.pages, data], loading: false }));
      const mainPagesWithChildren = get().getMainPagesWithChildren();
      set({ mainPages: mainPagesWithChildren });
      
      // Invalidate React Query cache to ensure fresh data on next fetch
      invalidateBootCache();
      
      return data;
    } catch (error) {
      console.error('Error creating subpage:', error);
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  updatePage: async (id: string, updates: Partial<Page>) => {
    set({ loading: true, error: null });
    try {
      const resp = await fetch(`/api/pages?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      if (!resp.ok) throw new Error('Failed to update page')
      const data: Page = await resp.json()

      set((state) => ({
        pages: state.pages.map((page) =>
          page.id === id ? { ...page, ...data } : page
        ),
        loading: false
      }));
      const mainPagesWithChildren = get().getMainPagesWithChildren();
      set({ mainPages: mainPagesWithChildren });
      
      // Invalidate React Query cache to ensure fresh data on next fetch
      invalidateBootCache();
    } catch (error) {
      console.error('Error updating page:', error);
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  deletePage: async (id: string, cascadeDelete: boolean = false) => {
    set({ loading: true, error: null });
    try {
      // Cascade behavior would be implemented server-side
      await fetch(`/api/pages?id=${id}`, { method: 'DELETE' })

      set((state) => ({
        pages: state.pages.filter((page) => page.id !== id),
        loading: false
      }));
      const mainPagesWithChildren = get().getMainPagesWithChildren();
      set({ mainPages: mainPagesWithChildren });
      
      // Invalidate React Query cache to ensure fresh data on next fetch
      invalidateBootCache();
    } catch (error) {
      console.error('Error deleting page:', error);
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  reorderPages: async (reorderedPages: Page[]) => {
    set({ loading: true, error: null });
    try {
      const updates = reorderedPages.map((page, index) => ({
        id: page.id,
        display_order: index + 1
      }));
      await fetch('/api/pages?action=reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates })
      })

      // Update local state
      set((state) => ({
        pages: state.pages.map((page) => {
          const update = updates.find(u => u.id === page.id);
          return update ? { ...page, display_order: update.display_order } : page;
        }),
        loading: false
      }));
      const mainPagesWithChildren = get().getMainPagesWithChildren();
      set({ mainPages: mainPagesWithChildren });
      
      // Invalidate React Query cache to ensure fresh data on next fetch
      invalidateBootCache();
    } catch (error) {
      console.error('Error reordering pages:', error);
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  getPageById: (id: string) => {
    return get().pages.find((page) => page.id === id);
  },

  getMainPagesWithChildren: () => {
    const { pages } = get();
    const mainPages = pages.filter(p => p.type === 'main')
      .sort((a, b) => a.display_order - b.display_order);

    return mainPages.map(mainPage => ({
      ...mainPage,
      children: pages
        .filter(p => p.parent_id === mainPage.id)
        .sort((a, b) => a.display_order - b.display_order)
    }));
  },

  getSubPagesByParent: (parentId: string) => {
    return get().pages
      .filter(p => p.parent_id === parentId)
      .sort((a, b) => a.display_order - b.display_order);
  },

  setPages: (pages: Page[]) => {
    set({ pages })
    const mainPagesWithChildren = get().getMainPagesWithChildren();
    set({ mainPages: mainPagesWithChildren });
  }
}));
