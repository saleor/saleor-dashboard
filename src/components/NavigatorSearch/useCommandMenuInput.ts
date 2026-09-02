import { useEffect, useRef } from "react";

import { NAVIGATOR_SEARCH_INPUT_ID } from "./consts";

export const useCommandMenuInput = () => {
  const container = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    container.current = document.getElementById(NAVIGATOR_SEARCH_INPUT_ID) as HTMLInputElement;
  }, []);

  const updateAriaActiveDescendant = (id: string) => {
    if (!container.current) return;

    // An empty value would be a dangling reference; "no active option" is
    // expressed by dropping the attribute instead.
    if (!id) {
      clearActiveDescendant();

      return;
    }

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
