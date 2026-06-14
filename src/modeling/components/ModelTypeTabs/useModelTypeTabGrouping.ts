import useLocalStorage from "@dashboard/hooks/useLocalStorage";
import { useMemo } from "react";

import {
  DEFAULT_MODEL_TYPE_TAB_SEPARATOR,
  type GroupModelTypeTabsOptions,
} from "./groupModelTypeTabs";

export const MODEL_TYPE_TAB_SEPARATOR_STORAGE_KEY = "modelTypeTabs.separator";
export const MODEL_TYPE_TAB_GROUPING_STORAGE_KEY = "modelTypeTabs.grouping";

export const useModelTypeTabGrouping = () => {
  const [separator, setSeparator] = useLocalStorage<string>(
    MODEL_TYPE_TAB_SEPARATOR_STORAGE_KEY,
    DEFAULT_MODEL_TYPE_TAB_SEPARATOR,
  );
  const [groupingEnabled, setGroupingEnabled] = useLocalStorage<boolean>(
    MODEL_TYPE_TAB_GROUPING_STORAGE_KEY,
    true,
  );

  const groupingOptions: GroupModelTypeTabsOptions = useMemo(
    () => ({
      separator,
      enabled: groupingEnabled,
    }),
    [groupingEnabled, separator],
  );

  return {
    separator,
    setSeparator,
    groupingEnabled,
    setGroupingEnabled,
    groupingOptions,
  };
};

export type ModelTypeTabGrouping = ReturnType<typeof useModelTypeTabGrouping>;
