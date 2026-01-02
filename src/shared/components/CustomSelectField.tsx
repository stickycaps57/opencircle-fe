import { useState, useRef, useEffect } from "react";
import dropdownIcon from "@src/assets/shared/dropdown_icon.svg";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectFieldProps {
  name: string;
  value: string;
  onChange: (name: string, value: string, label: string) => void;
  options: Option[];
  placeholder: string;
  required?: boolean;
  className?: string;
}

export const CustomSelectField = ({
  name,
  value,
  onChange,
  options,
  placeholder,
  // required = false,
  className = "",
}: CustomSelectFieldProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  // Find the selected option by either value or label
  const selectedOption = options.find(
    (option) => option.value === value || option.label === value
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (optionValue: string, optionLabel: string) => {
    onChange(name, optionValue, optionLabel);
    setIsOpen(false);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex-1" ref={selectRef}>
        <div
          className="w-full px-4 py-1 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent bg-white cursor-pointer text-responsive-sm h-[48px] flex flex-col"
          onClick={handleToggle}
        >
          <div className="text-placeholderbg text-xs leading-tight">
            {placeholder}
          </div>
          <div className="text-primary leading-tight">
            {selectedOption ? selectedOption.label : ""}
          </div>
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
            {options.length === 0 ? (
              <div className="px-4 py-3 text-primary-75 text-responsive-xs">
                No options available
              </div>
            ) : (
              options.map((option) => (
                <div
                  key={option.value}
                  className={`px-4 py-3 ${
                    option.value === ""
                      ? "text-primary-75 cursor-default"
                      : "hover:bg-gray-50 cursor-pointer"
                  } text-responsive-xs`}
                  onClick={
                    option.value !== ""
                      ? () => handleSelect(option.value, option.label)
                      : undefined
                  }
                >
                  {option.label}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <img
        src={dropdownIcon}
        alt="Dropdown"
        className="w-8 h-8 flex-shrink-0 cursor-pointer"
        onClick={handleToggle}
      />
    </div>
  );
};
