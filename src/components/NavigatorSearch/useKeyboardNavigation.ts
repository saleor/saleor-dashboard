import useNavigator from "@dashboard/hooks/useNavigator";
import { globalSearchUrl } from "@dashboard/search/urls";
import { useEffect, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { useActionItems } from "./useActionItems";
import { useInput } from "./useInput";
import { useNavigatorSearchContext } from "./useNavigatorSearchContext";

const hotkeysSettings = {
  enableOnFormTags: true,
  scopes: ["command-menu"],
};

export const useKeyboardNavigation = ({ query }: { query: string }) => {
  const navigate = useNavigator();

  const scope = useRef<HTMLDivElement | null>(null);
  const { isNavigatorVisible, setNavigatorVisibility } = useNavigatorSearchContext();
  const { updateAriaActiveDescendant, resetInput } = useInput();
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

  useEffect(() => {
    focusFirst();

    const activeFocusedElement = getActiveFocusedElement();

    if (activeFocusedElement) {
      updateAriaActiveDescendant(activeFocusedElement.id);
    }
  }, [query]);

  useHotkeys(
    "tab",
    event => {
      event.preventDefault();
      focusNext();

      return false;
    },
    hotkeysSettings,
  );

  useHotkeys(
    "up",
    event => {
      event.preventDefault();
      focusPrevious();

      return false;
    },
    hotkeysSettings,
  );

  useHotkeys(
    "down",
    event => {
      event.preventDefault();
      focusNext();

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
  }, [isNavigatorVisible]);

  return {
    scope,
    resetFocus,
    collectLinks,
    collectTableRows,
  };
};
