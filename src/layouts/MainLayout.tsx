import { Navbar } from "@src/shared/components/NavbarComponent";
import {
  NavMenuComponent,
  type MenuItem,
} from "@src/shared/components/NavMenuComponent";
import ScrollToTop from "@src/shared/components/ScrollToTop";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useConfirmationModal } from "@src/shared/hooks";
import { ConfirmationModal } from "@src/shared/components/modals";
import { useAuthStore } from "@src/shared/store";
import { RoleId } from "@src/features/auth/schema/auth.types";
import { useLogout } from "@src/features/auth/model/auth.mutations";

import homeNavLogo from "@src/assets/navbar/home.svg";
import profileNavLogo from "@src/assets/navbar/profile.svg";
import memberNavLogo from "@src/assets/navbar/members.svg";
import activeHomeIcon from "@src/assets/navbar/active_home.svg";
import activeProfileIcon from "@src/assets/navbar/active_profile.svg";
import activeMemberIcon from "@src/assets/navbar/active_org.svg";
import dashboardIcon from "@src/assets/shared/dashboard_icon.png";

export default function MainLayout() {
  const redirect = useNavigate();
  const location = useLocation();

  const {
    isConfirmModalOpen,
    modalConfig,
    openConfirmationModal,
    closeConfirmationModal,
  } = useConfirmationModal();

  const organizationMenuItems: MenuItem[] = [
    {
      id: "home",
      label: "Home",
      icon: homeNavLogo,
      activeIcon: activeHomeIcon,
      redirectPage: "/home",
    },
    {
      id: "dashboard",
      label: "Dashboard",
      icon: dashboardIcon,
      activeIcon: dashboardIcon,
      redirectPage: "/dashboard",
    },
    {
      id: "profile",
      label: "Profile",
      icon: profileNavLogo,
      activeIcon: activeProfileIcon,
      redirectPage: "/organization-profile",
    },
    {
      id: "member",
      label: "Member",
      icon: memberNavLogo,
      activeIcon: activeMemberIcon,
      redirectPage: "/organization-member",
    },
  ];

  const memberMenuItems: MenuItem[] = [
    {
      id: "home",
      label: "Home",
      icon: homeNavLogo,
      activeIcon: activeHomeIcon,
      redirectPage: "/home",
    },
    {
      id: "profile",
      label: "Profile",
      activeIcon: activeProfileIcon,
      icon: profileNavLogo,
      redirectPage: "/member-profile",
    },
    {
      id: "organization",
      label: "Organization",
      activeIcon: activeMemberIcon,
      icon: memberNavLogo,
      redirectPage: "/member-organization",
    },
  ];

  // Get user role from auth store
  const { user } = useAuthStore();
  const userRole = user?.role_id === RoleId.Member ? "member" : "organization";

  // Select menu items based on user role
  const menuItems =
    userRole === "member" ? memberMenuItems : organizationMenuItems;

  const getActiveMenuItem = (): string => {
    const currentPath = location.pathname;
    
    const shouldClearActive =
      /^\/organization\/[^/]+$/.test(currentPath) ||
      /^\/member\/[^/]+$/.test(currentPath);
    if (shouldClearActive) {
      return "";
    }

    // Find matching menu item based on redirectPage
    const activeItem = menuItems.find(
      (item) =>
        currentPath === item.redirectPage ||
        currentPath.startsWith(item.redirectPage + "/") // For nested routes
    );

    // Return the id of the matching item, fallback to appropriate home based on role
    return activeItem?.id || (userRole === "member" ? "home" : "home");
  };

  // Initialize logout mutation
  const logoutMutation = useLogout();

  const handleLogout = () => {
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
  };

  return (
    <div className="w-full min-h-screen bg-athens_gray overflow-x-hidden flex flex-col ">
      <Navbar
        brandName="OpenCircle"
        transparent={false}
        navMenu={
          <NavMenuComponent
            menuItems={menuItems}
            activeItem={getActiveMenuItem()}
          />
        }
        isAuthenticated={true}
        onButtonClick={() => handleLogout()}
        buttonLabel="Log out"
      />
      {/* Brand logo click handler is now implemented in NavbarComponent */}
      <main className="flex-1 pt-[86px]">
        <ScrollToTop />
        <Outlet />

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


      </main>
      {/* <Footer /> */}
    </div>
  );
}
