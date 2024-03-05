import { useEffect } from "react";

type DevModeKeyTriggerCallback = (
  err: Error | null,
  { shift }: { shift: boolean },
) => void;

export const useDevModeKeyTrigger = (callback: DevModeKeyTriggerCallback) => {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.shiftKey && event.metaKey && event.code === "Quote") {
        callback(null, { shift: true });
      } else if (event.metaKey && event.code === "Quote") {
        callback(null, { shift: false });
      } else if (event.ctrlKey && event.code === "Quote") {
        callback(null, { shift: false });
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [callback]);
};
