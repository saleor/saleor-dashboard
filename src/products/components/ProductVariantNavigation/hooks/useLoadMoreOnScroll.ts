import { useCallback, useEffect, useRef } from "react";

interface UseLoadMoreOnScrollProps {
  hasNextPage: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
  /** Re-check when the loaded set grows (list may still not fill the viewport). */
  loadedCount: number;
}

const LOAD_MORE_THRESHOLD_PX = 80;

/**
 * Loads the next page when the user scrolls near the bottom of the list, and
 * also when the current items don't fill the scroll viewport yet.
 */
export const useLoadMoreOnScroll = ({
  hasNextPage,
  loadingMore,
  onLoadMore,
  loadedCount,
}: UseLoadMoreOnScrollProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const maybeLoadMore = useCallback(() => {
    const element = scrollContainerRef.current;

    if (!element || !hasNextPage || loadingMore) {
      return;
    }

    const distanceFromBottom = element.scrollHeight - element.scrollTop - element.clientHeight;

    if (distanceFromBottom <= LOAD_MORE_THRESHOLD_PX) {
      onLoadMore();
    }
  }, [hasNextPage, loadingMore, onLoadMore]);

  const handleScroll = useCallback(() => {
    maybeLoadMore();
  }, [maybeLoadMore]);

  useEffect(
    function loadMoreWhenListDoesNotFillViewport() {
      maybeLoadMore();
    },
    [loadedCount, maybeLoadMore],
  );

  return { scrollContainerRef, handleScroll };
};
