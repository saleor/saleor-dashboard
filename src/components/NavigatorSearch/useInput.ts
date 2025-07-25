import { useEffect, useRef } from "react";

export const useInput = () => {
  const container = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    container.current = document.getElementById("navigator-search-input") as HTMLInputElement;
  }, []);

  const updateAriaActiveDescendant = (id: string) => {
    if (!container.current) return;

    container.current.setAttribute("aria-activedescendant", id);
  };

  const resetInput = () => {
    if (!container.current) return;

    container.current = null;
  };

  return {
    resetInput,
    updateAriaActiveDescendant,
  };
};
