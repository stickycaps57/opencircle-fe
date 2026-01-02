import { useCallback } from 'react';

/**
 * A hook that provides a function to convert strings to title case
 * 
 * @returns A function that converts a string to title case
 */
export function useTitleCase() {
  /**
   * Converts a string to title case (first letter of each word capitalized)
   * 
   * @param str - The string to convert to title case
   * @returns The string converted to title case
   */
  const toTitleCase = useCallback((str: string): string => {
    if (!str) return str;
    
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }, []);

  return { toTitleCase };
}