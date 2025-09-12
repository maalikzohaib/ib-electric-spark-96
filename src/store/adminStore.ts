import { create } from 'zustand';

interface AdminStore {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'Electric@12345';

export const useAdminStore = create<AdminStore>()((set) => ({
  // Always start as NOT authenticated (no persistence)
  isAuthenticated: false,
  
  login: (username: string, password: string) => {
    // Only allow login with exact credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      console.log('✅ Admin authenticated successfully');
      set({ isAuthenticated: true });
      return true;
    }
    return false;
  },
  
  logout: () => {
    console.log('✅ Admin logged out');
    set({ isAuthenticated: false });
  },
}));