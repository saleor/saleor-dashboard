import { useEffect } from "react";

export const useDevModeKeyTrigger = (callback?: () => void) => {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.metaKey && event.code === "Quote") {
        callback();
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [callback]);
};
