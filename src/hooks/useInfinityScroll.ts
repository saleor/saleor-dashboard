import { useEffect, useRef } from "react";

import useDebounce from "./useDebounce";

const SCROLL_THRESHOLD = 100;
const DEBOUNCE_TIME = 500;

export const useInfinityScroll = ({
  onLoadMore,
  theshold = SCROLL_THRESHOLD,
  debounceTime = DEBOUNCE_TIME,
  loadOnInit,
}: {
  onLoadMore: () => void;
  theshold?: number;
  debounceTime?: number;
  loadOnInit?: boolean;
}) => {
  const elementRef = useRef<HTMLElement>();
  const isRefSet = useRef(false);

  const setScrolltRef = (element: HTMLElement) => {
    elementRef.current = element;
  };

  useEffect(() => {
    if (!isRefSet.current && elementRef.current) {
      isRefSet.current = true;

      //  In case when we set scrollRef on the first time and we have to immediately load more warehouses
      // because we reached theshold
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

    return scrollBottom < theshold;
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
    setScrolltRef,
  };
};
