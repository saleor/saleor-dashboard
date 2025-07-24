import useNavigator from "@dashboard/hooks/useNavigator";
import { globalSearchUrl } from "@dashboard/search/urls";
import { useEffect, useRef } from "react";
import { useHotkeys, useHotkeysContext } from "react-hotkeys-hook";

import { useActionItems } from "./useActionItems";
import { useInput } from "./useInput";
import { useNavigatorSearchContext } from "./useNavigatorSearchContext";

const hotkeysSettings = {
  enableOnFormTags: true,
  scopes: ["command-menu"],
};

const hotkeysSettingsNoFocus = {
  enableOnFormTags: true,
  scopes: ["command-menu-no-focus"],
};

const hotkeysSettingsViewAllResults = {
  enableOnFormTags: true,
  scopes: ["command-menu", "command-menu-no-focus"],
};

export const useKeyboardNavigation = ({ query }: { query: string }) => {
  const { toggleScope, disableScope } = useHotkeysContext();
  const navigate = useNavigator();

  const scope = useRef<HTMLDivElement | null>(null);
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

  useHotkeys(
    "up, down, tab",
    event => {
      event.preventDefault();

      if (hasAnyFocus()) return;

      focusFirst();

      const activeFocusedElement = getActiveFocusedElement();

      if (activeFocusedElement) {
        updateAriaActiveDescendant(activeFocusedElement.id);
      }

      disableScope("command-menu-no-focus");
      toggleScope("command-menu");

      return false;
    },
    hotkeysSettingsNoFocus,
  );

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
    hotkeysSettingsViewAllResults,
  );

  useHotkeys(
    "enter",
    event => {
      event.preventDefault();
      takeAction();
      resetInput();

      disableScope("command-menu");
      toggleScope("command-menu-no-focus");
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
