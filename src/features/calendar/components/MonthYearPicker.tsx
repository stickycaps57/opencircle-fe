import { useEffect, useState } from 'react';

interface MonthYearPickerProps {
  value: Date;
  onChange: (newDate: Date) => void;
}

// MonthYearPicker component with select elements for month and year selection
export function MonthYearPicker({ value, onChange }: MonthYearPickerProps) {
  // Extract month and year from the provided date
  const [month, setMonth] = useState<number>(value.getMonth());
  const [year, setYear] = useState<number>(value.getFullYear());

  // Update local state when the value prop changes
  useEffect(() => {
    setMonth(value.getMonth());
    setYear(value.getFullYear());
  }, [value]);

  // Generate month options (0-11)
  const monthOptions = [
    { value: 0, label: 'January' },
    { value: 1, label: 'February' },
    { value: 2, label: 'March' },
    { value: 3, label: 'April' },
    { value: 4, label: 'May' },
    { value: 5, label: 'June' },
    { value: 6, label: 'July' },
    { value: 7, label: 'August' },
    { value: 8, label: 'September' },
    { value: 9, label: 'October' },
    { value: 10, label: 'November' },
    { value: 11, label: 'December' },
  ];

  // Generate year options (current year ± 10)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 21 }, (_, i) => {
    const yearValue = currentYear - 10 + i;
    return { value: yearValue, label: yearValue.toString() };
  });

  // Handle month change
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(e.target.value, 10);
    setMonth(newMonth);
    onChange(new Date(year, newMonth, 1));
  };

  // Handle year change
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(e.target.value, 10);
    setYear(newYear);
    onChange(new Date(newYear, month, 1));
  };

  return (
    <div className="flex space-x-2">
      {/* Month select */}
      <select
        value={month}
        onChange={handleMonthChange}
        className="p-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      >
        {monthOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Year select */}
      <select
        value={year}
        onChange={handleYearChange}
        className="p-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      >
        {yearOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}