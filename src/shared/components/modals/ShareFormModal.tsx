import { useState, useCallback } from "react";
import { Modal } from "../Modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sharePostSchema, type SharePostFormData } from "@src/features/share/schema/share.schema";
import { useShareContent } from "@src/features/share/model/share.mutation";

interface ShareFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShare?: (data: { description: string; contentId: number; contentType?: "post" | "event" }) => void;
  title?: string;
  initialDescription?: string;
  contentId: number;
  contentType?: "post" | "event";
}


export const ShareFormModal = ({
  isOpen,
  onClose,
  title = "Share",
  initialDescription = "",
  contentId,
  contentType,
}: ShareFormModalProps) => {
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SharePostFormData>({
    resolver: zodResolver(sharePostSchema),
    defaultValues: {
      content_id: contentId,
      comment: initialDescription,
      content_type: contentType === "post" ? 1 : 2,
    },
    mode: "onChange",
  });

  const shareMutation = useShareContent();

  const resetForm = useCallback(() => {
    reset({
      content_id: contentId,
      comment: "",
      content_type: contentType === "post" ? 1 : 2,
    });
    setError("");
  }, [reset, contentId, contentType]);

  const onSubmit = handleSubmit(async (data) => {
    setError("");
    try {
      const formData: SharePostFormData = {
        ...data,
        content_type: contentType === "post" ? 1 : 2,
      };
      await shareMutation.mutateAsync(formData);
      resetForm();
      onClose();
    } catch (e: unknown) {
      setError(String(e));
    }
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      {/* Header */}
      <div className="relative p-6 border-b border-gray-100">
        <h2 className="text-responsive-base font-bold text-primary text-center">{title}</h2>
        <button
          onClick={onClose}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 text-placeholderbg hover:text-primary transition-colors text-responsive-xs"
        >
          Close
        </button>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="p-6 space-y-6">
        {/* Description */}
        <div>
          <label className="block text-primary font-bold mb-2 text-responsive-xs">Description</label>
          <textarea
            {...register("comment")}
            placeholder="Add a message"
            rows={4}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-responsive-xs"
          />
          {errors.comment && (
            <p className="mt-1 text-responsive-xxs text-red-600">{errors.comment.message}</p>
          )}
        </div>

        {/* Divider */}
        <hr className="border-gray-200" />

        {/* API/Error Message */}
        {error && <p className="text-red-500 text-responsive-xxs mb-4">{error}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-primary text-white py-3 sm:py-4 rounded-full font-medium hover:bg-opacity-90 transition-colors text-responsive-xs"
          disabled={shareMutation.isPending}
        >
          Share
        </button>
      </form>
    </Modal>
  );
};
