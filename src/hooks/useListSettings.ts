// @ts-strict-ignore
import useLocalStorage from "@dashboard/hooks/useLocalStorage";
import mergeWith from "lodash/mergeWith";

import {
  type AppListViewSettings,
  defaultListSettings,
  PAGINATE_BY,
  VOUCHER_CODES_PAGINATE_BY,
} from "./../config";
import { type ListSettings, ListViews } from "./../types";

export const listSettingsStorageKey = "listConfig";
/** One-shot: migrate voucher codes page size from the old shared default (20) to 10. */
export const voucherCodesPageSizeMigrationKey = "listConfig.migrations.voucherCodesDefault10";

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

const migrateVoucherCodesDefaultPageSize = (settings: AppListViewSettings): AppListViewSettings => {
  try {
    if (typeof localStorage === "undefined") {
      return settings;
    }

    if (localStorage.getItem(voucherCodesPageSizeMigrationKey) === "1") {
      return settings;
    }

    const storedRowNumber = settings[ListViews.VOUCHER_CODES]?.rowNumber;
    const nextSettings =
      storedRowNumber === PAGINATE_BY
        ? {
            ...settings,
            [ListViews.VOUCHER_CODES]: {
              ...settings[ListViews.VOUCHER_CODES],
              rowNumber: VOUCHER_CODES_PAGINATE_BY,
            },
          }
        : settings;

    localStorage.setItem(voucherCodesPageSizeMigrationKey, "1");

    return nextSettings;
  } catch {
    return settings;
  }
};

export default function useListSettings<TColumns extends string = string>(
  listName: ListViews,
): UseListSettings<TColumns> {
  const [settings, setListSettings] = useLocalStorage<AppListViewSettings>(
    listSettingsStorageKey,
    storedListSettings => {
      // `typeof null === "object"` — treat null/non-objects as a fresh install.
      if (!storedListSettings || typeof storedListSettings !== "object") {
        return migrateVoucherCodesDefaultPageSize(defaultListSettings);
      }

      const merged = mergeWith({}, defaultListSettings, storedListSettings, mergeCustomizer);

      return migrateVoucherCodesDefaultPageSize(merged);
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
