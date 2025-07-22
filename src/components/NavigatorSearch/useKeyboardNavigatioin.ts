import useNavigator from "@dashboard/hooks/useNavigator";
import hotkeys from "hotkeys-js";
import React, { useEffect, useRef } from "react";

import { useNavigatorSearchContext } from "./useNavigatorSearchContext";

const navigatorHotkey = "ctrl+k, command+k";

const NAVIGATION_KEYS = ["Tab", "ArrowDown", "ArrowUp"];

const useInput = () => {
  const container = useRef<HTMLInputElement>(null);

  const attach = (e: React.KeyboardEvent<HTMLDivElement>) => {
    container.current = e.currentTarget.querySelector("input") as HTMLInputElement;
  };

  const updateAriaActiveDescendant = (id: string) => {
    container.current.setAttribute("aria-activedescendant", id);
  };

  return {
    container,
    attach,
    updateAriaActiveDescendant,
  };
};

const useActionItems = () => {
  const navigate = useNavigator();
  const items = useRef<HTMLElement[]>([]);
  const currentFocusIndex = useRef<number>(undefined);

  const attach = (e: React.KeyboardEvent<HTMLDivElement>) => {
    items.current = Array.from(e.currentTarget.querySelectorAll(".command-menu-item"));
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
    focusElement(currentFocusIndex.current, false);
    currentFocusIndex.current = (currentFocusIndex.current + 1) % items.current.length;
    focusElement(currentFocusIndex.current, true);
  };

  const focusPrevious = () => {
    focusElement(currentFocusIndex.current, false);
    currentFocusIndex.current = (currentFocusIndex.current - 1) % items.current.length;
    focusElement(currentFocusIndex.current, true);
  };

  const resetFocus = () => {
    currentFocusIndex.current = 0;
    focusElement(currentFocusIndex.current, true);
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

    if (!element) return;

    navigate(element.dataset.href);
  };

  return {
    attach,
    focusNext,
    focusPrevious,
    hasAnyFocus,
    resetFocus,
    getActiveFocusedElement,
    takeAction,
  };
};

export const useKeyboardNavigation = () => {
  const { isNavigatorVisible, setNavigatorVisibility } = useNavigatorSearchContext();
  const { attach: attachInput, updateAriaActiveDescendant } = useInput();
  const {
    attach: attachActionsItems,
    hasAnyFocus,
    resetFocus,
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
    attachInput(e);
    attachActionsItems(e);

    if (NAVIGATION_KEYS.includes(e.key)) {
      e.preventDefault();

      if (!hasAnyFocus()) {
        resetFocus();
        updateAriaActiveDescendant(getActiveFocusedElement().id);

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
    }
  };

  return {
    handleKeyDown,
    closeCommandMenu: () => setNavigatorVisibility(false),
    isCommandMenuOpen: isNavigatorVisible,
  };
};
