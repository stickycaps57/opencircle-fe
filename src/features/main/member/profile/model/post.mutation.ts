import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createPost,
  updatePost,
  deletePost,
  type CreatePostResponse,
  type EditPostResponse,
} from "../lib/post.api";
import type { PostFormData } from "../schema/post.schema";
import { QUERY_KEYS } from "@src/shared/constants/queryKeys";
import { showSuccessToast, showErrorToast } from "@src/shared/components/Toast/CustomToast";

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation<CreatePostResponse, Error, PostFormData>({
    mutationFn: (postData) => createPost(postData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MEMBER_POSTS],
      });
      showSuccessToast("Successfully created");
    },
    onError: (error) => {
      console.error("Post creation error:", error);
      showErrorToast("Failed to create");
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation<
    EditPostResponse,
    Error,
    { postId: number; postData: PostFormData }
  >({
    mutationFn: ({ postId, postData }) => updatePost(postId, postData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MEMBER_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.POST, variables.postId],
      });
      showSuccessToast("Successfully updated");
    },
    onError: (error) => {
      console.error("Post update error:", error);
      showErrorToast("Failed to update");
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (postId) => deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MEMBER_POSTS],
      });
      showSuccessToast("Successfully deleted");
    },
    onError: (error) => {
      console.error("Post deletion error:", error);
      showErrorToast("Failed to delete");
    },
  });
};
