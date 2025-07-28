import useNavigator from "@dashboard/hooks/useNavigator";
import { globalSearchUrl } from "@dashboard/search/urls";
import { useEffect, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { useActionItems } from "./useActionItems";
import { useCommandMenuInput } from "./useCommandMenuInput";
import { useNavigatorSearchContext } from "./useNavigatorSearchContext";

const hotkeysSettings = {
  enableOnFormTags: true,
  scopes: ["command-menu"],
};

// TODO: Cover going upwards with shift+tab,
export const useKeyboardNavigation = ({ query }: { query: string }) => {
  const navigate = useNavigator();

  const scope = useRef<HTMLDivElement | null>(null);
  const { isNavigatorVisible, setNavigatorVisibility } = useNavigatorSearchContext();
  const { updateAriaActiveDescendant, clearActiveDescendant, resetInput } = useCommandMenuInput();
  const {
    resetFocus,
    collectLinks,
    collectTableRows,
    focusFirst,
    focusNext,
    focusPrevious,
    getActiveFocusedElement,
    takeAction,
  } = useActionItems();

  const updateDescendant = () => {
    const activeFocusedElement = getActiveFocusedElement();

    if (activeFocusedElement) {
      updateAriaActiveDescendant(activeFocusedElement.id);

      return;
    }

    clearActiveDescendant();
  };

  useEffect(() => {
    focusFirst();
    updateDescendant();
  }, [query]);

  useHotkeys(
    "tab",
    event => {
      event.preventDefault();
      focusNext();
      updateDescendant();

      return false;
    },
    hotkeysSettings,
  );

  useHotkeys(
    "up",
    event => {
      event.preventDefault();
      focusPrevious();
      updateDescendant();

      return false;
    },
    hotkeysSettings,
  );

  useHotkeys(
    "down",
    event => {
      event.preventDefault();
      focusNext();
      updateDescendant();

      return false;
    },
    hotkeysSettings,
  );

  useHotkeys(
    "ctrl+enter, meta+enter",
    event => {
      event.preventDefault();
      setNavigatorVisibility(false);
      resetFocus();
      updateDescendant();

      navigate(globalSearchUrl({ query }));

      return false;
    },
    hotkeysSettings,
  );

  useHotkeys(
    "enter",
    event => {
      event.preventDefault();
      takeAction();
      resetInput();

      setNavigatorVisibility(false);

      return false;
    },
    hotkeysSettings,
  );

  useEffect(() => {
    if (isNavigatorVisible) return;

    resetFocus();
    updateDescendant();
  }, [isNavigatorVisible]);

  return {
    scope,
    resetFocus,
    collectLinks,
    collectTableRows,
  };
};
