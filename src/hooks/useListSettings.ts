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
/** One-shot: migrate voucher list columns from date/min-spent defaults to status/offer/scope. */
export const voucherListColumnsMigrationKey = "listConfig.migrations.voucherListColumnsStatusOffer";
/** One-shot: add the Delivery column for users still on a previous orders-list default. */
export const orderListDeliveryColumnMigrationKey = "listConfig.migrations.orderListDeliveryColumn";

const LEGACY_VOUCHER_LIST_COLUMNS = [
  "code",
  "min-spent",
  "start-date",
  "end-date",
  "value",
  "limit",
];

const LEGACY_ORDER_LIST_COLUMNS = [
  ["number", "date", "customer", "payment", "status", "net", "total", "channel"],
  ["number", "date", "customer", "payment", "delivery", "status", "net", "total", "channel"],
];

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

const columnsMatch = (left: string[] | undefined, right: string[]): boolean =>
  !!left && left.length === right.length && left.every((column, index) => column === right[index]);

const migrateStoredListSettings = (settings: AppListViewSettings): AppListViewSettings => {
  try {
    if (typeof localStorage === "undefined") {
      return settings;
    }

    let nextSettings = settings;

    if (localStorage.getItem(voucherCodesPageSizeMigrationKey) !== "1") {
      const storedRowNumber = nextSettings[ListViews.VOUCHER_CODES]?.rowNumber;

      if (storedRowNumber === PAGINATE_BY) {
        nextSettings = {
          ...nextSettings,
          [ListViews.VOUCHER_CODES]: {
            ...nextSettings[ListViews.VOUCHER_CODES],
            rowNumber: VOUCHER_CODES_PAGINATE_BY,
          },
        };
      }

      localStorage.setItem(voucherCodesPageSizeMigrationKey, "1");
    }

    if (localStorage.getItem(voucherListColumnsMigrationKey) !== "1") {
      const storedColumns = nextSettings[ListViews.VOUCHER_LIST]?.columns;
      const defaultColumns = defaultListSettings[ListViews.VOUCHER_LIST].columns ?? [];

      if (columnsMatch(storedColumns, LEGACY_VOUCHER_LIST_COLUMNS)) {
        nextSettings = {
          ...nextSettings,
          [ListViews.VOUCHER_LIST]: {
            ...nextSettings[ListViews.VOUCHER_LIST],
            columns: defaultColumns,
          },
        };
      }

      localStorage.setItem(voucherListColumnsMigrationKey, "1");
    }

    if (localStorage.getItem(orderListDeliveryColumnMigrationKey) !== "1") {
      const storedColumns = nextSettings[ListViews.ORDER_LIST]?.columns;
      const defaultColumns = defaultListSettings[ListViews.ORDER_LIST].columns ?? [];
      const isLegacyDefault = LEGACY_ORDER_LIST_COLUMNS.some(columns =>
        columnsMatch(storedColumns, columns),
      );

      if (isLegacyDefault) {
        nextSettings = {
          ...nextSettings,
          [ListViews.ORDER_LIST]: {
            ...nextSettings[ListViews.ORDER_LIST],
            columns: defaultColumns,
          },
        };
      }

      localStorage.setItem(orderListDeliveryColumnMigrationKey, "1");
    }

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
        return migrateStoredListSettings(defaultListSettings);
      }

      const merged = mergeWith({}, defaultListSettings, storedListSettings, mergeCustomizer);

      return migrateStoredListSettings(merged);
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
