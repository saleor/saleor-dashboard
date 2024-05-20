import { useCallback, useRef } from "react";

export const useOverflowDetection = <T extends HTMLElement>() => {
  const elementsRef = useRef<T[]>([]);

  const setRef = useCallback(
    (index: number) => (element: T | null) => {
      if (element) {
        elementsRef.current[index] = element;
      }
    },
    [],
  );

  const isOverflowing = useCallback((index: number): boolean | undefined => {
    const element = elementsRef.current[index];

    if (!element) {
      return undefined;
    }

    return element.scrollWidth > element.clientWidth;
  }, []);

  return { setRef, isOverflowing, elementsRef };
};
