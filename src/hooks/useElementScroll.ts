// @ts-strict-ignore
import throttle from "lodash/throttle";
import { MutableRefObject, useEffect, useState } from "react";

export type Position = Record<"x" | "y", number>;

function getPosition(anchor?: HTMLElement): Position {
  if (!!anchor) {
    return {
      x: anchor.scrollLeft,
      y: anchor.scrollTop,
    };
  }
  return undefined;
}

export function isScrolledToBottom(
  anchor: MutableRefObject<HTMLElement>,
  position: Position,
  offset: number = 0,
) {
  return !!anchor.current && position
    ? position.y + anchor.current.clientHeight + offset >= anchor.current.scrollHeight
    : undefined;
}

function useElementScroll(anchor: MutableRefObject<HTMLElement>): Position {
  const [scroll, setScroll] = useState(getPosition(anchor.current));

  useEffect(() => {
    const anchorInstance = anchor.current;

    if (!!anchorInstance) {
      const handleScroll = throttle(() => setScroll(getPosition(anchorInstance)), 100);
      anchorInstance.addEventListener("scroll", handleScroll);

      return () => {
        if (!!anchorInstance) {
          anchorInstance.removeEventListener("scroll", handleScroll);
        }
      };
    }
  }, [anchor.current]);
  useEffect(() => {
    setTimeout(() => setScroll(getPosition(anchor.current)), 100);
  }, []);

  return scroll;
}
export default useElementScroll;
