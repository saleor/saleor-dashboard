import { useEffect } from "react";

type DevModeKeyTriggerCallback = () => void;

export const useDevModeKeyTrigger = (callbackHandler: DevModeKeyTriggerCallback) => {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.code === "Quote") {
        callbackHandler();
      }
    };

    document.addEventListener("keydown", handler);

    return () => document.removeEventListener("keydown", handler);
  }, [callbackHandler]);
};
