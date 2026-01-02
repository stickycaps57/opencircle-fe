import { useState, useRef, useEffect } from "react";
import deleteIcon from "@src/assets/shared/delete_icon.svg";
import editIcon from "@src/assets/shared/edit_icon.svg";
interface DropdownMenuProps {
  onEdit: () => void;
  onDelete: () => void;
  className?: string;
  editLabel?: string;
  deleteLabel?: string;
  showEdit?: boolean;
  showDelete?: boolean;
}

export function DropdownMenu({
  onEdit,
  onDelete,
  className = "",
  editLabel = "Edit",
  deleteLabel = "Delete",
  showEdit = true,
  showDelete = true,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEdit = () => {
    onEdit();
    setIsOpen(false);
  };

  const handleDelete = () => {
    onDelete();
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Horizontal 3-dot menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="More options"
      >
        <svg
          className="w-5 h-5 text-placeholderbg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 sm:w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
          {showEdit && (
            <button
              onClick={handleEdit}
              className="w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm text-primary hover:bg-gray-100 transition-colors rounded-t-lg flex items.center"
            >
              <img src={editIcon} alt="Edit" className="w-4 h-4 mr-2" />
              {editLabel}
            </button>
          )}
          {showDelete && (
            <button
              onClick={handleDelete}
              className="w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm text-primary hover:bg-gray-100 transition-colors rounded-b-lg flex items-center"
            >
              <img src={deleteIcon} alt="Delete" className="w-4 h-4 mr-2" />
              {deleteLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
