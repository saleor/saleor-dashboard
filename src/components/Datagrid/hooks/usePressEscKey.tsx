// @ts-strict-ignore
import { useEffect } from "react";

export const usePressEscKey = (callback?: () => void) => {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.code === "Escape") {
        callback();
      }
    };

    document.addEventListener("keydown", handler);

    return () => document.removeEventListener("keydown", handler);
  }, [callback]);
};
