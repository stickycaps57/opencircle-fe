import { Navbar } from "@src/shared/components/NavbarComponent";
import ScrollToTop from "@src/shared/components/ScrollToTop";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "@src/shared/store";
import { useEffect, useState } from "react";
import { useLogout } from "@src/features/auth/model/auth.mutations";
import { RoleId } from "@src/features/auth/schema/auth.types";
import type { MenuItem } from "@src/shared/components/NavMenuComponent";
import { useConfirmationModal } from "@src/shared/hooks";
import { ConfirmationModal } from "@src/shared/components/modals";
import whiteHomeIcon from "@src/assets/navbar/home_white.svg";
import whiteProfileIcon from "@src/assets/navbar/profile_white.svg";
import whiteOrgIcon from "@src/assets/navbar/org_white.svg";
import activeHomeIcon from "@src/assets/navbar/active_home.svg";
import activeProfileIcon from "@src/assets/navbar/active_profile.svg";
import activeMemberIcon from "@src/assets/navbar/active_org.svg";

export default function LandingLayout() {
  const redirect = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const logoutMutation = useLogout();
  const [isScrolled, setIsScrolled] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const {
    isConfirmModalOpen,
    modalConfig,
    openConfirmationModal,
    closeConfirmationModal,
  } = useConfirmationModal();

  // Handle scroll event to change navbar background
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Handle login/logout button click
  const handleButtonClick = () => {
    if (isAuthenticated) {
      openConfirmationModal({
        title: "Ready to Log Out",
        message: "You are about to be logged out of your account. Proceed?",
        confirmButtonText: "Logout",
        confirmButtonVariant: "primary",
        onConfirm: async () => {
          try {
            // Trigger server-side and client-side logout
            await logoutMutation.mutateAsync();
            redirect("/");
          } catch (error) {
            console.error("Logout failed:", error);
            // Still redirect to landing page even if logout fails
            redirect("/");
          }
        },
      });
    } else {
      redirect("/login");
    }
  };

  // Define menu items for authenticated users based on role
  const { user } = useAuthStore();
  const userRole = user?.role_id === RoleId.Member ? "member" : "organization";

  // Define menu items for authenticated users based on role
  const organizationMenuItems: MenuItem[] = [
    {
      id: "home",
      label: "Home",
      icon: whiteHomeIcon,
      activeIcon: activeHomeIcon,
      redirectPage: "/home",
    },
    {
      id: "profile",
      label: "Profile",
      icon: whiteProfileIcon,
      activeIcon: activeProfileIcon,
      redirectPage: "/organization-profile",
    },
    {
      id: "member",
      label: "Member",
      icon: whiteOrgIcon,
      activeIcon: activeMemberIcon,
      redirectPage: "/organization-member",
    },
  ];

  const memberMenuItems: MenuItem[] = [
    {
      id: "home",
      label: "Home",
      icon: whiteHomeIcon,
      activeIcon: activeHomeIcon,
      redirectPage: "/home",
    },
    {
      id: "profile",
      label: "Profile",
      icon: whiteProfileIcon,
      activeIcon: activeProfileIcon,
      redirectPage: "/member-profile",
    },
    {
      id: "organization",
      label: "Organization",
      icon: whiteOrgIcon,
      activeIcon: activeMemberIcon,
      redirectPage: "/member-organization",
    },
  ];

  // Select menu items based on user role
  const menuItems =
    userRole === "member" ? memberMenuItems : organizationMenuItems;

  // Only create navMenu if user is authenticated
  const navMenu = isAuthenticated ? (
    <nav className="flex md:flex-row md:space-x-3 flex-col space-y-2 md:space-y-0">
      {menuItems.map((item) => {
        return (
          <button
            key={item.id}
            onClick={() => redirect(item.redirectPage)}
            className={`relative flex items-center space-x-2 px-3 md:h-[86px] h-[50px] transition-colors duration-200 font-bold ${
              isScrolled || windowWidth < 768
                ? "text-primary opacity-75 hover:opacity-100"
                : "text-white opacity-75 hover:opacity-100"
            }`}
          >
            <img
              src={
                isScrolled || windowWidth < 768 ? item.activeIcon : item.icon
              }
              alt={`${item.label} icon`}
              className={`${
                item.id === "home" && !isScrolled && windowWidth >= 768
                  ? "w-5 h-5"
                  : "w-6 h-6"
              } transition-all duration-200`}
            />
            <span className="text-responsive-base">{item.label}</span>
            {/* No bottom border for LandingLayout navMenu */}
            <div className="md:absolute md:bottom-0 md:left-0 md:right-0 md:h-[6px] hidden md:block transition-all duration-200 bg-transparent" />
          </button>
        );
      })}
    </nav>
  ) : null;

  return (
    <div className="w-full min-h-screen bg-herobg overflow-x-hidden flex flex-col">
      <Navbar
        brandName="OpenCircle"
        transparent={!isScrolled}
        onButtonClick={handleButtonClick}
        isAuthenticated={isAuthenticated}
        buttonLabel={isAuthenticated ? "Log out" : "Log in"}
        navMenu={navMenu}
      />
      {/* Brand logo click handler is now implemented in NavbarComponent */}
      {/* Add shadow overlay when scrolled */}
      {isScrolled && (
        <div className="fixed top-[86px] left-0 w-full h-4 bg-gradient-to-b from-black/10 to-transparent z-40"></div>
      )}
      <main className="flex-1">
        <ScrollToTop />
        <Outlet />
      </main>

      {/* Confirmation Modal */}
      {modalConfig && (
        <ConfirmationModal
          isOpen={isConfirmModalOpen}
          onClose={closeConfirmationModal}
          onConfirm={modalConfig.onConfirm}
          title={modalConfig.title}
          message={modalConfig.message}
          confirmButtonText={modalConfig.confirmButtonText}
          confirmButtonVariant={modalConfig.confirmButtonVariant}
        />
      )}
      {/* <Footer /> */}
    </div>
  );
}
