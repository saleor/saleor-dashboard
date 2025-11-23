import throttle from "lodash/throttle";
import { useEffect, useState } from "react";

export const useScrollRight = () => {
  const [scrolledToRight, setScrolledToRight] = useState(false);
  const scroller = document.querySelector<HTMLDivElement>(".dvn-scroller");
  const scrollerInner = document.querySelector<HTMLDivElement>(".dvn-scroll-inner");

  useEffect(() => {
    if (!(scroller && scrollerInner)) {
      return;
    }

    const handler = throttle(() => {
      const isScrolledToRight =
        scroller.scrollWidth - scroller.clientWidth - scroller.scrollLeft < 2;

      setScrolledToRight(isScrolledToRight);
    }, 100);

    scroller.addEventListener("scroll", handler);

    return () => scroller.removeEventListener("scroll", handler);
  }, [scroller, scrollerInner]);

  return { scrolledToRight, scroller };
};
