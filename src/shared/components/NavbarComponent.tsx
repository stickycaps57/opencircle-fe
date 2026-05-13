import { PrimaryButton } from "./PrimaryButton";
import brandlogo from "@src/assets/navbar/brand.png";
import brandLogoDark from "@src/assets/brand-dark.png";
import { useState, useRef, useEffect } from "react";
import notificationIcon from "@src/assets/shared/notification_icon.png";
import { NotificationDropdown } from "@src/features/notification/ui/NotificationDropdown";
import { useUnreadNotificationsCount } from "@src/features/notification/model/notification.query";
import settingsIcon from "@src/assets/shared/settings_icon.png";
import { SettingsDropdown } from "@src/shared/components/SettingsDropdown";
import { NotificationModal, SettingsModal } from "@src/shared/components/modals";
interface NavbarProps {
  brandName: string;
  transparent?: boolean;
  onButtonClick?: () => void;
  buttonLabel?: string;
  isAuthenticated?: boolean;
  navMenu?: React.ReactNode;
}

export function Navbar({
  brandName,
  transparent = false,
  onButtonClick,
  navMenu,
  buttonLabel,
  isAuthenticated = false,
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileNotifOpen, setIsMobileNotifOpen] = useState(false);
  const [isMobileSettingsOpen, setIsMobileSettingsOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const shouldBeTransparent = transparent;
  const { data: unreadCountData } = useUnreadNotificationsCount(isAuthenticated);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (notifRef.current && !notifRef.current.contains(target)) {
        setIsNotifOpen(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(target)) {
        setIsSettingsOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(target) && !isMobileSettingsOpen && !isMobileNotifOpen) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileSettingsOpen, isMobileNotifOpen]);

  return (
    <nav
      className={`w-full fixed top-0 left-0 z-50 shadow-lg transition-all duration-300 ${
        shouldBeTransparent ? "md:bg-transparent bg-white" : "bg-white"
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-30 flex flex-col justify-center h-[86px]">
        <div className="flex justify-between items-center">
          {/* Brand */}
          <div className="flex flex-row items-center">
            <div
              className="flex flex-row space-x-1 items-center h-[86px] cursor-pointer"
              onClick={() => (window.location.href = "/")}
            >
              <img
                src={shouldBeTransparent && window.innerWidth >= 768 ? brandlogo : brandLogoDark}
                className="h-full max-h-full w-auto object-contain"
              />
              <div
                className={`hidden sm:block text-responsive-lg font-semibold transition-colors duration-300 ${
                  shouldBeTransparent && window.innerWidth >= 768 ? "text-white" : "text-primary"
                }`}
              >
                {brandName}
              </div>
            </div>

            {/* Desktop Nav Menu */}
            {navMenu && <div className="hidden md:block ml-8">{navMenu}</div>}
          </div>

          {/* Desktop Auth Controls */}
          <div className="hidden md:flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-8">
                <div className="relative" ref={notifRef}>
                  <PrimaryButton
                    label=""
                    variant="noStyle"
                    icon={notificationIcon}
                    iconClass="w-6 h-6"
                    onClick={() => {
                      setIsNotifOpen((prev) => !prev);
                      setIsSettingsOpen(false);
                    }}
                  />
                  {unreadCountData?.unread_count ? (
                    <span className="absolute -top-2 -right-4 min-w-[20px] h-5 px-1 rounded-full bg-primary text-white text-responsive-xxs flex items-center justify-center">
                      {unreadCountData.unread_count}
                    </span>
                  ) : null}
                  {isNotifOpen && (
                    <NotificationDropdown limit={3} unreadOnly={false} />
                  )}
                </div>
                <div className="relative" ref={settingsRef}>
                  <PrimaryButton
                    label=""
                    variant="noStyle"
                    icon={settingsIcon}
                    iconClass="w-6 h-6"
                    onClick={() => {
                      setIsSettingsOpen((prev) => !prev);
                      setIsNotifOpen(false);
                    }}
                  />
                  {isSettingsOpen && (
                    <SettingsDropdown onLogoutClick={onButtonClick} />
                  )}
                </div>
              </div>
            ) : (
              <PrimaryButton onClick={onButtonClick} label={buttonLabel || ""} />
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden flex items-center p-2 z-40"
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            onMouseDown={(e) => e.stopPropagation()}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 transition-colors duration-300 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div ref={mobileMenuRef} className="md:hidden bg-white shadow-lg absolute top-[86px] left-0 right-0 z-50 py-4 px-4 border-t">
            <div className="w-full text-primary">{navMenu}</div>
            <div className="mt-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    className="p-2 relative"
                    aria-label="Notifications"
                    onClick={() => setIsMobileNotifOpen(true)}
                  >
                    <img src={notificationIcon} alt="Notifications" className="w-6 h-6" />
                    {unreadCountData?.unread_count ? (
                      <span className="absolute top-0 right-0 min-w-[20px] h-5 px-1 rounded-full bg-primary text-white text-responsive-xxs flex items-center justify-center">
                        {unreadCountData.unread_count}
                      </span>
                    ) : null}
                  </button>
                  <button
                    type="button"
                    className="p-2"
                    aria-label="Settings"
                    onClick={() => setIsMobileSettingsOpen(true)}
                  >
                    <img src={settingsIcon} alt="Settings" className="w-6 h-6" />
                  </button>
                </div>
              ) : (
                <PrimaryButton onClick={onButtonClick} label={buttonLabel || ""} />
              )}
            </div>
          </div>
        )}

        {isMobileNotifOpen && <NotificationModal isOpen={isMobileNotifOpen} onClose={() => setIsMobileNotifOpen(false)} />}

        {isMobileSettingsOpen && (
          <SettingsModal
            isOpen={isMobileSettingsOpen}
            onClose={() => setIsMobileSettingsOpen(false)}
            onLogoutClick={() => {
              setIsMobileSettingsOpen(false);
              onButtonClick?.();
            }}
          />
        )}
      </div>
    </nav>
  );
}
