import React, { useRef } from "react";

/**
 * Hook that prevents hostory-back when use touchpad on Mac.
 * Since overscroll-behavior sometimes may not work (eg. Safari 15 which is in use)
 * We need to handle this in JS
 *
 * https://caniuse.com/css-overscroll-behavior
 */

export const usePreventHistoryBack = (scroller: HTMLDivElement) => {
  const offsetY = useRef(0);

  const wheelHandler = evt => {
    const notVertival =
      offsetY.current === 0 || offsetY.current === window.scrollY;

    if (evt.target.scrollLeft <= 0 && evt.deltaX <= 0 && notVertival) {
      evt.preventDefault();
    }

    offsetY.current = window.scrollY;
  };

  React.useEffect(() => {
    if (!scroller) {
      return;
    }

    scroller.scrollLeft = 1;
    scroller.addEventListener("wheel", wheelHandler, { passive: false });

    return () => {
      scroller.removeEventListener("wheel", wheelHandler);
    };
  });
};
