import { useCallback, useEffect, useRef } from "react";

import { shouldLoadMoreFromScrollMetrics } from "./shouldLoadMoreFromScrollMetrics";

interface UseLoadMoreOnScrollProps {
  hasNextPage: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
}

/** Set on the scroll container while we adjust scrollTop for the active item. */
export const SUPPRESS_SCROLL_LOAD_ATTR = "data-suppress-scroll-load";

/**
 * Loads the next page when the user scrolls near the bottom.
 * Scroll checks are coalesced to one per animation frame.
 */
export const useLoadMoreOnScroll = ({
  hasNextPage,
  loadingMore,
  onLoadMore,
}: UseLoadMoreOnScrollProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const hasNextPageRef = useRef(hasNextPage);
  const loadingMoreRef = useRef(loadingMore);
  const onLoadMoreRef = useRef(onLoadMore);

  useEffect(
    function syncLoadMoreScrollRefs() {
      hasNextPageRef.current = hasNextPage;
      loadingMoreRef.current = loadingMore;
      onLoadMoreRef.current = onLoadMore;
    },
    [hasNextPage, loadingMore, onLoadMore],
  );

  useEffect(function cancelPendingScrollFrameOnUnmount() {
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const handleScroll = useCallback(() => {
    if (frameRef.current !== null) {
      return;
    }

    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;

      const element = scrollContainerRef.current;

      if (!element || element.hasAttribute(SUPPRESS_SCROLL_LOAD_ATTR)) {
        return;
      }

      if (
        shouldLoadMoreFromScrollMetrics({
          scrollHeight: element.scrollHeight,
          scrollTop: element.scrollTop,
          clientHeight: element.clientHeight,
          maxHeightPx: element.clientHeight,
          hasNextPage: hasNextPageRef.current,
          loadingMore: loadingMoreRef.current,
          userScroll: true,
        })
      ) {
        onLoadMoreRef.current();
      }
    });
  }, []);

  return { scrollContainerRef, handleScroll };
};
