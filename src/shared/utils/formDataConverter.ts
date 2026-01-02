/**
 * Converts a plain object into FormData
 * Handles nested objects, arrays, and File instances
 */
export const objectToFormData = (
  obj: Record<string, unknown>,
  fileFields: string[] = [
    "logo",
    "image",
    "file",
    "avatar",
    "photo",
    "profile_picture",
    "images",
  ]
): FormData => {
  const formData = new FormData();

  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (Array.isArray(value)) {
        const allFiles = value.every((item) => item instanceof File);
        if (allFiles) {
          (value as File[]).forEach((file) => {
            formData.append(key, file);
          });
        }
      } else if (typeof value === "object") {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    } else {
      // For undefined/null values, avoid appending empty blobs for file fields
      // This prevents unintended clearing of existing files during updates
      if (!fileFields.includes(key)) {
        formData.append(key, "");
      }
    }
  });

  return formData;
};
