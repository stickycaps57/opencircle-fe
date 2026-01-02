import { useRef } from "react";
import datePickerIcon from "@src/assets/shared/date_icon.svg";
import { useFormatDate } from "@src/shared/hooks";

interface CustomDateFieldProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export const CustomDateField = ({
  name,
  value,
  onChange,
  // placeholder,
  required = false,
  className = "",
}: CustomDateFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { formatDateTime } = useFormatDate();

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.showPicker?.();
    }
  };

  const formatDisplayValue = (dateTimeValue: string) => {
    if (!dateTimeValue) return "";

    try {
      return formatDateTime(dateTimeValue);
    } catch {
      return dateTimeValue;
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex-1">
        {/* Styled container */}
        <div
          className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                     focus-within:ring-2 focus-within:ring-primary 
                     focus-within:border-transparent bg-white 
                     text-responsive-sm h-[48px] flex flex-col justify-start cursor-pointer"
          onClick={handleClick}
        >
          {/* <div className="text-placeholderbg text-xs leading-tight">
            {placeholder}
          </div> */}
          <div className="text-primary leading-tight">
            {formatDisplayValue(value)}
          </div>
        </div>

        {/* Actual input field (invisible but interactive) */}
        <input
          ref={inputRef}
          type="datetime-local"
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="absolute w-full h-full inset-0 opacity-0 cursor-pointer pointer-events-none"
        />
      </div>

      <img
        src={datePickerIcon}
        alt="Date Picker"
        className="w-6 h-6 flex-shrink-0 cursor-pointer ml-2"
        onClick={handleClick}
      />
    </div>
  );
};
