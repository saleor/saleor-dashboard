import { useEffect, useRef } from "react";

export const useOutsideClick = (onClickOutside?: () => void) => {
  const boxRef = useRef<HTMLElement>();

  useEffect(() => {
    if (!onClickOutside) return;

    const handleClick = (event: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
        onClickOutside();
      }
    };
    document.addEventListener("mousedown", handleClick);

    return () => document.removeEventListener("mousedown", handleClick);
  }, [boxRef, onClickOutside]);

  return boxRef;
};
