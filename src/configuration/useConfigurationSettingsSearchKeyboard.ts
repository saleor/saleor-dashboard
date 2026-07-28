import {
  type ResolvedSettingsCatalogEntry,
  useSettingsCatalogSearch,
} from "@dashboard/configuration/settingsCatalog/catalog";
import useNavigator from "@dashboard/hooks/useNavigator";
import { type KeyboardEvent, useCallback, useState } from "react";

interface UseConfigurationSettingsSearchKeyboardResult {
  results: ResolvedSettingsCatalogEntry[];
  activeIndex: number;
  onSearchKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  setActiveIndex: (index: number) => void;
}

/**
 * Arrow Up/Down + Enter while focus stays in the settings search input (combobox pattern).
 */
export const useConfigurationSettingsSearchKeyboard = (
  query: string,
): UseConfigurationSettingsSearchKeyboardResult => {
  const navigate = useNavigator();
  const results = useSettingsCatalogSearch(query);
  const hasQuery = query.trim().length > 0;
  const [activeIndex, setActiveIndex] = useState(0);
  const [indexedQuery, setIndexedQuery] = useState(query);

  if (indexedQuery !== query) {
    setIndexedQuery(query);
    setActiveIndex(0);
  }

  const resolvedActiveIndex =
    !hasQuery || results.length === 0 ? -1 : Math.min(Math.max(activeIndex, 0), results.length - 1);

  const onSearchKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (!hasQuery || results.length === 0) {
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex(current => Math.min(Math.max(current, 0) + 1, results.length - 1));

        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex(current => Math.max(Math.min(current, results.length - 1) - 1, 0));

        return;
      }

      if (event.key === "Enter") {
        const active = results[resolvedActiveIndex];

        if (!active) {
          return;
        }

        event.preventDefault();
        navigate(active.href);
      }
    },
    [hasQuery, navigate, resolvedActiveIndex, results],
  );

  return {
    results,
    activeIndex: resolvedActiveIndex,
    onSearchKeyDown,
    setActiveIndex,
  };
};
