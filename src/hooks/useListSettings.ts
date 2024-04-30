// @ts-strict-ignore
import useLocalStorage from "@dashboard/hooks/useLocalStorage";
import mergeWith from "lodash/mergeWith";

import { AppListViewSettings, defaultListSettings } from "./../config";
import { ListSettings, ListViews } from "./../types";

export const listSettingsStorageKey = "listConfig";
export interface UseListSettings<TColumns extends string = string> {
  settings: ListSettings<TColumns>;
  updateListSettings: <T extends keyof ListSettings<TColumns>>(
    key: T,
    value: ListSettings[T],
  ) => void;
}

/**
 * This customizer is used to keep state of the columns field
 * consistent in the list settings. Deep merge is used to update
 * settigns with defaults when they are missing in the LS, but
 * we want to avoid updating columns array to default when
 * they are explicitly set by a user to array which doesn't
 * contain all default values.
 */
const mergeCustomizer = (objValue: unknown, srcValue: unknown) => {
  if (Array.isArray(objValue) && Array.isArray(srcValue)) {
    return srcValue;
  }
};

export default function useListSettings<TColumns extends string = string>(
  listName: ListViews,
): UseListSettings<TColumns> {
  const [settings, setListSettings] = useLocalStorage<AppListViewSettings>(
    listSettingsStorageKey,
    storedListSettings => {
      if (typeof storedListSettings !== "object") {
        return defaultListSettings;
      }

      return mergeWith({}, defaultListSettings, storedListSettings, mergeCustomizer);
    },
  );
  const updateListSettings = <T extends keyof ListSettings>(key: T, value: ListSettings[T]) =>
    setListSettings(settings => ({
      ...settings,
      [listName]: {
        ...settings[listName],
        [key]: value,
      },
    }));

  return {
    settings: settings[listName] as ListSettings<TColumns>,
    updateListSettings,
  };
}
