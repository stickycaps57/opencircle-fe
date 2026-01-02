import { useAuthStore } from "@src/shared/store";
import { useState, useEffect, useRef, useCallback } from "react";
import type {
  MemberLoginResponse,
  OrganizationLoginResponse,
  MemberLoginSuccess,
  OrganizationLoginSuccess,
} from "../schema/auth.types";
import { fetchAuthUser } from "./auth.api";

// Type for the auth user response
export type AuthUserResponse = MemberLoginResponse | OrganizationLoginResponse;

/**
 * Validates the current user session and updates the auth store
 * @returns Object containing validation result and any error
 */
export const validateSession = async (): Promise<{
  isValid: boolean;
  error?: Error;
}> => {
  try {
    // Check if user is already authenticated
    const authStore = useAuthStore.getState();

    // If not authenticated, don't make the API call
    if (!authStore.isAuthenticated) {
      return { isValid: false };
    }

    const userData = await fetchAuthUser();

    // If no user data returned, logout and return invalid session
    if (!userData) {
      authStore.logout();
      return { isValid: false };
    }

    // Create proper login response format based on user data
    // We need to convert the User type to MemberLoginResponse or OrganizationLoginResponse
    let loginData;

    // Check if userData already has a user or organization property
    if ("user" in userData) {
      // It's already in MemberLoginResponse format
      loginData = userData;
    } else if ("organization" in userData) {
      // It's already in OrganizationLoginResponse format
      loginData = userData;
    } else {
      // It's a direct User object, determine if it's a Member or Organization by role_id
      const expiresAt = new Date(
        Date.now() + 24 * 60 * 60 * 1000
      ).toISOString();

      if ("role_id" in userData) {
        if (userData.role_id === 1) {
          // Member role
          loginData = {
            user: userData,
            expires_at: expiresAt,
          };
        } else if (userData.role_id === 2) {
          // Organization role
          loginData = {
            organization: userData,
            expires_at: expiresAt,
          };
        }
      } else {
        // Default to user if role_id is not present
        loginData = {
          user: userData,
          expires_at: expiresAt,
        };
      }
    }

    // Update auth store with user data
    authStore.login(loginData as MemberLoginSuccess | OrganizationLoginSuccess);

    return { isValid: true };
  } catch (error) {
    console.error("Session validation failed:", error);

    // Clear auth store on validation failure
    const authStore = useAuthStore.getState();
    authStore.logout();

    return {
      isValid: false,
      error:
        error instanceof Error
          ? error
          : new Error("Unknown error during session validation"),
    };
  }
};

/**
 * Hook for auth hydration - checks if a user's session is still valid
 * and updates the auth store accordingly
 */
export const useAuthHydration = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Checks the current session validity and updates auth store
   */
  const checkSession = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { isValid, error } = await validateSession();

      if (!isValid && error) {
        setError(error);
      }

      return isValid;
    } catch (err) {
      const error =
        err instanceof Error
          ? err
          : new Error("Unknown error during auth hydration");
      setError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    checkSession,
  };
};

/**
 * Hook for periodic auth session validation
 * @param intervalMs - Interval in milliseconds between checks (default: 5 minutes)
 * @param enabled - Whether the periodic check is enabled (default: true)
 */
export const usePeriodicAuthCheck = (
  intervalMs = 5 * 60 * 1000,
  enabled = true
) => {
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const intervalRef = useRef<number | null>(null);
  const { isAuthenticated } = useAuthStore();

  /**
   * Stops the periodic check interval
   */
  const stopPeriodicCheck = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  /**
   * Performs a session validation check
   */
  const performCheck = useCallback(async () => {
    // Only check if user is authenticated
    if (!isAuthenticated) {
      // If not authenticated, stop the interval
      stopPeriodicCheck();
      return;
    }

    setIsChecking(true);
    setError(null);

    try {
      await validateSession();
      setLastChecked(new Date());
    } catch (err) {
      const error =
        err instanceof Error
          ? err
          : new Error("Unknown error during periodic auth check");
      setError(error);
      console.error("Periodic auth check failed:", error);
    } finally {
      setIsChecking(false);
    }
  }, [isAuthenticated, stopPeriodicCheck]);

  /**
   * Starts the periodic check interval
   */
  const startPeriodicCheck = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Only start if enabled and interval is valid
    if (enabled && intervalMs > 0) {
      intervalRef.current = window.setInterval(performCheck, intervalMs);
    }
  }, [enabled, intervalMs, performCheck]);

  // Set up and clean up the interval
  useEffect(() => {
    // Only start the interval if enabled AND user is authenticated
    if (enabled && isAuthenticated) {
      startPeriodicCheck();
    } else {
      // If not authenticated or not enabled, make sure to stop any existing interval
      stopPeriodicCheck();
    }

    return () => {
      stopPeriodicCheck();
    };
  }, [enabled, intervalMs, isAuthenticated, startPeriodicCheck]);

  return {
    isChecking,
    lastChecked,
    error,
    performCheck,
    startPeriodicCheck,
    stopPeriodicCheck,
  };
};
