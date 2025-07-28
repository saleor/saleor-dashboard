import useNavigator from "@dashboard/hooks/useNavigator";
import { useRef } from "react";

export const useActionItems = () => {
  const navigate = useNavigator();
  const items = useRef<HTMLElement[]>([]);
  const currentFocusIndex = useRef<number | undefined>(undefined);

  const collectLinks = () => {
    const elements = document.querySelectorAll(".command-menu-item");

    items.current.push(...(Array.from(elements) as HTMLElement[]));
  };

  const collectTableRows = () => {
    const elements = document.querySelectorAll(".command-menu tr");

    items.current.push(...(Array.from(elements) as HTMLElement[]));
  };

  const focusElement = (index: number, value: boolean) => {
    const element = items.current[index];

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

  const focusFirst = () => {
    currentFocusIndex.current = 0;
    focusElement(currentFocusIndex.current, true);
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
    collectLinks,
    collectTableRows,
    focusNext,
    focusPrevious,
    hasAnyFocus,
    focusFirst,
    getActiveFocusedElement,
    takeAction,
  };
};
