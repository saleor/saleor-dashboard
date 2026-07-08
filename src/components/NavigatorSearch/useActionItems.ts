import useNavigator from "@dashboard/hooks/useNavigator";
import { useRef } from "react";

const COMMAND_MENU_ITEM_SELECTOR = ".command-menu-item";
const COMMAND_MENU_ROW_SELECTOR = "tr[data-href]";

export const useActionItems = () => {
  const navigate = useNavigator();
  const items = useRef<HTMLElement[]>([]);
  const currentFocusIndex = useRef<number | undefined>(undefined);

  const collectItems = (container: HTMLElement | null) => {
    if (!container) {
      items.current = [];

      return;
    }

    items.current = Array.from(
      container.querySelectorAll(`${COMMAND_MENU_ITEM_SELECTOR}, ${COMMAND_MENU_ROW_SELECTOR}`),
    ) as HTMLElement[];
  };

  const focusElement = (index: number, value: boolean) => {
    const element = items.current[index];

    if (!element) {
      return;
    }

    element.setAttribute("data-focus", value.toString());
    element.setAttribute("aria-selected", value.toString());

    if (value) {
      element.scrollIntoView({ behavior: "auto", block: "nearest" });
    }
  };

  const focusNext = () => {
    if (typeof currentFocusIndex.current === "undefined") return;

    focusElement(currentFocusIndex.current, false);
    currentFocusIndex.current = (currentFocusIndex.current + 1) % items.current.length;
    focusElement(currentFocusIndex.current, true);
  };

  const focusPrevious = () => {
    if (typeof currentFocusIndex.current === "undefined") return;

    if (currentFocusIndex.current === 0) return;

    focusElement(currentFocusIndex.current, false);
    currentFocusIndex.current = (currentFocusIndex.current - 1) % items.current.length;
    focusElement(currentFocusIndex.current, true);
  };

  const clearAllFocus = () => {
    items.current.forEach(element => {
      element.setAttribute("data-focus", "false");
      element.setAttribute("aria-selected", "false");
    });
  };

  const restoreFocus = (preferredId?: string) => {
    clearAllFocus();

    if (items.current.length === 0) {
      currentFocusIndex.current = undefined;

      return;
    }

    if (preferredId) {
      const preferredIndex = items.current.findIndex(item => item.id === preferredId);

      if (preferredIndex >= 0) {
        currentFocusIndex.current = preferredIndex;
        focusElement(preferredIndex, true);

        return;
      }
    }

    currentFocusIndex.current = 0;
    focusElement(0, true);
  };

  const focusFirst = () => {
    restoreFocus();
  };

  const resetFocus = () => {
    currentFocusIndex.current = undefined;
    items.current = [];
  };

  const hasAnyFocus = () => {
    return typeof currentFocusIndex.current !== "undefined";
  };

  const getActiveFocusedElement = () => {
    if (typeof currentFocusIndex.current === "undefined") {
      return undefined;
    }

    return items.current[currentFocusIndex.current];
  };

  const takeAction = () => {
    const element = getActiveFocusedElement();

    if (!element || !element.dataset.href) return;

    navigate(element.dataset.href);
  };

  return {
    items,
    currentFocusIndex,
    resetFocus,
    collectItems,
    focusNext,
    focusPrevious,
    hasAnyFocus,
    focusFirst,
    restoreFocus,
    getActiveFocusedElement,
    takeAction,
  };
};
