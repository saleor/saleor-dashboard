import { useEffect, useState } from "react";

import { useDelayedState } from "./useDelayedState";
import { usePressEscKey } from "./usePressEscKey";

export const useFullScreenMode = () => {
  const [open, setOpen] = useState(false);
  const { delayedState: delayedOpen } = useDelayedState(!open);

  usePressEscKey(() => {
    setOpen(false);
  });

  const toggle = () => {
    setOpen(p => !p);
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
