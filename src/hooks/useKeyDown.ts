import { useEffect } from "react";

export const useKeyDown = (
  keyCode: KeyboardEvent["code"],
  callback?: () => void,
) => {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.code === keyCode) {
        callback();
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [callback, keyCode]);
};
