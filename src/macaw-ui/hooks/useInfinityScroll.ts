import { useEffect, useRef, useState } from "react";

export const useInfinityScroll = (onScrollEnd?: () => void) => {
  const observerTarget = useRef<HTMLElement | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (isIntersecting) {
      onScrollEnd?.();
      setIsIntersecting(false);
    }
  }, [isIntersecting, onScrollEnd]);

  useEffect(() => {
    const target = observerTarget.current;

    if (!target) {
      return;
    }

    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsIntersecting(true);
        }
      },
      { threshold: 0 }
    );

    observer.current.observe(target);

    return () => {
      if (target && observer.current) {
        observer.current.unobserve(target);
      }
    };
  }, [observerTarget]);

  return observerTarget;
};
