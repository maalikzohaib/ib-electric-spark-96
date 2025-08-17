import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminStore {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'Electric@12345';

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      
      login: (username: string, password: string) => {
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },
      
      logout: () => {
        set({ isAuthenticated: false });
      },
    }),
    {
      name: 'ib-admin-auth',
    }
  )
);