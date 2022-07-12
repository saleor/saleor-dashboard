import useLocalStorage from "@saleor/hooks/useLocalStorage";
import merge from "lodash/merge";

import { AppListViewSettings, defaultListSettings } from "./../config";
import { ListSettings, ListViews } from "./../types";

export const listSettingsStorageKey = "listConfig";
export interface UseListSettings<TColumns extends string = string> {
  settings: ListSettings<TColumns>;
  updateListSettings: <T extends keyof ListSettings<TColumns>>(
    key: T,
    value: ListSettings<TColumns>[T],
  ) => void;
}
export default function useListSettings<TColumns extends string = string>(
  listName: ListViews,
): UseListSettings<TColumns> {
  const [settings, setListSettings] = useLocalStorage<AppListViewSettings>(
    listSettingsStorageKey,
    storedListSettings => {
      if (typeof storedListSettings !== "object") {
        return defaultListSettings;
      }

      return merge({}, defaultListSettings, storedListSettings);
    },
  );

  const updateListSettings = <T extends keyof ListSettings>(
    key: T,
    value: ListSettings[T],
  ) =>
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
