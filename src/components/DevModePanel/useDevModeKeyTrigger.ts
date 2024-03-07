import { useEffect } from "react";

type DevModeKeyTriggerCallback = ({ shift }: { shift: boolean }) => void;

export const useDevModeKeyTrigger = (
  callbackHandler: DevModeKeyTriggerCallback,
) => {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.shiftKey && event.metaKey && event.code === "Quote") {
        callbackHandler({ shift: true });
      } else if (event.metaKey && event.code === "Quote") {
        callbackHandler({ shift: false });
      } else if (event.ctrlKey && event.code === "Quote") {
        callbackHandler({ shift: false });
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [callbackHandler]);
};
