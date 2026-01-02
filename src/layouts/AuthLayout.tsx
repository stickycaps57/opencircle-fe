import ScrollToTop from "@src/shared/components/ScrollToTop";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@src/shared/store";
import { RoleId } from "@src/features/auth/schema/auth.types";

export default function AuthLayout() {
  const { isAuthenticated, user } = useAuthStore();

  // If user is authenticated, redirect to appropriate home page based on role
  if (isAuthenticated && user) {
    const redirectPath = user.role_id === RoleId.Member ? "/member-profile" : "/organization-profile";
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <div className="w-full min-h-screen bg-authlayoutbg overflow-x-hidden ">
      <main className="flex-1 ">
        <ScrollToTop />
        <Outlet />
      </main>
      {/* <Footer /> */}
    </div>
  );
}
