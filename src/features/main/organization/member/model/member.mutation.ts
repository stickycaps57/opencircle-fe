import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMemberRequestStatus } from "../lib/member.api";
import { QUERY_KEYS } from "@src/shared/constants/queryKeys";
import { showSuccessToast, showErrorToast } from "@src/shared/components/Toast/CustomToast";

// Hook for updating a member request status
export const useUpdateMemberRequestStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      status,
    }: {
      userId: number;
      status: "approved" | "rejected";
    }) => updateMemberRequestStatus(userId, status),
    onSuccess: (_, variables) => {
      // Invalidate and refetch member requests and members
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANIZATION_MEMBER_REQUESTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANIZATION_MEMBERS],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MEMBER],
      });
      
      const message = variables.status === "approved" ? "Successfully approved" : "Successfully rejected";
      showSuccessToast(message);
    },
    onError: (error) => {
      console.error("Failed to update member request status:", error);
      showErrorToast("Failed to update");
    },
  });
};
