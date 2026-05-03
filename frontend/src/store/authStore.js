import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // Actions
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      
      logoutStore: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
      
      setUser: (user) => set({ user, isAuthenticated: !!user }),
    }),
    {
      name: "auth-storage", 
    }
  )
);
