import { usePreventHistoryBack } from "@saleor/hooks/usePreventHistoryBack";
import { useEffect, useState } from "react";

export const useFullScreenMode = () => {
  const { enable, disable } = usePreventHistoryBack(document.body, false);
  const [open, setOpen] = useState(false);
  const togglePreventHistory = open ? disable : enable;

  const toggle = () => {
    setOpen(p => !p);
    togglePreventHistory();
  };

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return {
    isOpen: open,
    toggle,
  };
};
