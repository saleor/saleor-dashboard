import { useCallback, useRef } from "react";

export const useOverflowDetection = <T extends HTMLElement>() => {
  const elementRef = useRef<T | null>(null);

  const isOverflowing = useCallback((): boolean | undefined => {
    const element = elementRef.current;

    if (!element) {
      return undefined;
    }

    return element.scrollWidth > element.clientWidth;
  }, []);

  return { isOverflowing, elementRef };
};
