import { useCallback, useRef } from "react";

const DEFAULT_SCROLL_OPTIONS: ScrollIntoViewOptions = { block: "nearest" };

interface UseScrollIntoViewOptions {
  isActive: boolean;
  scrollOptions?: ScrollIntoViewOptions;
}

export const useScrollIntoView = <T extends HTMLElement>({
  isActive,
  scrollOptions = DEFAULT_SCROLL_OPTIONS,
}: UseScrollIntoViewOptions) => {
  const scrolledRef = useRef(false);

  const scrollRef = useCallback(
    (node: T | null) => {
      if (isActive && node && !scrolledRef.current) {
        node.scrollIntoView(scrollOptions);
        scrolledRef.current = true;
      }
    },
    [isActive, scrollOptions],
  );

  return { scrollRef };
};
