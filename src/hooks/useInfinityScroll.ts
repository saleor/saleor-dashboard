import { useCallback, useRef } from "react";

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

  const setScrolltRef = (element: HTMLElement) => {
    if (!elementRef.current) {
      elementRef.current = element;

      // In case when we set scrollRef on the first time and we have to immediately load more warehouses
      // because we reached theshold
      if (loadOnInit && shouldLoadMore(element)) {
        onLoadMore();
      }
    }
  };

  const shouldLoadMore = useCallback(
    (element: HTMLElement | null) => {
      if (!element) {
        return false;
      }

      const scrollHeight = element.scrollHeight;
      const scrollTop = element.scrollTop;
      const clientHeight = element.clientHeight;

      const scrollBottom = scrollHeight - (scrollTop + clientHeight);

      return scrollBottom < theshold;
    },
    [theshold],
  );

  const handleInfiniteScroll = () => {
    if (!elementRef.current) {
      return;
    }

    if (shouldLoadMore(elementRef.current)) {
      onLoadMore();
    }
  };

  const debouncedHandleInfiniteScroll = useDebounce(handleInfiniteScroll, debounceTime);

  return {
    onScroll: debouncedHandleInfiniteScroll,
    setScrolltRef,
  };
};
