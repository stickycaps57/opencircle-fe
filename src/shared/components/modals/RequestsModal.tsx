import { Modal } from "../Modal";
import { ProfileAvatar } from "@src/shared/components/ProfileAvatar";

interface Request {
  id: string;
  name: string;
  avatar: string;
  requestedAt: string;
}

interface RequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  requests: Request[];
  onAcceptRequest?: (requestId: string) => void;
  onDeclineRequest?: (requestId: string) => void;
}

export function RequestsModal({
  isOpen,
  onClose,
  requests,
  onAcceptRequest,
  onDeclineRequest,
}: RequestsModalProps) {
  const handleAcceptRequest = (requestId: string) => {
    onAcceptRequest?.(requestId);
  };

  const handleDeclineRequest = (requestId: string) => {
    onDeclineRequest?.(requestId);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-3xl">
      {/* Header */}
      <div className="relative p-6 border-b border-gray-100">
        <h2 className="text-responsive-base font-bold text-primary text-center">
          Requests ({requests.length})
        </h2>
        <button
          onClick={onClose}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 text-placeholderbg hover:text-primary transition-colors text-responsive-xs"
        >
          Close
        </button>
      </div>

      <div className="flex flex-col h-full max-h-[calc(85vh-120px)]">
        {/* Scrollable Requests List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[calc(85vh-180px)]">
          {requests.length > 0 ? (
            requests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-4 bg-athens_gray rounded-xl"
              >
                <div className="flex items-center space-x-3">
                  <ProfileAvatar
                    src={request.avatar}
                    alt={`${request.name} avatar`}
                    className="w-12 h-12"
                    type="member"
                    isOwner={false}
                    memberUuid={request.id}
                    name={request.name}
                    nameClassName="text-primary font-medium text-responsive-xs"
                  >
                    <p className="text-placeholderbg text-responsive-xxs">
                      {request.requestedAt}
                    </p>
                  </ProfileAvatar>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleAcceptRequest(request.id)}
                    className="px-3 sm:px-4 py-1 sm:py-2 bg-primary text-white text-responsive-xs rounded-full hover:bg-opacity-90 transition-colors"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleDeclineRequest(request.id)}
                    className="px-3 sm:px-4 py-1 sm:py-2 border border-primary text-primary text-responsive-xs rounded-full hover:bg-gray-50 transition-colors"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-placeholderbg text-responsive-xs">
                No pending requests. Share your event to get more participants!
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
