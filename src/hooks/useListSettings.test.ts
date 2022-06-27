import { defaultListSettings } from "@saleor/config";
import { ListViews } from "@saleor/types";
import { renderHook } from "@testing-library/react-hooks";

import useListSettings, { listSettingsStorageKey } from "./useListSettings";

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
    expect(localStorage.getItem(listSettingsStorageKey)).toBe(
      JSON.stringify(storedValue),
    );

    const { result } = renderHook(() => useListSettings(key));

    expect(result.current.settings).toStrictEqual(storedValue[key]);
  });

  it("properly merges new default values to saved ones", () => {
    localStorage.setItem(
      listSettingsStorageKey,
      JSON.stringify(valueWithoutKey),
    );
    expect(localStorage.getItem(listSettingsStorageKey)).toBe(
      JSON.stringify(valueWithoutKey),
    );

    const { result } = renderHook(() => useListSettings(key));

    expect(result.current.settings).toStrictEqual(defaultListSettings[key]);
  });

  it("properly fills missing settings", () => {
    localStorage.setItem(
      listSettingsStorageKey,
      JSON.stringify(valueWithoutSettings),
    );
    expect(localStorage.getItem(listSettingsStorageKey)).toBe(
      JSON.stringify(valueWithoutSettings),
    );

    const { result } = renderHook(() => useListSettings(key));

    expect(result.current.settings).toStrictEqual({
      ...valueWithoutSettings[key],
      ...defaultListSettings[key],
    });
  });
});
