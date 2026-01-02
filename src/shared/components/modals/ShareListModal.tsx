import { Modal } from "@src/shared/components/Modal";
import { useInfiniteSharesByContent } from "@src/features/share/model/share.infinite.query";
import { LoadingState, ErrorState } from "@src/shared/components";
import { Spinner } from "@src/shared/components/Spinner";
import { useFormatDate } from "@src/shared/hooks/useFormatDate";
import { useImageUrl } from "@src/shared/hooks/useImageUrl";
import { ProfileAvatar } from "@src/shared/components/ProfileAvatar";
import type { InfiniteData } from "@tanstack/react-query";
import type { ShareByContentResponse, ShareByContentItem } from "@src/features/share/schema/share.types";

type ShareListModalProps = {
  isOpen: boolean;
  onClose: () => void;
  contentType: "post" | "event";
  contentId: number;
};

export function ShareListModal({ isOpen, onClose, contentType, contentId }: ShareListModalProps) {
  const content_type_num = contentType === "post" ? 1 : 2;
  const { data, isLoading, isError, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteSharesByContent({ content_type: content_type_num, content_id: contentId, limit: 10 });
  const { formatRelativeTime } = useFormatDate();
  const { getImageUrl } = useImageUrl();

  const pagesData = data as InfiniteData<ShareByContentResponse> | undefined;
  const pages = pagesData?.pages || [];
  const shares: ShareByContentItem[] = pages.flatMap((p) => p.shares);
  const total = pages[0]?.pagination?.total || 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-3xl">
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div></div>
        <h2 className="text-responsive-base font-bold text-primary">Shares</h2>
        <button onClick={onClose} className="text-placeholderbg hover:text-primary transition-colors text-responsive-xs">Close</button>
      </div>

      <div className="flex flex-col h-full max-h-[calc(85vh-120px)]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <span className="text-responsive-xs text-primary">Show {shares.length} out of {total}</span>
          </div>
          <div className="flex items-center space-x-3"></div>
        </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-2 max-h-[calc(85vh-240px)]">
          {isLoading && <LoadingState message="Loading shares..." />}
          {isError && <ErrorState message="Failed to load shares." />}

          {!isLoading && !isError ? (
            <>
              {isFetching && <Spinner size="sm" />}
              {shares.map((s: ShareByContentItem) => {

                const displayName =
                  s.sharer.organization_name?.trim() ||
                  [s.sharer.first_name, s.sharer.last_name]
                    .filter(Boolean)
                    .join(" ")
                    ?.trim() ||
                  "Someone";
                
                const avatarSrc = getImageUrl(s.sharer.profile_picture);

                return (
                  <div key={s.share_id} className="">
                    <div className=" py-1 px-6 lg:py-1 lg:px-12">
                      <ProfileAvatar
                        src={avatarSrc}
                        alt={`${displayName} avatar`}
                        className="w-10 h-10"
                        type={"member"}
                        isOwner={false}
                        memberUuid={s.sharer.uuid ?? undefined}
                        organizationId={undefined}
                        name={displayName}
                        nameClassName="text-primary text-responsive-xs font-bold"
                        containerClassName="flex items-center gap-3 w-full"
                      >
                         <div className="text-placeholderbg text-responsive-xxs whitespace-nowrap">
                            {formatRelativeTime(s.date_created)}
                         </div>
                      </ProfileAvatar>
                    </div>
                  </div>
                );
              })}
              {hasNextPage && (
                <div className="flex justify-center py-2">
                  <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="px-3 py-1.5 bg-primary text-white rounded text-responsive-xs"
                  >
                    {isFetchingNextPage ? "Loading..." : "Load more"}
                  </button>
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </Modal>
  );
}
