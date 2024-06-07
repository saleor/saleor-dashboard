import { useCallback, useEffect, useRef } from "react";

import useDebounce from "./useDebounce";

const SCROLL_THRESHOLD = 100;
const DEBOUNCE_TIME = 500;

export const useInfinityScroll = <TElementRef extends HTMLElement>({
  onLoadMore,
  threshold = SCROLL_THRESHOLD,
  debounceTime = DEBOUNCE_TIME,
}: {
  onLoadMore: () => void;
  threshold?: number;
  debounceTime?: number;
}) => {
  const scrollRef = useRef<TElementRef>(null);

  const shouldLoadMore = useCallback(() => {
    if (!scrollRef.current) {
      return false;
    }

    const totalScrollHeight = scrollRef.current.scrollHeight;
    const scrollTop = scrollRef.current.scrollTop;
    const clientHeight = scrollRef.current.clientHeight;

    if (scrollTop === 0 && totalScrollHeight === 0 && clientHeight === 0) {
      return false;
    }

    const scrolledHeight = scrollTop + clientHeight;
    const scrollBottom = totalScrollHeight - scrolledHeight;

    return scrollBottom < threshold;
  }, [threshold]);

  const handleInfiniteScroll = () => {
    if (!scrollRef.current) {
      return;
    }

    if (shouldLoadMore()) {
      onLoadMore();
    }
  };

  const debouncedHandleInfiniteScroll = useDebounce(
    handleInfiniteScroll,
    debounceTime,
  );

  useEffect(() => {
    if (!scrollRef.current) {
      return;
    }

    const callback = () => debouncedHandleInfiniteScroll();
    const ref = scrollRef.current;

    ref.addEventListener("scroll", callback);

    return () => {
      ref.removeEventListener("scroll", callback);
    };
  }, [debouncedHandleInfiniteScroll]);

  useEffect(() => {
    // On init check thresholdd and load more if needed
    if (shouldLoadMore()) {
      onLoadMore();
    }
  }, [onLoadMore, shouldLoadMore]);

  return {
    scrollRef,
  };
};
