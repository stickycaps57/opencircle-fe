import { useState, useEffect, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import addImageIcon from "@src/assets/shared/add_image_icon.svg";
import { Modal } from "../Modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createPostSchema,
  editPostSchema,
  type PostFormData,
  type PostFormMode,
} from "@src/features/main/member/profile/schema/post.schema";
import type { PostImage } from "@src/features/main/member/profile/schema/post.types";
import {
  useCreatePost,
  useUpdatePost,
} from "@src/features/main/member/profile/model/post.mutation";
import { useImageUrl } from "@src/shared/hooks";
import { useGetPost } from "@src/features/main/member/profile/model/post.query";

interface PostFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: PostFormMode;
  postId?: number;
}

export const PostFormModal = ({
  isOpen,
  onClose,
  mode = "create",
  postId,
}: PostFormModalProps) => {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImagePreviews, setExistingImagePreviews] = useState<string[]>([]);
  const [existingImagesMeta, setExistingImagesMeta] = useState<PostImage[]>([]);
  const existingLoadedRef = useRef(false);
  const [imagesError, setImagesError] = useState<string>("");
  const [error, setError] = useState("");
  const createPostMutation = useCreatePost();
  const updatePostMutation = useUpdatePost();

  // Fetch post data if in edit mode
  const { data: postData, isLoading: isLoadingPost } = useGetPost(
    postId || 0,
    mode === "edit" && !!postId
  );
  // Track previous mode to detect changes
  const [prevMode, setPrevMode] = useState<PostFormMode>(mode);

  // Initialize React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(
      mode === "create" ? createPostSchema : editPostSchema
    ),
    defaultValues: {
      description: "",
      images: undefined,
    },
    mode: "onChange",
  });

  const { getImageUrl } = useImageUrl();

  /**
   * Custom reset function that clears form fields and image preview
   */
  const resetForm = useCallback(() => {
    // Reset React Hook Form fields
    reset({
      description: "",
      images: undefined,
    });

    // Clear image preview
    setImagePreviews((prev) => {
      prev.forEach((url) => URL.revokeObjectURL(url));
      return [];
    });
    setExistingImagePreviews([]);
    setExistingImagesMeta([]);

    // Clear any error messages
    setError("");
    setImagesError("");
    existingLoadedRef.current = false;
  }, [reset]);

  // Reset form when modal closes or when switching between create/edit modes
  useEffect(() => {
    // If modal is closed, reset the form
    if (!isOpen) {
      resetForm();
      return;
    }

    existingLoadedRef.current = false;

    // If mode changed from edit to create, reset the form
    if (prevMode === "edit" && mode === "create") {
      resetForm();
    }

    // Update previous mode
    setPrevMode(mode);
  }, [isOpen, mode, prevMode, reset, resetForm]);

  // Set form values when post data is loaded in edit mode
  useEffect(() => {
    if (mode === "edit" && postData && !existingLoadedRef.current) {
      setValue("description", postData.description);

      const existing = (postData.images || []).filter(
        (img) => !!img?.image || (!!img?.directory && !!img?.filename)
      );
      const urls = existing.map((img) =>
        getImageUrl(img)
      );
      setExistingImagesMeta(existing);
      setExistingImagePreviews(urls);
      existingLoadedRef.current = true;
    }
  }, [mode, postData, setValue, getImageUrl]);

  const {
    getInputProps,
    open,
  } = useDropzone({
    accept: { "image/*": [] },
    multiple: true,
    maxFiles: 10,
    noClick: true,
    onDrop: (files) => {
      const currentFiles = (watch("images") as File[] | undefined) || [];
      const totalCurrent = currentFiles.length + existingImagesMeta.length;
      const availableSlots = 10 - totalCurrent;
      const filesToAdd = files.slice(0, Math.max(0, availableSlots));

      if (files.length > availableSlots) {
        setImagesError("You can upload up to 10 images");
      } else {
        setImagesError("");
      }

      const newPreviews = filesToAdd.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);

      const updated = [...currentFiles, ...filesToAdd];
      setValue("images", updated as unknown as File[], { shouldValidate: true });
    },
    onDropRejected: (rejections) => {
      const tooMany = rejections.some((r) => r.errors.some((e) => e.code === "too-many-files"));
      if (tooMany) {
        setImagesError("You can upload up to 10 images only");
      }
    },
  });

  const removeImageAtIndex = (index: number) => {
    setImagePreviews((prev) => {
      const url = prev[index];
      if (url) URL.revokeObjectURL(url);
      const next = prev.filter((_, i) => i !== index);
      return next;
    });
    const current = (watch("images") as File[] | undefined) || [];
    const updated = current.filter((_, i) => i !== index);
    setValue("images", updated as unknown as File[], { shouldValidate: true });
    if (updated.length <= 10) {
      setImagesError("");
    }
  };

  const removeExistingImageAtIndex = (index: number) => {
    setExistingImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setExistingImagesMeta((prev) => prev.filter((_, i) => i !== index));
  };

  /**
   * Handle form submission with validated data
   */
  const onSubmit = handleSubmit(async (data) => {
    // Clear any previous error messages
    setError("");

    try {
      if (mode === "create") {
        // Wait for the post creation mutation to complete
        await createPostMutation.mutateAsync(data);
      } else if (mode === "edit" && postId) {
        const newFiles = ((data.images as unknown as File[]) || []) as File[];
        const combinedCount = newFiles.length + existingImagesMeta.length;
        if (combinedCount > 10) {
          setImagesError("You can upload up to 10 images");
          return;
        }

        if (existingImagesMeta.length === 0) {
          const postDataToUpdate = {
            ...data,
            images: (newFiles.length === 0 ? [] : (newFiles as unknown as File[])),
          };
          await updatePostMutation.mutateAsync({ postId, postData: postDataToUpdate });
        } else {
       const existingFiles = await Promise.all(
          existingImagesMeta.map(async (img) => {
            const url = getImageUrl(img);
            const res = await fetch(url);
            const blob = await res.blob();
            const name = img.filename || "image.jpg";
            const type = blob.type || "image/jpeg";

            return new File([blob], name, { type });
          })
        );

        const combined = [...existingFiles, ...newFiles];
        const postDataToUpdate = { ...data, images: combined as unknown as File[] };

        await updatePostMutation.mutateAsync({ postId, postData: postDataToUpdate });
        }
      }

      // Reset form after successful operation
      resetForm();

      // Close the modal
      onClose();
    } catch (error: unknown) {
      // Handle errors
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(String(error)); // fallback in case it's not an Error object
      }
    }
  });

  return (
    <Modal isOpen={isOpen} onClose={() => { resetForm(); onClose(); }} size="2xl">
      {/* Header */}
      <div className="relative p-6 border-b border-gray-100">
        <h2 className="text-responsive-base font-bold text-primary text-center">
          {mode === "create" ? "Create Post" : "Edit Post"}
        </h2>
        <button
          onClick={() => { resetForm(); onClose(); }}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 text-placeholderbg hover:text-primary transition-colors text-responsive-xs"
        >
          Close
        </button>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="p-6 space-y-6">
        {/* Description */}
        <div>
          <label className="block text-primary font-bold mb-2 text-responsive-xs">
            Description
          </label>
          <textarea
            {...register("description")}
            placeholder="Please type your event description"
            rows={4}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-responsive-xs"
          />
          {errors.description && (
            <p className="mt-1 text-responsive-xxs text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Add Image */}
        <div className="text-center">
          <input {...getInputProps()} className="hidden" />
          <label className="inline-flex items-center cursor-pointer text-primary hover:text-opacity-80 transition-colors" onClick={() => open()}>
            <img src={addImageIcon} alt="Add Image" className="w-5 h-5 mr-1" />
            <span className="font-bold text-responsive-xs">Add Image</span>
          </label>
          {(imagePreviews.length > 0 || existingImagePreviews.length > 0) && (
            <div className="mt-4 grid grid-cols-2 gap-2">
              {existingImagePreviews.map((src, idx) => (
                <div key={`existing-${idx}`} className="relative">
                  <img
                    src={src}
                    alt={`Existing Image ${idx + 1}`}
                    className="h-32 w-full mx-auto rounded-lg object-cover border border-gray-200"
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-white/80 text-red-600 rounded px-2 text-responsive-xxs cursor-pointer"
                    onClick={() => removeExistingImageAtIndex(idx)}
                  >
                    X
                  </button>
                </div>
              ))}
              {imagePreviews.map((src, idx) => (
                <div key={`new-${idx}`} className="relative">
                  <img
                    src={src}
                    alt={`Image Preview ${idx + 1}`}
                    className="h-32 w-full mx-auto rounded-lg object-cover border border-gray-200"
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-white/80 text-red-600 rounded px-2 text-responsive-xxs cursor-pointer" 
                    onClick={() => removeImageAtIndex(idx)}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}
          {errors.images && (
            <p className="mt-1 text-responsive-xxs text-red-600">{errors.images.message}</p>
          )}
          {imagesError && (
            <p className="mt-1 text-responsive-xxs text-red-600">{imagesError}</p>
          )}
        </div>

        {/* Divider */}
        <hr className="border-gray-200" />

        {/* API Error Message */}
        {error && <p className="text-red-500 text-responsive-xxs mb-4">{error}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-primary text-white py-3 sm:py-4 rounded-full font-medium hover:bg-opacity-90 transition-colors text-responsive-xs"
          disabled={
            createPostMutation.isPending ||
            updatePostMutation.isPending ||
            isLoadingPost
          }
        >
          {createPostMutation.isPending || updatePostMutation.isPending
            ? mode === "create"
              ? "Posting..."
              : "Updating..."
            : mode === "create"
            ? "Post"
            : "Update Post"}
        </button>
      </form>
    </Modal>
  );
};
