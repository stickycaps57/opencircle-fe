import { useEffect, useRef, useCallback } from "react";

/**
 * Options for the useInfiniteScroll hook
 */
interface UseInfiniteScrollOptions {
  /**
   * Function to call when more data should be loaded
   */
  onLoadMore: () => void;

  /**
   * Whether there is more data to load
   */
  hasMore: boolean;

  /**
   * Whether data is currently being loaded
   */
  isLoading?: boolean;

  /**
   * Root margin for the intersection observer
   * @default '0px 0px 200px 0px'
   */
  rootMargin?: string;

  /**
   * Threshold for the intersection observer
   * @default 0.1
   */
  threshold?: number;

  /**
   * Whether to enable the infinite scroll
   * @default true
   */
  enabled?: boolean;
}

/**
 * A hook that implements infinite scrolling functionality
 *
 * @param options - Configuration options for the infinite scroll
 * @returns An object containing the ref to attach to the sentinel element
 */
export function useInfiniteScroll({
  onLoadMore,
  hasMore,
  isLoading = false,
  rootMargin = "0px 0px 200px 0px",
  threshold = 0.1,
  enabled = true,
}: UseInfiniteScrollOptions) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Create a callback that will be called when the sentinel element is visible
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry?.isIntersecting && hasMore && !isLoading && enabled) {
        onLoadMore();
      }
    },
    [hasMore, isLoading, onLoadMore, enabled]
  );

  // Set up the intersection observer
  useEffect(() => {
    // If the hook is disabled, don't set up the observer
    if (!enabled) return;

    // Disconnect any existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create a new observer
    observerRef.current = new IntersectionObserver(handleObserver, {
      rootMargin,
      threshold,
    });

    // Observe the sentinel element if it exists
    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observerRef.current.observe(currentSentinel);
    }

    // Clean up the observer when the component unmounts
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver, rootMargin, threshold, enabled]);

  return { sentinelRef };
}
