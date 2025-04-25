import { useState } from "react";

export interface FilterWindow {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

export const useFilterWindow = () => {
  const [open, setOpen] = useState(false);

  return {
    isOpen: open,
    setOpen,
  };
};
