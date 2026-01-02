import { useState, useRef, useEffect } from "react";
import dropdownIcon from "@src/assets/shared/dropdown_icon.svg";
import eventPstIcon from "@src/assets/shared/event_pst.png";
import postPstIcon from "@src/assets/shared/post_pst.png";

type IconChoice = "event" | "post";

interface IconDropdownProps {
  value: IconChoice;
  setValue: (v: IconChoice) => void;
  className?: string;
}

export function IconDropdown({ value, setValue, className = "" }: IconDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedSrc = value === "event" ? eventPstIcon : postPstIcon;
  const alternate: IconChoice = value === "event" ? "post" : "event";
  const alternateSrc = alternate === "event" ? eventPstIcon : postPstIcon;
  const alternateLabel = alternate === "event" ? "Event" : "Post";

  return (
    <div className={`relative flex items-center gap-2 ${className}`} ref={containerRef}>
      <img src={selectedSrc} alt={value} className="w-5 h-5" />
      <img
        src={dropdownIcon}
        alt="Options"
        className="w-8 h-8 cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      />
      {isOpen && (
        <div className="absolute right-0 mt-20 w-28 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
          <button
            className="w-full px-2 py-2 flex items-center justify-start gap-2 hover:bg-gray-100 rounded-lg"
            onClick={() => {
              setValue(alternate);
              setIsOpen(false);
            }}
          >
            <img src={alternateSrc} alt={alternate} className="w-5 h-5" />
            <span className="text-primary text-responsive-xs">{alternateLabel}</span>
          </button>
        </div>
      )}
    </div>
  );
}
