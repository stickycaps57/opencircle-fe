import { Modal } from "../Modal";
import { ProfileAvatar } from "@src/shared/components/ProfileAvatar";

interface Member {
  id: string;
  name: string;
  avatar: string;
  joinedAt: string;
}

interface MembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: Member[];
  onRemoveMember?: (memberId: string) => void;
}

export function MembersModal({
  isOpen,
  onClose,
  members,
  onRemoveMember,
}: MembersModalProps) {
  const handleRemoveMember = (memberId: string) => {
    onRemoveMember?.(memberId);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-3xl">
      {/* Header */}
      <div className="relative p-6 border-b border-gray-100">
        <h2 className="text-responsive-base font-bold text-primary text-center">
          Members ({members.length})
        </h2>
        <button
          onClick={onClose}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 text-placeholderbg hover:text-primary transition-colors text-responsive-xs"
        >
          Close
        </button>
      </div>

      <div className="flex flex-col h-full max-h-[calc(85vh-120px)]">
        {/* Scrollable Members List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[calc(85vh-180px)]">
          {members.length > 0 ? (
            members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 bg-athens_gray rounded-xl"
              >
                <div className="flex items-center space-x-3">
                  <ProfileAvatar
                    src={member.avatar}
                    alt={`${member.name} avatar`}
                    className="w-12 h-12"
                    type="member"
                    isOwner={false}
                    memberUuid={member.id}
                    name={member.name}
                    nameClassName="text-primary font-medium text-responsive-xs"
                  >
                    <p className="text-placeholderbg text-responsive-xxs">
                      Joined {member.joinedAt}
                    </p>
                  </ProfileAvatar>
                </div>
                {onRemoveMember && (
                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    className="px-3 sm:px-4 py-1 sm:py-2 border border-primary text-primary text-responsive-xs rounded-full hover:bg-gray-50 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-placeholderbg text-responsive-xs">
                No members yet. Invite people to join this event!
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
