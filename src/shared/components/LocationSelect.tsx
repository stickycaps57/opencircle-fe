import { useEffect, useMemo } from "react";
import { CustomSelectField } from "./CustomSelectField";
import { usePGSCLocation } from "../hooks/usePGSCLocation";

interface LocationSelectProps {
  // Selected values
  regionValue: string;
  provinceValue: string;
  cityValue?: string;
  barangayValue?: string;

  // Change handlers
  onRegionChange: (name: string, value: string, label: string) => void;
  onProvinceChange: (name: string, value: string, label: string) => void;
  onCityChange: (name: string, value: string, label: string) => void;
  onBarangayChange: (name: string, value: string, label: string) => void;

  // Optional class name for styling
  className?: string;
}

/**
 * A component that renders cascading select fields for Philippine locations
 * (Region, Province, City, Barangay) using the PSGC API
 */
export const LocationSelect = ({
  regionValue,
  provinceValue,
  cityValue,
  barangayValue,
  onRegionChange,
  onProvinceChange,
  onCityChange,
  onBarangayChange,
  className = "",
}: LocationSelectProps) => {
  const {
    // Options
    regionOptions,
    provinceOptions,
    cityOptions,
    barangayOptions,

    // Loading states
    loading,

    // Error states
    errors,

    // Fetch functions
    fetchRegions,
    fetchProvinces,
    fetchCities,
    fetchBarangays,

    // Change handlers from the hook
    handleProvinceChange: resetProvinceOptions,
    handleCityChange: resetCityOptions,
    handleBarangayChange: resetBarangayOptions,
    
    // Helper functions
    isNCR,
  } = usePGSCLocation();

  // Fetch regions on initial load
  useEffect(() => {
    fetchRegions();
  }, [fetchRegions]);
  
  // Determine if the selected region is NCR
  const selectedRegionIsNCR = useMemo(() => {
    const selectedRegion = regionOptions.find(
      (option) => option.label === regionValue
    );
    return selectedRegion ? isNCR(selectedRegion.value) : false;
  }, [regionValue, regionOptions, isNCR]);

  // Fetch provinces when region changes (only if a region is selected)
  useEffect(() => {
    // Find the selected region option to get its code
    const selectedRegion = regionOptions.find(
      (option) => option.label === regionValue
    );
    if (selectedRegion && selectedRegion.value) {
      fetchProvinces(selectedRegion.value);
    } else {
      // Reset province options when no region is selected
      resetProvinceOptions(null);
    }
    // Always reset city and barangay options when region changes
    resetCityOptions(null);
    resetBarangayOptions(null);
  }, [
    regionValue,
    regionOptions,
    fetchProvinces,
    resetProvinceOptions,
    resetCityOptions,
    resetBarangayOptions,
  ]);

  // Fetch cities when province changes (only if a province is selected)
  useEffect(() => {
    // Find the selected province option to get its code
    const selectedProvince = provinceOptions.find(
      (option) => option.label === provinceValue
    );
    if (selectedProvince && selectedProvince.value) {
      fetchCities(selectedProvince.value);
    } else {
      // Reset city options when no province is selected
      resetCityOptions(null);
    }
    // Always reset barangay options when province changes
    resetBarangayOptions(null);
  }, [
    provinceValue,
    provinceOptions,
    fetchCities,
    resetCityOptions,
    resetBarangayOptions,
  ]);

  // Fetch barangays when city changes (only if a city is selected)
  useEffect(() => {
    // Find the selected city option to get its code
    const selectedCity = cityOptions.find(
      (option) => option.label === cityValue
    );
    if (selectedCity && selectedCity.value) {
      fetchBarangays(selectedCity.value);
    } else {
      // Reset barangay options when no city is selected
      resetBarangayOptions(null);
    }
  }, [cityValue, cityOptions, fetchBarangays, resetBarangayOptions]);

  // Handle region change
  const handleRegionChange = (name: string, value: string, label: string) => {
    // In CreateEventModal, the region field is named 'country'
    const regionName = name === "region" ? "country" : name;
    onRegionChange(regionName, value, label);
    // Clear lower-level selections
    onProvinceChange("province", "", "");
    onCityChange("city", "", "");
    onBarangayChange("barangay", "", "");

    // Always reset city and barangay options when region changes
    resetCityOptions(null);
    resetBarangayOptions(null);
  };

  // Handle province change
  const handleProvinceChange = (name: string, value: string, label: string) => {
    onProvinceChange(name, value, label);
    // Clear lower-level selections
    onCityChange("city", "", "");
    onBarangayChange("barangay", "", "");

    // Always reset city and barangay options when province changes
    resetCityOptions(null);
    resetBarangayOptions(null);

  };

  // Handle city change
  const handleCityChange = (name: string, value: string, label: string) => {
    onCityChange(name, value, label);
    // Clear barangay selection
    onBarangayChange("barangay", "", "");
    resetBarangayOptions(null);

  };

  // We'll use the original options arrays and let the CustomSelectField handle empty states

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Grid layout for select fields - 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Region Select */}
        <div>
          <CustomSelectField
            name="region"
            value={regionValue}
            onChange={handleRegionChange}
            options={regionOptions}
            placeholder="Region"
            className={loading.regions ? "opacity-70" : ""}
          />
          {errors.regions && (
            <p className="text-primary-75 text-xs mt-1">{errors.regions}</p>
          )}
          {loading.regions && (
            <p className="text-primary-75 text-xs mt-1">Loading regions...</p>
          )}
        </div>

        {/* Province Select */}
        <div>
          <CustomSelectField
            name="province"
            value={provinceValue}
            onChange={handleProvinceChange}
            options={provinceOptions}
            placeholder={selectedRegionIsNCR ? "District" : "Province"}
            className={loading.provinces ? "opacity-70" : ""}
          />
          {errors.provinces && (
            <p className="text-red-500 text-xs mt-1">{errors.provinces}</p>
          )}
          {loading.provinces && (
            <p className="text-primary-75 text-xs mt-1">
              {selectedRegionIsNCR ? "Loading districts..." : "Loading provinces..."}
            </p>
          )}
        </div>

        {/* City Select */}
        <div>
          <CustomSelectField
            name="city"
            value={cityValue || ""}
            onChange={handleCityChange}
            options={cityOptions}
            placeholder="City/Municipality"
            className={loading.cities ? "opacity-70" : ""}
          />
          {errors.cities && (
            <p className="text-red-500 text-xs mt-1">{errors.cities}</p>
          )}
          {loading.cities && (
            <p className="text-primary-75 text-xs mt-1">Loading cities...</p>
          )}
        </div>

        {/* Barangay Select */}
        <div>
          <CustomSelectField
            name="barangay"
            value={barangayValue || ""}
            onChange={onBarangayChange}
            options={barangayOptions}
            placeholder="Barangay"
            className={loading.barangays ? "opacity-70" : ""}
          />
          {errors.barangays && (
            <p className="text-red-500 text-xs mt-1">{errors.barangays}</p>
          )}
          {loading.barangays && (
            <p className="text-primary-75 text-xs mt-1">Loading barangays...</p>
          )}
        </div>
      </div>
    </div>
  );
};
