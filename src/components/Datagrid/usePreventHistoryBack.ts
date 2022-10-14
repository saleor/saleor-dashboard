import throttle from "lodash/throttle";
import React from "react";

export const usePreventHistoryBack = (scroller: HTMLDivElement) => {
  React.useEffect(() => {
    if (!scroller) {
      return;
    }

    let offsetX = 0;

    const scrollHandler = throttle(evt => {
      offsetX = evt.target.scrollLeft;
    }, 50);

    const wheelHandler = throttle(evt => {
      if (offsetX <= 0 && evt.deltaX <= 0 && evt.deltaY <= 1) {
        evt.preventDefault();
      }
    }, 50);

    scroller.addEventListener("scroll", scrollHandler);
    scroller.addEventListener("wheel", wheelHandler, { passive: false });

    return () => {
      scroller.removeEventListener("scroll", scrollHandler);
      scroller.removeEventListener("wheel", wheelHandler);
    };
  });
};
