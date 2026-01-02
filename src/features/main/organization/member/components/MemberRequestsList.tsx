import React from "react";
import { useNavigation } from "@src/shared/hooks";
import { useImageUrl } from "@src/shared/hooks/useImageUrl";
import { LoadingState } from "@src/shared/components/states/LoadingState";
import { ErrorState } from "@src/shared/components/states/ErrorState";
import { PrimaryButton } from "@src/shared/components/PrimaryButton";
import type { OrganizationMember } from "../schema/member.types";
import avatarImage from "@src/assets/shared/avatar.png";

interface MemberRequestsListProps {
  memberRequests: OrganizationMember[];
  isLoading: boolean;
  error: Error | null;
  onAccept?: (memberId: number) => void;
  onDecline?: (memberId: number) => void;
}

export const MemberRequestsList: React.FC<MemberRequestsListProps> = ({
  memberRequests,
  isLoading,
  error,
  onAccept,
  onDecline,
}) => {
  const { getImageUrl } = useImageUrl();
  const { onMemberClick } = useNavigation();

  return (
    <div className="h-full overflow-y-auto">
      {isLoading ? (
        <LoadingState message="Loading member requests..." />
      ) : error ? (
        <ErrorState
          message={`Error loading member requests: ${error.message}`}
        />
      ) : !memberRequests || memberRequests.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-responsive-sm text-gray-500">
            No pending member requests found.
          </p>
        </div>
      ) : (
        <div className="px-4 my-2">
          {memberRequests.map((request) => (
            <div
              key={request.user_id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <img
                    src={
                      request.profile_picture
                        ? getImageUrl(request.profile_picture)
                        : avatarImage
                    }
                    alt={`${request.first_name || "User"}'s profile picture`}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0 cursor-pointer"
                    onClick={onMemberClick(request.account_uuid)}
                  />
                </div>
                <div>
                  <h3
                    className="text-responsive-xs md:text-responsive-sm font-medium text-primary group-hover:font-bold hover:underline cursor-pointer"
                    onClick={onMemberClick(request.account_uuid)}
                  >
                    {request.first_name} {request.last_name}
                  </h3>
                </div>
              </div>

              <div className="flex space-x-2">
                <PrimaryButton
                  variant="acceptButton"
                  label="Accept"
                  onClick={() => onAccept && onAccept(request.user_id)}
                />
                <PrimaryButton
                  variant="declineButton"
                  label="Decline"
                  onClick={() => onDecline && onDecline(request.user_id)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
