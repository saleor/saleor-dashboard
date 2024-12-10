// @ts-strict-ignore
import { useLayoutEffect, useRef, useState } from "react";

interface OverflowConfig {
  horizontal?: boolean;
  vertical?: boolean;
}

const getIsHorizontal = (el: HTMLElement, config: OverflowConfig) =>
  config.horizontal && el && el.scrollWidth > el.clientWidth;
const getIsVertical = (el: HTMLElement, config: OverflowConfig) =>
  config.vertical && el && el.scrollHeight > el.clientHeight;

export const useOverflow = <T extends HTMLElement>(
  config: OverflowConfig = { horizontal: true, vertical: true },
) => {
  const ref = useRef<T>(null);
  const [isHorizontal, setIsHorizontal] = useState(false);
  const [isVertical, setIsVertical] = useState(false);

  useLayoutEffect(() => {
    const trigger = () => {
      setIsHorizontal(getIsHorizontal(ref.current, config));
      setIsVertical(getIsVertical(ref.current, config));
    };

    if (ref.current) {
      trigger();
    }

    window.addEventListener("resize", trigger);

    return () => {
      window.removeEventListener("resize", trigger);
    };
  }, [ref, config]);

  return {
    ref,
    isHorizontal,
    isVertical,
    isOverflow: isHorizontal || isVertical,
  };
};
