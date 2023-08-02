// @ts-strict-ignore
import { useEffect } from "react";

type DevModeKeyTriggerCallback = ({ shift }: { shift: boolean }) => void;

export const useDevModeKeyTrigger = (callback?: DevModeKeyTriggerCallback) => {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.shiftKey && event.metaKey && event.code === "Quote") {
        callback({ shift: true });
      } else if (event.metaKey && event.code === "Quote") {
        callback({ shift: false });
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [callback]);
};
