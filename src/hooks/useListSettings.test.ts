import { defaultListSettings, PAGINATE_BY, VOUCHER_CODES_PAGINATE_BY } from "@dashboard/config";
import { ListViews } from "@dashboard/types";
import { renderHook } from "@testing-library/react";

import useListSettings, {
  listSettingsStorageKey,
  voucherCodesPageSizeMigrationKey,
  voucherListColumnsMigrationKey,
} from "./useListSettings";

const key = ListViews.CATEGORY_LIST;
const storedValue = {
  ...defaultListSettings,
  [key]: {
    ...defaultListSettings[key],
    rowNumber: 100,
  },
};
const valueWithoutKey = {
  ...defaultListSettings,
  [key]: undefined,
};
const valueWithoutSettings = {
  ...defaultListSettings,
  [key]: {
    foo: "bar",
  },
};

beforeEach(() => {
  localStorage.clear();
});
describe("useListSettings", () => {
  it("properly inits from value", () => {
    expect(localStorage.getItem(listSettingsStorageKey)).toBe(null);

    const { result } = renderHook(() => useListSettings(key));

    expect(result.current.settings).toStrictEqual(defaultListSettings[key]);
  });
  it("omits init if value is present", () => {
    localStorage.setItem(listSettingsStorageKey, JSON.stringify(storedValue));
    expect(localStorage.getItem(listSettingsStorageKey)).toBe(JSON.stringify(storedValue));

    const { result } = renderHook(() => useListSettings(key));

    expect(result.current.settings).toStrictEqual(storedValue[key]);
  });
  it("properly merges new default values to saved ones", () => {
    localStorage.setItem(listSettingsStorageKey, JSON.stringify(valueWithoutKey));
    expect(localStorage.getItem(listSettingsStorageKey)).toBe(JSON.stringify(valueWithoutKey));

    const { result } = renderHook(() => useListSettings(key));

    expect(result.current.settings).toStrictEqual(defaultListSettings[key]);
  });
  it("properly fills missing settings", () => {
    localStorage.setItem(listSettingsStorageKey, JSON.stringify(valueWithoutSettings));
    expect(localStorage.getItem(listSettingsStorageKey)).toBe(JSON.stringify(valueWithoutSettings));

    const { result } = renderHook(() => useListSettings(key));

    expect(result.current.settings).toStrictEqual({
      ...valueWithoutSettings[key],
      ...defaultListSettings[key],
    });
  });

  it("migrates voucher codes page size from the old shared default once", () => {
    // Arrange
    const storedWithOldVoucherCodesDefault = {
      ...defaultListSettings,
      [ListViews.VOUCHER_CODES]: {
        rowNumber: PAGINATE_BY,
      },
    };

    localStorage.setItem(listSettingsStorageKey, JSON.stringify(storedWithOldVoucherCodesDefault));

    // Act
    const { result } = renderHook(() => useListSettings(ListViews.VOUCHER_CODES));

    // Assert
    expect(result.current.settings.rowNumber).toBe(VOUCHER_CODES_PAGINATE_BY);
    expect(localStorage.getItem(voucherCodesPageSizeMigrationKey)).toBe("1");
  });

  it("does not remigrate an explicit voucher codes page size of 20", () => {
    // Arrange — migration already ran; merchant later chose 20 again.
    localStorage.setItem(voucherCodesPageSizeMigrationKey, "1");
    localStorage.setItem(
      listSettingsStorageKey,
      JSON.stringify({
        ...defaultListSettings,
        [ListViews.VOUCHER_CODES]: {
          rowNumber: PAGINATE_BY,
        },
      }),
    );

    // Act
    const { result } = renderHook(() => useListSettings(ListViews.VOUCHER_CODES));

    // Assert
    expect(result.current.settings.rowNumber).toBe(PAGINATE_BY);
  });

  it("migrates legacy voucher list columns to the status/offer defaults once", () => {
    // Arrange
    localStorage.setItem(
      listSettingsStorageKey,
      JSON.stringify({
        ...defaultListSettings,
        [ListViews.VOUCHER_LIST]: {
          rowNumber: PAGINATE_BY,
          columns: ["code", "min-spent", "start-date", "end-date", "value", "limit"],
        },
      }),
    );

    // Act
    const { result } = renderHook(() => useListSettings(ListViews.VOUCHER_LIST));

    // Assert
    expect(result.current.settings.columns).toEqual(["code", "status", "value", "type", "limit"]);
    expect(localStorage.getItem(voucherListColumnsMigrationKey)).toBe("1");
  });

  it("keeps an existing product list column setup instead of applying new defaults", () => {
    // Arrange
    const storedColumns = [
      "name",
      "availability",
      "description",
      "price",
      "productType",
      "date",
      "created",
    ];

    localStorage.setItem(
      listSettingsStorageKey,
      JSON.stringify({
        ...defaultListSettings,
        [ListViews.PRODUCT_LIST]: {
          rowNumber: PAGINATE_BY,
          columns: storedColumns,
        },
      }),
    );

    // Act
    const { result } = renderHook(() => useListSettings(ListViews.PRODUCT_LIST));

    // Assert
    expect(result.current.settings.columns).toEqual(storedColumns);
  });
});
