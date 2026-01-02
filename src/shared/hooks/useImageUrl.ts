import type { ProfilePicture } from "@src/features/auth/schema/auth.types";
import avatarImage from "@src/assets/shared/avatar.png";


/**
 * Hook for generating image URLs by combining API URL with directory and filename
 *
 * @returns A function that generates image URLs
 */
export function useImageUrl() {
  // const API_URL = import.meta.env.VITE_API_URL;
  // const API_URL_UPLOAD = import.meta.env.VITE_API_URL_UPLOAD || API_URL;

  /**
   * Generates a complete image URL by combining API URL with directory and filename
   *
   * @param fallbackUrl - Optional fallback URL to use if directory or filename is missing. Defaults to avatarImage.
   * @returns The complete image URL
   */
  const getImageUrl = (
    imageObject?: ProfilePicture | null,
    fallbackUrl: string = avatarImage
  ): string => {
    const { directory, filename, image } = imageObject || {};

    // Return image if it's a base64 string
    if (image?.startsWith("data:")) {
      // Return fallback URL if directory or filename is missing
      return image;
    }

    if (directory && filename) {
      return "https://placehold.co/600x400"
        // return `${API_URL_UPLOAD}/${directory}/${filename}`;
      }

    return fallbackUrl || "";
  };

  return {
    getImageUrl,
  };
}
