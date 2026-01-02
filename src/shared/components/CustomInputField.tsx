interface CustomInputFieldProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
  className?: string;
}

export const CustomInputField = ({
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  className = "",
}: CustomInputFieldProps) => {
  return (
    <div className={`relative ${className}`}>
      <div className="w-full px-4 py-1 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent bg-white text-responsive-sm h-[48px] flex flex-col">
        <div className="text-placeholderbg text-xs leading-tight">
          {placeholder}
        </div>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full bg-transparent border-none outline-none p-0 text-primary leading-tight"
          required={required}
        />
      </div>
    </div>
  );
};
