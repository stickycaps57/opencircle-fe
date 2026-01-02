import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postComment, deleteComment, editComment } from "../lib/comment.api";
import type {
  PostCommentFormData,
  EditCommentFormData,
} from "../schema/comment.schema";
import type {
  PostCommentResponse,
  DeleteCommentResponse,
  EditCommentResponse,
} from "../schema/comment.types";
import { QUERY_KEYS } from "@src/shared/constants/queryKeys";
import { showSuccessToast, showErrorToast } from "@src/shared/components/Toast/CustomToast";

export const usePostComment = () => {
  const queryClient = useQueryClient();
  return useMutation<PostCommentResponse, Error, PostCommentFormData>({
    mutationFn: (commentData) => postComment(commentData),
    onSuccess: (_, variables) => {
      const isPostComment = !!variables.post_id;
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.EVENT_COMMENTS],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.POST_COMMENTS],
      });

      if (isPostComment) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.MEMBER_POSTS],
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.ORGANIZATION_ACTIVE_EVENTS],
        });

        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.ORGANIZATION_PAST_EVENTS],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.RANDOM_EVENTS],
        });

        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.MEMBER_EVENTS_BY_RSVP_STATUS],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.MEMBER_PAST_EVENTS],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.CALENDAR_EVENTS],
          exact: false,
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.COMMENT_ANALYTICS_SUMMARY],
        });
      }
    },
    onError: (error) => {
      console.error("Comment posting error:", error);
      showErrorToast("Failed to post");
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation<DeleteCommentResponse, Error, number>({
    mutationFn: (commentId) => deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.EVENT_COMMENTS],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.POST_COMMENTS],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MEMBER_POSTS],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANIZATION_ACTIVE_EVENTS],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANIZATION_PAST_EVENTS],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.RANDOM_EVENTS],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MEMBER_EVENTS_BY_RSVP_STATUS],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MEMBER_PAST_EVENTS],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MEMBER_CALENDAR_EVENTS],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANIZATION_CALENDAR_EVENTS],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CALENDAR_EVENTS],
        exact: false,
      });
      
      showSuccessToast("Comment deleted");
    },
    onError: (error) => {
      console.error("Comment deletion error:", error);
      showErrorToast("Failed to delete");
    },
  });
};

export const useEditComment = () => {
  const queryClient = useQueryClient();
  return useMutation<EditCommentResponse, Error, EditCommentFormData>({
    mutationFn: (commentData) => editComment(commentData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.EVENT_COMMENTS],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.RANDOM_EVENTS],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.POST_COMMENTS],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MEMBER_POSTS],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANIZATION_ACTIVE_EVENTS],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANIZATION_PAST_EVENTS],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.RANDOM_EVENTS],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MEMBER_EVENTS_BY_RSVP_STATUS],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MEMBER_PAST_EVENTS],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MEMBER_CALENDAR_EVENTS],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANIZATION_CALENDAR_EVENTS],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CALENDAR_EVENTS],
        exact: false,
      });
      
      showSuccessToast("Comment updated");
    },
    onError: (error) => {
      console.error("Comment editing error:", error);
      showErrorToast("Failed to update");
    },
  });
};
