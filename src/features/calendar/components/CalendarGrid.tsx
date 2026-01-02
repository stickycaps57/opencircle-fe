import { useState } from "react";
import { addMonths, subMonths } from "date-fns";
import type { CalendarEvent } from "../schema/calendar.type";
import {
  buildMonthGrid,
  getMonthYearString,
  isInMonth,
  ymd,
} from "../../main/member/profile/lib/calendarUtils";
import { DayCell } from "./DayCell";
import { MonthYearPicker } from "./MonthYearPicker";
import type { EventsByDate } from "../schema/calendar.type";

// Array of weekday names
const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THUR", "FRI", "SAT"];

interface CalendarProps {
  events?: CalendarEvent[];
  initialDate?: Date;
  onDateSelect?: (date: Date) => void;
  onMonthChange?: (date: Date) => void;
  onEventSelect?: (event: CalendarEvent) => void;
}

// Calendar component that displays a month view with events
export function CalendarGrid({
  events = [],
  initialDate = new Date(),
  onDateSelect,
  onMonthChange,
  onEventSelect,
}: CalendarProps) {
  // Current view date state (month/year being displayed)
  const [viewDate, setViewDate] = useState<Date>(initialDate);

  // Group events by date (YYYY-MM-DD)
  const eventsByDate: EventsByDate = events.reduce<EventsByDate>(
    (acc, event) => {
      const dateKey = ymd(new Date(event.event_date));
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(event);
      return acc;
    },
    {}
  );

  // Generate the month grid
  const monthGrid = buildMonthGrid(viewDate);

  // Handle previous month navigation
  const handlePrevMonth = () => {
    const newDate = subMonths(viewDate, 1);
    setViewDate(newDate);
    onMonthChange?.(newDate);
  };

  // Handle next month navigation
  const handleNextMonth = () => {
    const newDate = addMonths(viewDate, 1);
    setViewDate(newDate);
    onMonthChange?.(newDate);
  };

  // Handle date selection
  const handleDateClick = (date: Date) => {
    onDateSelect?.(date);
  };

  // Handle month/year picker change
  const handleMonthYearChange = (newDate: Date) => {
    setViewDate(newDate);
    onMonthChange?.(newDate);
  };

  return (
    <div className="w-full lg:w-[90%] mx-auto p-3 sm:p-4 md:p-6">
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800 hidden md:block">
            {getMonthYearString(viewDate)}
          </h2>
          <div className="md:hidden">
            <MonthYearPicker
              value={viewDate}
              onChange={handleMonthYearChange}
            />
          </div>
          <div className="flex space-x-2 items-center">
            <div className="hidden md:block">
              <MonthYearPicker
                value={viewDate}
                onChange={handleMonthYearChange}
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="Previous month"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="Next month"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="overflow-hidden rounded-lg">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="bg-gray-100 py-2 text-center text-xs font-semibold text-gray-700"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="bg-gray-200 gap-px">
            {monthGrid.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 gap-px">
                {week.map((day, dayIndex) => {
                  const dateKey = ymd(day);
                  const dayEvents = eventsByDate[dateKey] || [];
                  const isCurrentMonth = isInMonth(day, viewDate);

                  return (
                    <DayCell
                      key={`${weekIndex}-${dayIndex}`}
                      date={day}
                      inMonth={isCurrentMonth}
                      events={dayEvents}
                      onDateClick={handleDateClick}
                      onEventClick={onEventSelect}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
