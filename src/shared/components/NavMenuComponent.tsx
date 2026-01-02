import { useState, useEffect } from "react";
import { useRedirect } from "../hooks/useNavigate";

export interface MenuItem {
  id: string;
  label: string;
  activeIcon: string;
  icon: string;
  redirectPage: string;
}

interface NavMenuProps {
  menuItems: MenuItem[];
  activeItem?: string;
}

export function NavMenuComponent({ menuItems, activeItem }: NavMenuProps) {
  // If activeItem is explicitly an empty string, don't set any active item
  // Otherwise, fall back to the first menu item
  const [currentActive, setCurrentActive] = useState<string>(
    activeItem === "" ? "" : (activeItem || menuItems[0]?.id || "")
  );

  useEffect(() => {
    setCurrentActive(activeItem === "" ? "" : (activeItem || menuItems[0]?.id || ""));
  }, [activeItem, menuItems]);

  const redirect = useRedirect();

  const handleItemClick = (item: string, route: string) => {
    setCurrentActive(item);
    redirect(route);
  };

  return (
    <nav className="flex md:flex-row md:space-x-3 flex-col space-y-2 md:space-y-0">
      {menuItems.map((item) => {
        // Only consider an item active if currentActive is not empty and matches the item id
        const isActive = currentActive !== "" && currentActive === item.id;

        return (
          <button
            key={item.id}
            onClick={() => handleItemClick(item.id, item.redirectPage)}
            className={`relative flex items-center space-x-2 px-3 md:h-[86px] h-[50px] transition-colors duration-200 ${
              isActive
                ? "text-primary font-bold"
                : "text-primary opacity-75 hover:opacity-100 font-bold"
            }`}
          >
            <img
              src={isActive ? item.activeIcon : item.icon}
              alt={`${item.label} icon`}
              className={`transition-all duration-200 ${item.id === "dashboard" ? "w-5 h-5" : "w-6 h-6"}`}
            />
            <span className="text-responsive-base">{item.label}</span>
            <div
              className={`md:absolute md:bottom-0 md:left-0 md:right-0 md:h-[6px] hidden md:block transition-all duration-200 ${
                isActive ? "bg-primary rounded-t-sm" : "bg-transparent"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}
