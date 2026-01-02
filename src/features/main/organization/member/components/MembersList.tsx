import React from "react";
import { useNavigation } from "@src/shared/hooks";
import { useImageUrl } from "@src/shared/hooks/useImageUrl";
import { LoadingState } from "@src/shared/components/states/LoadingState";
import { ErrorState } from "@src/shared/components/states/ErrorState";
import { PrimaryButton } from "@src/shared/components/PrimaryButton";
import type { OrganizationMember } from "../schema/member.types";

interface MembersListProps {
  members: OrganizationMember[];
  isLoading: boolean;
  error: Error | null;
  onRemove?: (userId: number, firstName: string, lastName: string) => void;
}


export const MembersList: React.FC<MembersListProps> = ({
  members,
  isLoading,
  error,
  onRemove,
}) => {
  const { getImageUrl } = useImageUrl();
  const { onMemberClick } = useNavigation();

  return (
    <div className="h-full overflow-y-auto px-4 my-2">
      {isLoading ? (
        <LoadingState message="Loading members..." />
      ) : error ? (
        <ErrorState message={`Error loading members: ${error.message}`} />
      ) : !members || members.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-responsive-sm text-gray-500">
            No members found for this organization.
          </p>
        </div>
      ) : (
        <div className="">
          {members.map((member) => (
            <div
              key={member.user_id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                {member.profile_picture ? (
                  <img
                    src={getImageUrl(member.profile_picture)}
                    alt={`${member.first_name || "User"}'s profile picture`}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0 cursor-pointer"
                    onClick={onMemberClick(member.account_uuid)}
                  />
                ) : (
                  <div
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 cursor-pointer"
                    onClick={onMemberClick(member.account_uuid)}
                  >
                    {(member.first_name || "U").charAt(0)}
                  </div>
                )}
                <div>
                  <h3
                    className="text-responsive-xs md:text-responsive-sm font-medium text-primary group-hover:font-bold hover:underline cursor-pointer"
                    onClick={onMemberClick(member.account_uuid)}
                  >
                    {member.first_name} {member.last_name}
                  </h3>
                </div>
              </div>
              {onRemove && (
                <PrimaryButton
                  label="Remove"
                  variant="removeButton"
                  onClick={() => onRemove(member.user_id, member.first_name, member.last_name)}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
