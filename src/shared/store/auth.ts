import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthState } from "@src/features/auth/schema/auth.types";

/**
 * Zustand store for authentication state with persistence
 * Stores user data and authentication status
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      expiresAt: null,
      isAuthenticated: false,

      /**
       * Login action - sets user data and authentication status
       * @param userData - User data and expiration from API response (either Member or Organization)
       */
      login: (userData) => {
        // Check if it's a member login response (has user property)
        if ('user' in userData) {
          set({
            user: userData.user,
            expiresAt: userData.expires_at,
            isAuthenticated: true,
          });
        }
        // Check if it's an organization login response (has organization property)
        else if ('organization' in userData) {
          set({
            user: userData.organization,
            expiresAt: userData.expires_at,
            isAuthenticated: true,
          });
        }
      },

      /**
       * Logout action - clears user data and authentication status
       */
      logout: () => {
        set({
          user: null,
          expiresAt: null,
          isAuthenticated: false,
        });
      },
      updateTwoFactorEnabled: (enabled: 0 | 1) => {
        set((state) => ({
          user: state.user ? { ...state.user, two_factor_enabled: enabled } : state.user,
        }));
      },
    }),
    {
      name: "auth-storage", // name of the item in the storage
      storage: createJSONStorage(() => localStorage), // use localStorage for persistence
    }
  )
);
