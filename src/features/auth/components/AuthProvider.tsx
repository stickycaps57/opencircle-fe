import { useEffect, useState } from "react";
import type { PropsWithChildren } from "react";
import { useAuthStore } from "@src/shared/store";
import { useAuthHydration, usePeriodicAuthCheck } from "../lib/auth.hydration";

type AuthProviderProps = {
  /**
   * Whether to enable periodic auth checks
   * @default true
   */
  enablePeriodicCheck?: boolean;

  /**
   * Interval in milliseconds for periodic auth checks
   * @default 5 minutes (300000ms)
   */
  checkIntervalMs?: number;
} & PropsWithChildren;

/**
 * AuthProvider component that handles authentication hydration
 * and periodic session validation
 */
export function AuthProvider({
  children,
  enablePeriodicCheck = true,
  checkIntervalMs = 5 * 60 * 1000, // 5 minutes
}: AuthProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const { isLoading, error, checkSession } = useAuthHydration();

  // Set up periodic auth check - the hook internally handles the isAuthenticated state
  usePeriodicAuthCheck(checkIntervalMs, enablePeriodicCheck);

  // Initial auth check on mount
  useEffect(() => {
    const initializeAuth = async () => {
      
      const authStore = useAuthStore.getState();
      if (authStore.isAuthenticated) {
        setIsInitialized(true);
      }
      
      try {
        await checkSession();
      } catch (error) {
        console.error("Auth initialization failed:", error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  // Show loading state while initializing
  if (!isInitialized && isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  // Show error state if initialization failed
  if (error && !isInitialized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-500">
        <p>Authentication Error</p>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

  // Render children once initialized
  return <>{children}</>;
}
