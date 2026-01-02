import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import addImageIcon from "@src/assets/shared/add_image_icon.svg";
import { Modal } from "../Modal";
import { LocationSelect } from "../LocationSelect";
import { CustomInputField } from "../CustomInputField";
import { CustomDateField } from "../CustomDateField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createEventSchema,
  editEventSchema,
  type CreateEventFormData,
  type EditEventFormData,
  type EventFormMode,
} from "@src/features/main/organization/profile/schema/event.schema";
import {
  useCreateEvent,
  useUpdateEvent,
} from "@src/features/main/organization/profile/model/event.mutation";
import { useGetEvent } from "@src/features/main/organization/profile/model/event.query";
import { useImageUrl } from "@src/shared/hooks";
import {
  usePGSCLocation,
  type LocationOption,
} from "@src/shared/hooks/usePGSCLocation";

interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: EventFormMode;
  eventId?: number;
}

export const EventFormModal = ({
  isOpen,
  onClose,
  mode,
  eventId,
}: EventFormModalProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const createEventMutation = useCreateEvent();
  const updateEventMutation = useUpdateEvent();
  const { getImageUrl } = useImageUrl();
  const locationInitialized = useRef(false);

  const [prevMode, setPrevMode] = useState<EventFormMode>(mode);

  const {
    fetchRegions,
    fetchProvinces,
    fetchCities,
    fetchBarangays,
    regionOptions,
    provinceOptions,
    cityOptions,
    barangayOptions,
    handleRegionChange,
    handleProvinceChange,
    handleCityChange,
    handleBarangayChange,
  } = usePGSCLocation();

  const memoizedEventId = useMemo(() => eventId || 0, [eventId]);
  const memoizedEnabled = useMemo(
    () => mode === "edit" && !!eventId,
    [mode, eventId]
  );

  const { data: eventData, isLoading: isEventLoading } = useGetEvent(
    memoizedEventId,
    memoizedEnabled
  );

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateEventFormData | EditEventFormData>({
    resolver: zodResolver(
      mode === "create" ? createEventSchema : editEventSchema
    ),
    defaultValues: {
      title: "",
      country: "",
      province: "",
      city: "",
      barangay: "",
      house_building_number: "",
      event_date: "",
      description: "",
      // Initialize code fields with empty strings
      country_code: "",
      province_code: "",
      city_code: "",
      barangay_code: "",
    },
  });

  const countryValue = watch("country");
  const provinceValue = watch("province");
  const cityValue = watch("city");
  const barangayValue = watch("barangay");

  const resetForm = useCallback(() => {

    reset({
      title: "",
      country: "",
      province: "",
      city: "",
      barangay: "",
      house_building_number: "",
      event_date: "",
      description: "",
      // Initialize code fields with empty strings
      country_code: "",
      province_code: "",
      city_code: "",
      barangay_code: "",
      image: undefined,
    });

    setImagePreview(null);

    setError("");
  }, [reset]);

  useEffect(() => {
    fetchRegions();
  }, [fetchRegions]);

  // Reset form when modal closes or when switching between create/edit modes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
      return;
    }

    // If mode changed from edit to create, reset the form
    if (prevMode === "edit" && mode === "create") {
      resetForm();
      locationInitialized.current = false;
    }

    // Update previous mode
    setPrevMode(mode);
  }, [isOpen, mode, prevMode, resetForm]);

  // Populate form with event data when in edit mode
  useEffect(() => {
    if (mode === "edit" && eventData && !isEventLoading) {
      // Set basic form fields
      setValue("title", eventData.title);
      setValue("event_date", eventData.event_date);
      setValue("description", eventData.description);

      // Check if address exists before accessing its properties
      if (eventData.address) {
        setValue(
          "house_building_number",
          eventData.address.house_building_number
        );

        // Set code fields (these will be used by the location selectors)
        setValue("country_code", eventData.address.country_code);
        setValue("province_code", eventData.address.province_code);
        setValue("city_code", eventData.address.city_code || "");
        setValue("barangay_code", eventData.address.barangay_code || "");

        // Set location display fields
        setValue("country", eventData.address.country);
        setValue("province", eventData.address.province);
        setValue("city", eventData.address.city || "");
        setValue("barangay", eventData.address.barangay || "");
      } else {
        console.error("Event address is undefined:", eventData);
      }

      // Set image preview if available
      if (eventData.image) {
        const imageUrl = getImageUrl(
          eventData.image,
          ""
        );
        setImagePreview(imageUrl);
      }

      // Mark that we need to initialize location selectors
      locationInitialized.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventData, isEventLoading]);

  // Memoize location codes to prevent unnecessary re-renders
  const locationCodes = useMemo(() => {
    if (!eventData?.address) return null;
    return {
      regionCode: eventData.address.country_code,
      provinceCode: eventData.address.province_code,
      cityCode: eventData.address.city_code || "",
      barangayCode: eventData.address.barangay_code || "",
    };
  }, [eventData]);

  // Initialize location selectors with event data in edit mode
  useEffect(() => {
    // Only run this effect when in edit mode with event data and not already initialized
    if (
      mode === "edit" &&
      eventData &&
      eventData.address && // Check if address exists
      !isEventLoading &&
      !locationInitialized.current &&
      locationCodes
    ) {
      // Use memoized location codes instead of watch function
      const { regionCode, provinceCode, cityCode, barangayCode } =
        locationCodes;

      // Define a function to handle the sequential location selection
      const initializeLocationSelectors = async () => {
        try {
          // Step 1: Select Region
          if (regionCode) {
            // Wait for region options to be available
            if (regionOptions.length === 0) {
              await new Promise<void>((resolve) => setTimeout(resolve, 200));
            }

            // Find the region option that matches the code
            const regionOption = regionOptions.find(
              (option: LocationOption) => option.code === regionCode
            );

            if (regionOption) {
              // Set the region and fetch provinces
              handleRegionChange(regionOption);
              fetchProvinces(regionCode);

              // Step 2: Select Province
              if (provinceCode) {
                // Wait for province options to be available
                await new Promise<void>((resolve) => setTimeout(resolve, 250));

                // Find the province option that matches the code
                const provinceOption = provinceOptions.find(
                  (option: LocationOption) => option.code === provinceCode
                );

                if (provinceOption) {
                  // Set the province and fetch cities
                  handleProvinceChange(provinceOption);
                  fetchCities(provinceCode);

                  // Step 3: Select City
                  if (cityCode) {
                    // Wait for city options to be available
                    await new Promise<void>((resolve) =>
                      setTimeout(resolve, 250)
                    );

                    // Find the city option that matches the code
                    const cityOption = cityOptions.find(
                      (option: LocationOption) => option.code === cityCode
                    );

                    if (cityOption) {
                      // Set the city and fetch barangays
                      handleCityChange(cityOption);
                      fetchBarangays(cityCode);

                      // Step 4: Select Barangay
                      if (barangayCode) {
                        // Wait for barangay options to be available
                        await new Promise<void>((resolve) =>
                          setTimeout(resolve, 250)
                        );

                        // Find the barangay option that matches the code
                        const barangayOption = barangayOptions.find(
                          (option: LocationOption) =>
                            option.code === barangayCode
                        );

                        if (barangayOption) {
                          // Set the barangay
                          handleBarangayChange(barangayOption);
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error("Error initializing location selectors:", error);
        }
      };

      // Execute the initialization function
      initializeLocationSelectors();

      // Mark as initialized to prevent re-running
      locationInitialized.current = true;
    }
  }, [
    mode,
    eventData,
    isEventLoading,
    locationInitialized,
    locationCodes,
    regionOptions,
    provinceOptions,
    cityOptions,
    barangayOptions,
    handleRegionChange,
    handleProvinceChange,
    handleCityChange,
    handleBarangayChange,
    fetchProvinces,
    fetchCities,
    fetchBarangays,
  ]);

  // Memoize the handleSelectChange function to prevent unnecessary re-renders
  const handleSelectChange = useCallback(
    (name: string, value: string, label: string) => {
      const fieldName = name as keyof (CreateEventFormData | EditEventFormData);

      setValue(fieldName, label, { shouldValidate: false });

      if (name === "country") {
        setValue("country_code", value, { shouldValidate: false });

        const regionOption = regionOptions.find(
          (option: LocationOption) => option.code === value
        );
        if (regionOption) {
          handleRegionChange(regionOption);
        }
      } else if (name === "province") {
        setValue("province_code", value, { shouldValidate: false });

        const provinceOption = provinceOptions.find(
          (option: LocationOption) => option.code === value
        );
        if (provinceOption) {
          handleProvinceChange(provinceOption);
        }
      } else if (name === "city") {
        setValue("city_code", value, { shouldValidate: false });

        const cityOption = cityOptions.find(
          (option: LocationOption) => option.code === value
        );
        if (cityOption) {
          handleCityChange(cityOption);
        }
      } else if (name === "barangay") {
        setValue("barangay_code", value, { shouldValidate: false });

        const barangayOption = barangayOptions.find(
          (option: LocationOption) => option.code === value
        );
        if (barangayOption) {
          handleBarangayChange(barangayOption);
        }
      }
    },
    [
      setValue,
      regionOptions,
      provinceOptions,
      cityOptions,
      barangayOptions,
      handleRegionChange,
      handleProvinceChange,
      handleCityChange,
      handleBarangayChange,
    ]
  );

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setValue("image", file, { shouldValidate: false });

        // Create image preview
        const reader = new FileReader();
        reader.onload = (event) => {
          setImagePreview(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [setValue]
  );

  /**
   * Create a wrapped onClose handler that resets the form
   */
  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  /**
   * Handle form submission with validated data
   */
  const onSubmit = handleSubmit(async (data) => {
    // Clear any previous error messages
    setError("");

    try {
      if (mode === "create") {
        // Create new event
        await createEventMutation.mutateAsync(data as CreateEventFormData);
      } else if (mode === "edit" && eventId) {
        // For edit mode, only include the image if a new one was selected
        // This prevents the backend from removing the existing image when only other fields are changed
        const eventDataToUpdate = { ...data };

        // If no new image was selected, remove the image field completely
        // to prevent the backend from clearing the existing image
        if (data.image === undefined) {
          delete eventDataToUpdate.image;
        }

        // Update existing event
        await updateEventMutation.mutateAsync({
          eventId,
          eventData: eventDataToUpdate,
        });
      }

      // Reset form after successful operation
      resetForm();

      // Close modal
      onClose();
    } catch (error: unknown) {
      // Handle event creation/update errors
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(String(error));
      }
    }
  });

  // Determine if the form is submitting
  const isSubmitting =
    mode === "create"
      ? createEventMutation.isPending
      : updateEventMutation.isPending;

  // Determine modal title and button text based on mode
  const modalTitle = mode === "create" ? "Create Event" : "Edit Event";
  const submitButtonText = mode === "create" ? "Post" : "Update";

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="2xl">
      {/* Header */}
      <div className="relative p-6 border-b border-gray-100">
        <h2 className="text-responsive-base font-bold text-primary text-center">
          {modalTitle}
        </h2>
        <button
          onClick={handleClose}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 text-placeholderbg hover:text-primary transition-colors text-responsive-xs"
        >
          Close
        </button>
      </div>

      {/* Loading state */}
      {mode === "edit" && isEventLoading && (
        <div className="p-6 text-center">
          <p className="text-primary">Loading event details...</p>
        </div>
      )}

      {/* Form */}
      {(!isEventLoading || mode === "create") && (
        <form onSubmit={onSubmit} className="p-6 space-y-6">
          {/* Event Title */}
          <div>
            <label className="block text-primary font-bold mb-2 text-responsive-sm">
              Event Title
            </label>
            <input
              type="text"
              {...register("title")}
              className={`w-full px-4 py-3 border ${
                errors.title ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-responsive-sm`}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Location Section */}
          <div>
            <div className="flex items-center mb-4">
              <svg
                className="w-5 h-5 text-primary mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-primary font-bold text-responsive-sm">
                Location
              </span>
            </div>

            {/* Location Fields */}
            <div className="mb-4">
              <LocationSelect
                regionValue={countryValue}
                provinceValue={provinceValue}
                cityValue={cityValue}
                barangayValue={barangayValue}
                onRegionChange={handleSelectChange}
                onProvinceChange={handleSelectChange}
                onCityChange={handleSelectChange}
                onBarangayChange={handleSelectChange}
              />
              {(errors.country ||
                errors.province ||
                errors.city ||
                errors.barangay) && (
                <p className="text-red-500 text-xs mt-1">
                  Please select all location fields
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <CustomInputField
                name="house_building_number"
                value={watch("house_building_number")}
                onChange={(e) =>
                  setValue("house_building_number", e.target.value, {
                    shouldValidate: true,
                  })
                }
                placeholder="House/ Building Number"
                className={errors.house_building_number ? "border-red-500" : ""}
              />
              {errors.house_building_number && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.house_building_number.message}
                </p>
              )}
            </div>
          </div>

          {/* Schedule */}
          <div>
            <div className="flex items-center mb-2">
              <svg
                className="w-5 h-5 text-primary mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-primary font-bold text-responsive-sm">
                Schedule
              </span>
            </div>
            <CustomDateField
              name="event_date"
              value={watch("event_date")}
              onChange={(e) =>
                setValue("event_date", e.target.value, { shouldValidate: true })
              }
              className={errors.event_date ? "border-red-500" : ""}
            />
            {errors.event_date && (
              <p className="text-red-500 text-xs mt-1">
                {errors.event_date.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-primary font-bold mb-2 text-responsive-sm">
              Description
            </label>
            <textarea
              {...register("description")}
              placeholder="Please type your event description"
              rows={4}
              className={`w-full px-4 py-3 border ${
                errors.description ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-responsive-sm`}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Add Image */}
          <div className="text-center">
            <label className="inline-flex items-center cursor-pointer text-primary hover:text-opacity-80 transition-colors">
              <img
                src={addImageIcon}
                alt="Add Image"
                className="w-5 h-5 mr-1"
              />
              <span className="font-bold text-responsive-sm">
                {mode === "create" ? "Add Image" : "Change Image"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Image Preview"
                  className="h-64 w-full mx-auto rounded-lg object-cover border border-gray-200"
                />
              </div>
            )}
          </div>

          {/* Divider */}
          <hr className="border-gray-200" />

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-center text-sm">{error}</div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-white py-4 rounded-full font-medium hover:bg-opacity-90 transition-colors text-responsive-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? `${mode === "create" ? "Creating" : "Updating"} Event...`
              : submitButtonText}
          </button>
        </form>
      )}
    </Modal>
  );
};
