import { useState } from "react";

export const useManageChannels = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(p => !p);
  };

  return {
    isOpen,
    toggle,
  };
};
