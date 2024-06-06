import { useEffect, useRef } from "react";

import useDebounce from "./useDebounce";

const SCROLL_THRESHOLD = 100;
const DEBOUNCE_TIME = 500;

export const useInfinityScroll = <TElementRef extends HTMLElement>({
  onLoadMore,
  threshold = SCROLL_THRESHOLD,
  debounceTime = DEBOUNCE_TIME,
  loadOnInit,
}: {
  onLoadMore: () => void;
  threshold?: number;
  debounceTime?: number;
  loadOnInit?: boolean;
}) => {
  const elementRef = useRef<TElementRef>();
  const isRefSet = useRef(false);

  const setScrollRef = (element: TElementRef) => {
    elementRef.current = element;
  };

  useEffect(() => {
    if (!isRefSet.current && elementRef.current) {
      isRefSet.current = true;

      //  In case when we set scrollRef on the first time and we have to immediately load more warehouses
      // because we reached threshold
      if (loadOnInit && shouldLoadMore()) {
        onLoadMore();
      }
    }
  }, [isRefSet, loadOnInit, onLoadMore]);

  const shouldLoadMore = () => {
    if (!elementRef.current) {
      return false;
    }

    const scrollHeight = elementRef.current.scrollHeight;
    const scrollTop = elementRef.current.scrollTop;
    const clientHeight = elementRef.current.clientHeight;

    if (scrollTop === 0 && scrollHeight === 0 && clientHeight === 0) {
      return false;
    }

    const scrollBottom = scrollHeight - (scrollTop + clientHeight);

    return scrollBottom < threshold;
  };

  const handleInfiniteScroll = () => {
    if (!elementRef.current) {
      return;
    }

    if (shouldLoadMore()) {
      onLoadMore();
    }
  };

  const debouncedHandleInfiniteScroll = useDebounce(handleInfiniteScroll, debounceTime);

  return {
    onScroll: debouncedHandleInfiniteScroll,
    setScrollRef,
  };
};
