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
  const scrollRef = useRef<TElementRef>(null);

  const shouldLoadMore = () => {
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
  };

  const handleInfiniteScroll = () => {
    if (!scrollRef.current) {
      return;
    }

    if (shouldLoadMore()) {
      onLoadMore();
    }
  };

  const debouncedHandleInfiniteScroll = useDebounce(handleInfiniteScroll, debounceTime);

  useEffect(() => {
    if (!scrollRef.current) {
      return;
    }

    const callback = () => debouncedHandleInfiniteScroll();

    scrollRef.current.addEventListener("scroll", callback);

    return () => {
      scrollRef.current?.removeEventListener("scroll", callback);
    };
  }, [debouncedHandleInfiniteScroll]);

  useEffect(() => {
    //  In case when we set scrollRef on the first time and we have to immediately load more warehouses
    // because we reached threshold
    if (scrollRef.current && loadOnInit && shouldLoadMore()) {
      onLoadMore();
    }
  }, []);

  return {
    scrollRef,
  };
};
