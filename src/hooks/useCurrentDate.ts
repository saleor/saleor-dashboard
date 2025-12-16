import { useRef } from "react";

export function useCurrentDate(): number {
  // todo why Date.now() can't be used?
  const currentDate = useRef(Date.now());

  return currentDate.current;
}
