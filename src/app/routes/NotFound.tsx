import { useNavigate } from "react-router-dom";
import brandlogo from "@src/assets/brand-dark.png";
import { PrimaryButton } from "@src/shared/components/PrimaryButton";

/**
 * NotFound component displays a 404 error page when users navigate to non-existent routes
 * Features a responsive design for mobile, tablet, and large screens
 */
const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/home");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="mx-auto w-24 h-24 lg:w-48 lg:h-48 flex items-center justify-center">
          <img
            src={brandlogo}
            alt="Brand Logo"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Text */}
        <h1 className="text-responsive-2xl font-bold text-gray-600 mb-2">
          404 Not Found
        </h1>
        <p className="text-responsive-xs text-gray-500 mb-8">
          The resource requested could not be found on this server!
        </p>

        {/* Button */}
        <PrimaryButton
          label="Go Home"
          variant="button1"
          onClick={handleGoHome}
        />
      </div>
    </div>
  );
};

export default NotFound;
