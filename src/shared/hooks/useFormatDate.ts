import { format, formatDistanceToNow, parseISO, isValid, isToday, isTomorrow, isYesterday } from 'date-fns';

/**
 * Hook for formatting dates in a human-readable way using date-fns
 * 
 * @returns Object with formatting functions
 */
export const useFormatDate = () => {
  /**
   * Format a date string to a human-readable format
   * 
   * @param dateString - ISO date string to format
   * @param formatString - date-fns format string (default: 'PPP')
   * @returns Formatted date string
   */
  const formatDate = (dateString: string, formatString: string = 'PPP') => {
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) return dateString;
      return format(date, formatString);
    } catch {
      return dateString;
    }
  };

  /**
   * Format a date string as relative time (e.g., "2 hours ago")
   * 
   * @param dateString - ISO date string to format
   * @param addSuffix - Whether to add a suffix (default: true)
   * @returns Relative time string
   */
  const formatRelativeTime = (dateString: string, addSuffix: boolean = true) => {
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) return dateString;
      return formatDistanceToNow(date, { addSuffix });
    } catch {
      return dateString;
    }
  };

  /**
   * Format a datetime string to a human-readable format
   * 
   * @param dateTimeString - ISO datetime string to format
   * @returns Formatted datetime string
   */
  const formatDateTime = (dateTimeString: string) => {
    try {
      const date = parseISO(dateTimeString);
      if (!isValid(date)) return dateTimeString;
      
      // Format as "Today/Tomorrow/Yesterday at time"
      if (isToday(date)) {
        return `Today at ${format(date, 'p')}`;
      } else if (isTomorrow(date)) {
        return `Tomorrow at ${format(date, 'p')}`;
      } else if (isYesterday(date)) {
        return `Yesterday at ${format(date, 'p')}`;
      }
      
      return format(date, 'PPP p'); // Date with time for other dates
    } catch {
      return dateTimeString;
    }
  };

  /**
   * Format a datetime string to a friendly format with relative day names
   * 
   * @param dateTimeString - ISO datetime string to format
   * @returns Formatted datetime string with relative day names
   */
  const formatFriendlyDateTime = (dateTimeString: string) => {
    try {
      const date = parseISO(dateTimeString);
      if (!isValid(date)) return dateTimeString;
      
      // Format as "Today/Tomorrow/Yesterday at time"
      if (isToday(date)) {
        return `Today at ${format(date, 'p')}`;
      } else if (isTomorrow(date)) {
        return `Tomorrow at ${format(date, 'p')}`;
      } else if (isYesterday(date)) {
        return `Yesterday at ${format(date, 'p')}`;
      }
      
      return format(date, 'PPP p'); // Date with time for other dates
    } catch {
      return dateTimeString;
    }
  };

  return {
    formatDate,
    formatRelativeTime,
    formatDateTime,
    formatFriendlyDateTime
  };
};