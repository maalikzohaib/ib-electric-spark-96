import { create } from 'zustand';
import { supabase, executeNeonQuery, executeNeonQuerySingle } from '@/integrations/supabase/client';

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
  fetchPages: () => Promise<void>;
  createMainPage: (name: string) => Promise<Page>;
  createSubPage: (name: string, parentId: string) => Promise<Page>;
  updatePage: (id: string, updates: Partial<Page>) => Promise<void>;
  deletePage: (id: string, cascadeDelete?: boolean) => Promise<void>;
  reorderPages: (pages: Page[]) => Promise<void>;
  
  // Helper functions
  getPageById: (id: string) => Page | undefined;
  getMainPagesWithChildren: () => PageWithChildren[];
  getSubPagesByParent: (parentId: string) => Page[];
}

export const usePageStore = create<PageStore>((set, get) => ({
  pages: [],
  mainPages: [],
  loading: false,
  error: null,

  fetchPages: async () => {
    console.log('🔄 Fetching pages from Neon database...');
    
    // Check authentication status (still using Supabase for auth)
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log('👤 Current user:', user?.email || 'Not authenticated', authError ? 'Auth error:' + authError.message : '');
    
    set({ loading: true, error: null });
    try {
      // Use Neon for database queries to avoid RLS recursion issues
      const pages = await executeNeonQuery<Page>(
        'SELECT * FROM pages ORDER BY display_order ASC'
      );
      
      console.log('📄 Fetched pages from Neon:', pages.length, pages);
      
      // First set the pages, then calculate mainPagesWithChildren
      set({ pages, loading: false });
      
      // Now calculate mainPagesWithChildren with the updated pages
      const mainPagesWithChildren = get().getMainPagesWithChildren();
      console.log('🏗️ Main pages with children:', mainPagesWithChildren);
      set({ mainPages: mainPagesWithChildren });
    } catch (error) {
      console.error('💥 Error fetching pages from Neon:', error);
      set({ error: (error as Error).message, loading: false });
    }
  },

  createMainPage: async (name: string) => {
    console.log('🚀 Creating main page:', name);
    
    // Check authentication status (still using Supabase for auth)
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log('👤 User creating page:', user?.email || 'Not authenticated', authError ? 'Auth error:' + authError.message : '');
    
    set({ loading: true, error: null });
    try {
      // Get the highest order for main pages
      const mainPages = get().pages.filter(p => p.type === 'main');
      const maxOrder = mainPages.length > 0 ? Math.max(...mainPages.map(p => p.display_order)) : 0;
      
      console.log('📊 Current main pages:', mainPages.length, 'Max order:', maxOrder);
      
      // Generate a slug from the name
      const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      
      // Use Neon for database operations to avoid RLS recursion issues
      const data = await executeNeonQuerySingle<Page>(
        `INSERT INTO pages (name, title, slug, type, display_order, parent_id, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) 
         RETURNING *`,
        [name, name, slug, 'main', maxOrder + 1, null]
      );
      
      console.log('✅ Page created successfully in Neon:', data);

      set((state) => ({
        pages: [...state.pages, data],
        loading: false
      }));
      
      // Refresh main pages with children
      const mainPagesWithChildren = get().getMainPagesWithChildren();
      set({ mainPages: mainPagesWithChildren });
      
      return data;
    } catch (error) {
      console.error('💥 Error creating main page in Neon:', error);
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  createSubPage: async (name: string, parentId: string) => {
    console.log('🚀 Creating subpage:', name, 'for parent:', parentId);
    set({ loading: true, error: null });
    try {
      // Get the highest order for subpages of this parent
      const subPages = get().pages.filter(p => p.parent_id === parentId);
      const maxOrder = subPages.length > 0 ? Math.max(...subPages.map(p => p.display_order)) : 0;
      
      console.log('📊 Current subpages for parent:', subPages.length, 'Max order:', maxOrder);
      
      // Get parent page to create a hierarchical slug
      const parentPage = get().pages.find(p => p.id === parentId);
      
      // Generate a slug from the name
      let slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      
      // If parent page exists, prefix the slug with parent's slug
      if (parentPage && parentPage.slug) {
        slug = `${parentPage.slug}-${slug}`;
      }
      
      // Use Neon for database operations to avoid RLS recursion issues
      const data = await executeNeonQuerySingle<Page>(
        `INSERT INTO pages (name, title, slug, type, parent_id, display_order, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) 
         RETURNING *`,
        [name, name, slug, 'sub', parentId, maxOrder + 1]
      );
      
      console.log('✅ Subpage created successfully in Neon:', data);

      set((state) => ({
        pages: [...state.pages, data],
        loading: false
      }));
      
      // Refresh main pages with children
      const mainPagesWithChildren = get().getMainPagesWithChildren();
      set({ mainPages: mainPagesWithChildren });
      
      return data;
    } catch (error) {
      console.error('💥 Error creating subpage in Neon:', error);
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  updatePage: async (id: string, updates: Partial<Page>) => {
    set({ loading: true, error: null });
    try {
      // Build dynamic SQL query for updates
      const updateFields = Object.keys(updates).filter(key => key !== 'id');
      const setClause = updateFields.map((field, index) => `${field} = $${index + 2}`).join(', ');
      
      // Use Neon for database operations to avoid RLS recursion issues
      const data = await executeNeonQuerySingle<Page>(
        `UPDATE pages SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`,
        [id, ...updateFields.map(field => updates[field as keyof Page])]
      );

      set((state) => ({
        pages: state.pages.map((page) =>
          page.id === id ? { ...page, ...data } : page
        ),
        loading: false
      }));
      
      // Refresh main pages with children
      const mainPagesWithChildren = get().getMainPagesWithChildren();
      set({ mainPages: mainPagesWithChildren });
    } catch (error) {
      console.error('Error updating page:', error);
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  deletePage: async (id: string, cascadeDelete: boolean = false) => {
    set({ loading: true, error: null });
    try {
      // Check if the page has children before deleting
      const hasChildren = get().pages.some(page => page.parent_id === id);
      
      if (hasChildren) {
        if (cascadeDelete) {
          // Option 2: Implement cascading delete
          console.log('🔄 Performing cascading delete for page:', id);
          const childPages = get().pages.filter(page => page.parent_id === id);
          for (const childPage of childPages) {
            // Recursively delete children (this will handle nested hierarchies)
            await get().deletePage(childPage.id, true);
          }
        } else {
          // Option 1: Prevent deletion and throw an error
          throw new Error("Cannot delete page with children. Delete all child pages first or use cascade delete option.");
        }
      }
      
      // Check if there are products referencing this page
      const checkProductsResult = await executeNeonQuerySingle(
        'SELECT COUNT(*) FROM products WHERE page_id = $1',
        [id]
      );
      
      const productCount = parseInt(checkProductsResult.count);
      
      if (productCount > 0) {
        // Update products to remove the reference to this page
        await executeNeonQuery(
          'UPDATE products SET page_id = NULL WHERE page_id = $1',
          [id]
        );
        console.log(`🔄 Updated ${productCount} products to remove reference to page ${id}`);
      }
      
      // Now delete the page
      await executeNeonQuery(
        'DELETE FROM pages WHERE id = $1',
        [id]
      );

      set((state) => ({
        pages: state.pages.filter((page) => page.id !== id),
        loading: false
      }));
      
      // Refresh main pages with children
      const mainPagesWithChildren = get().getMainPagesWithChildren();
      set({ mainPages: mainPagesWithChildren });
    } catch (error) {
      console.error('Error deleting page in Neon:', error);
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  reorderPages: async (reorderedPages: Page[]) => {
    set({ loading: true, error: null });
    try {
      // Update display_order for each page using Neon to avoid RLS recursion issues
      const updates = reorderedPages.map((page, index) => ({
        id: page.id,
        display_order: index + 1
      }));

      for (const update of updates) {
        await executeNeonQuery(
          'UPDATE pages SET display_order = $1, updated_at = NOW() WHERE id = $2',
          [update.display_order, update.id]
        );
      }

      // Update local state
      set((state) => ({
        pages: state.pages.map((page) => {
          const update = updates.find(u => u.id === page.id);
          return update ? { ...page, display_order: update.display_order } : page;
        }),
        loading: false
      }));
      
      // Refresh main pages with children
      const mainPagesWithChildren = get().getMainPagesWithChildren();
      set({ mainPages: mainPagesWithChildren });
    } catch (error) {
      console.error('Error reordering pages in Neon:', error);
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
  }
}));