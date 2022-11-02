import { useKeyDown } from "@saleor/hooks/useKeyDown";
import { usePreventHistoryBack } from "@saleor/hooks/usePreventHistoryBack";
import { useEffect, useState } from "react";

import { useDelayedState } from "./useDelayedState";

export const useFullScreenMode = () => {
  const { enable, disable } = usePreventHistoryBack(document.body, {
    defaultEnabled: false,
  });
  const [open, setOpen] = useState(false);
  const { delayedState: delayedOpen } = useDelayedState(!open);
  const togglePreventHistory = open ? disable : enable;

  useKeyDown("Escape", () => {
    setOpen(false);
  });

  const toggle = () => {
    setOpen(p => !p);
    togglePreventHistory();
  };

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return {
    isOpen: open,
    isAnimationOpenFinished: !delayedOpen,
    toggle,
  };
};
