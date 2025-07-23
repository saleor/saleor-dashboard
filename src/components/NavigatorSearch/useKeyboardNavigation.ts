import useNavigator from "@dashboard/hooks/useNavigator";
import hotkeys from "hotkeys-js";
import React, { useEffect, useRef } from "react";

import { useNavigatorSearchContext } from "./useNavigatorSearchContext";

const navigatorHotkey = "ctrl+k, command+k";

const NAVIGATION_KEYS = ["Tab", "ArrowDown", "ArrowUp"];

const useInput = () => {
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

    container.current.value = null;
  };

  return {
    resetInput,
    updateAriaActiveDescendant,
  };
};

const useActionItems = () => {
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
      element.scrollIntoView({ behavior: "smooth", block: "nearest" });
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

export const useKeyboardNavigation = () => {
  const { isNavigatorVisible, setNavigatorVisibility } = useNavigatorSearchContext();
  const { updateAriaActiveDescendant, resetInput } = useInput();
  const {
    resetFocus,
    collectLinks,
    collectTableRows,
    hasAnyFocus,
    focusFirst,
    focusNext,
    focusPrevious,
    getActiveFocusedElement,
    takeAction,
  } = useActionItems();

  useEffect(() => {
    hotkeys(navigatorHotkey, event => {
      event.preventDefault();
      setNavigatorVisibility(!isNavigatorVisible);
    });

    return () => hotkeys.unbind(navigatorHotkey);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (NAVIGATION_KEYS.includes(e.key)) {
      e.preventDefault();

      if (!hasAnyFocus()) {
        focusFirst();

        const activeFocusedElement = getActiveFocusedElement();

        if (activeFocusedElement) {
          updateAriaActiveDescendant(activeFocusedElement.id);
        }

        return;
      }
    }

    if (e.key === "Tab") {
      focusNext();
    }

    if (e.key === "ArrowDown") {
      focusNext();
    }

    if (e.key === "ArrowUp") {
      focusPrevious();
    }

    if (e.key === "Enter") {
      setNavigatorVisibility(false);
      takeAction();
      resetFocus();
      resetInput();
    }
  };

  const closeCommandMenu = () => {
    setNavigatorVisibility(false);
    resetFocus();
  };

  return {
    resetFocus,
    collectLinks,
    collectTableRows,
    handleKeyDown,
    closeCommandMenu,
    isCommandMenuOpen: isNavigatorVisible,
  };
};
