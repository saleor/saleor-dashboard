import { useRef } from "react";

import useDebounce from "./useDebounce";

const SCROLL_THRESHOLD = 100;
const DEBOUNCE_TIME = 500;

export const useInfinityScroll = ({
  onLoadMore,
  theshold = SCROLL_THRESHOLD,
  debounceTime = DEBOUNCE_TIME,
}: {
  onLoadMore: () => void;
  theshold?: number;
  debounceTime?: number;
}) => {
  const elementRef = useRef<HTMLElement>(null);

  const setScrolltRef = (element: HTMLElement) => {
    elementRef.current = element;
  };

  const handleInfiniteScroll = () => {
    if (!elementRef.current) {
      return;
    }

    const scrollHeight = elementRef.current.scrollHeight;
    const scrollTop = elementRef.current.scrollTop;
    const clientHeight = elementRef.current.clientHeight;
    const scrollBottom = scrollHeight - (scrollTop + clientHeight);

    if (scrollBottom < theshold) {
      onLoadMore();
    }
  };

  const debouncedHandleInfiniteScroll = useDebounce(handleInfiniteScroll, debounceTime);

  return {
    onScroll: debouncedHandleInfiniteScroll,
    setScrolltRef,
  };
};
