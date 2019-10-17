import throttle from "lodash-es/throttle";
import { MutableRefObject, useEffect, useState } from "react";

export type Position = Record<"x" | "y", number>;

function getPosition(anchor?: HTMLElement): Position {
  if (!!anchor) {
    return {
      x: anchor.scrollLeft,
      y: anchor.scrollTop
    };
  }
  return undefined;
}

export function isScrolledToBottom(
  anchor: MutableRefObject<HTMLElement>,
  position: Position,
  offset: number = 0
) {
  return !!anchor.current && position
    ? position.y + anchor.current.clientHeight + offset >=
        anchor.current.scrollHeight
    : undefined;
}

function useElementScroll(anchor: MutableRefObject<HTMLElement>): Position {
  const [scroll, setScroll] = useState(getPosition(anchor.current));

  useEffect(() => {
    if (!!anchor.current) {
      const handleScroll = throttle(
        () => setScroll(getPosition(anchor.current)),
        100
      );
      anchor.current.addEventListener("scroll", handleScroll);

      return () => anchor.current.removeEventListener("scroll", handleScroll);
    }
  }, [anchor.current]);

  useEffect(() => {
    setTimeout(() => setScroll(getPosition(anchor.current)), 100);
  }, []);

  return scroll;
}
export default useElementScroll;
