import { useMutation, useQueryClient } from "@tanstack/react-query";
import { shareContent } from "../lib/share.api";
import { showSuccessToast, showErrorToast } from "@src/shared/components/Toast/CustomToast";
import type { SharePostFormData } from "../schema/share.schema";
import { QUERY_KEYS } from "@src/shared/constants/queryKeys";

export const useShareContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SharePostFormData) => shareContent(payload),
    onSuccess: (data) => {
       queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.USER_SHARES],
        });
        
        queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.MEMBER_POSTS],
        });
        
        queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.CONTENT_SHARES],
        });

      showSuccessToast(data.message);
    },
    onError: (error: unknown) => {
      console.error("Failed to share content:", error);
      showErrorToast("Failed to share");
    },
  });
};
