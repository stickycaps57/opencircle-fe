import { useEffect, useState } from "react";
import brandlogo from "@src/assets/brand-dark.png";

/**
 * Preloader component displays a loading animation with the brand logo
 * Used during suspense loading states throughout the application
 * Features a spinning circle animation with pulsing logo
 */
const Preloader = () => {
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);

  // Create a spinning effect for the circle
  useEffect(() => {
    const rotationInterval = setInterval(() => {
      setRotation((prev) => (prev + 2) % 360);
    }, 10);

    return () => clearInterval(rotationInterval);
  }, []);

  // Create a subtle pulsing effect for the logo
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setScale((prev) => (prev === 1 ? 1.1 : 1));
    }, 800);

    return () => clearInterval(pulseInterval);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-50 z-50">
      <div className="relative">
        {/* Outer spinning circle */}
        <div 
          className="w-20 h-20 rounded-full border-4 border-t-primary border-r-primary border-b-gray-200 border-l-gray-200"
          style={{ transform: `rotate(${rotation}deg)` }}
        />
        
        {/* Inner circle with subtle shadow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center">
            {/* Brand logo in center with pulse animation */}
            <img 
              src={brandlogo} 
              alt="Brand Logo" 
              className="w-10 h-10 object-contain transition-transform duration-300 ease-in-out" 
              style={{ transform: `scale(${scale})` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export { Preloader };
export default Preloader;