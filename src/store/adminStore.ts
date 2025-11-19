import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AdminStore {
  isAuthenticated: boolean;
  lastActive: number | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  checkSession: () => void;
}

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'Electric@12345';
const SESSION_TIMEOUT = 15 * 60 * 1000; // 15 minutes

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      lastActive: null,

      login: (username: string, password: string) => {
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
          console.log('✅ Admin authenticated successfully');
          set({
            isAuthenticated: true,
            lastActive: Date.now()
          });
          return true;
        }
        return false;
      },

      logout: () => {
        console.log('✅ Admin logged out');
        set({
          isAuthenticated: false,
          lastActive: null
        });
        localStorage.removeItem('admin-storage'); // Clear persisted state
      },

      checkSession: () => {
        const { isAuthenticated, lastActive } = get();
        if (!isAuthenticated || !lastActive) return;

        const now = Date.now();
        if (now - lastActive > SESSION_TIMEOUT) {
          console.log('⚠️ Session expired');
          get().logout();
        } else {
          set({ lastActive: now });
        }
      },
    }),
    {
      name: 'admin-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage),
    }
  )
);