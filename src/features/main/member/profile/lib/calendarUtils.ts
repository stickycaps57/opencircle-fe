import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  format,
  addDays,
  getDay,
} from 'date-fns';

/**
 * Builds a month grid (6×7) for the given date
 * @param date - The date to build the month grid for
 * @returns An array of weeks, each containing 7 days
 */
export function buildMonthGrid(date: Date): Date[][] {
  const firstDayOfMonth = startOfMonth(date);
  const lastDayOfMonth = endOfMonth(date);
  
  // Get the first day of the first week of the month
  const firstDayOfFirstWeek = startOfWeek(firstDayOfMonth, { weekStartsOn: 0 }); // 0 = Sunday
  
  // Get the last day of the last week of the month
  const lastDayOfLastWeek = endOfWeek(lastDayOfMonth, { weekStartsOn: 0 });
  
  // Get all days between the first day of the first week and the last day of the last week
  const allDays = eachDayOfInterval({
    start: firstDayOfFirstWeek,
    end: lastDayOfLastWeek,
  });
  
  // Group days into weeks (7 days per week)
  const weeks: Date[][] = [];
  let week: Date[] = [];
  
  allDays.forEach((day, index) => {
    week.push(day);
    
    // If we've added 7 days to the week or we're at the end of the array
    if (getDay(day) === 6 || index === allDays.length - 1) {
      weeks.push(week);
      week = [];
    }
  });
  
  // Ensure we have exactly 6 weeks (42 days) for consistent UI
  while (weeks.length < 6) {
    const lastWeek = weeks[weeks.length - 1];
    const lastDay = lastWeek[lastWeek.length - 1];
    
    const nextWeek = Array.from({ length: 7 }, (_, i) => addDays(lastDay, i + 1));
    weeks.push(nextWeek);
  }
  
  return weeks;
}

/**
 * Checks if a date is in the same month as the view date
 * @param date - The date to check
 * @param viewDate - The reference date (usually the currently viewed month)
 * @returns True if the date is in the same month as the view date
 */
export function isInMonth(date: Date, viewDate: Date): boolean {
  return isSameMonth(date, viewDate);
}

/**
 * Formats a date as YYYY-MM-DD for grouping events by day
 * @param date - The date to format
 * @returns The date formatted as YYYY-MM-DD
 */
export function ymd(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Gets the month and year string for display
 * @param date - The date to format
 * @returns The month and year string (e.g., "April, 2025")
 */
export function getMonthYearString(date: Date): string {
  return format(date, 'MMMM, yyyy');
}

/**
 * Gets the day of month string for display
 * @param date - The date to format
 * @returns The day of month string (e.g., "1")
 */
export function getDayString(date: Date): string {
  return format(date, 'd');
}

/**
 * Gets the day name for display
 * @param date - The date to format
 * @returns The day name (e.g., "Monday")
 */
export function getDayName(date: Date): string {
  return format(date, 'EEEE');
}

/**
 * Gets the short day name for display
 * @param date - The date to format
 * @returns The short day name (e.g., "Mon")
 */
export function getShortDayName(date: Date): string {
  return format(date, 'EEE');
}