import { useEffect, useRef } from "react";

export const useCommandMenuInput = () => {
  const container = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    container.current = document.getElementById("navigator-search-input") as HTMLInputElement;
  }, []);

  const updateAriaActiveDescendant = (id: string) => {
    if (!container.current) return;

    container.current.setAttribute("aria-activedescendant", id);
  };

  const clearActiveDescendant = () => {
    if (!container.current) return;

    container.current.removeAttribute("aria-activedescendant");
  };

  const resetInput = () => {
    if (!container.current) return;

    clearActiveDescendant();
    container.current = null;
  };

  return {
    resetInput,
    clearActiveDescendant,
    updateAriaActiveDescendant,
  };
};
