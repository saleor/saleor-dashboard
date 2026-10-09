import { AttributeInputTypeEnum, type WarehouseFragment } from "@dashboard/graphql";
import { act, renderHook } from "@testing-library/react";
import { createIntl } from "react-intl";

import { isVariantDatagridSupportedAttribute, useWarehouseAdapter } from "./datagrid";
import { type WarehouseColumnsSearch } from "./useWarehouseColumnsSearch";

describe("isVariantDatagridSupportedAttribute", () => {
  it("should return true for attributes supported by variants datagrid", () => {
    // Arrange
    const supportedInputTypes = [
      AttributeInputTypeEnum.DROPDOWN,
      AttributeInputTypeEnum.PLAIN_TEXT,
      AttributeInputTypeEnum.SWATCH,
    ];

    // Act
    const result = supportedInputTypes.map(isVariantDatagridSupportedAttribute);

    // Assert
    expect(result).toEqual([true, true, true]);
  });

  it("should return false for attributes unsupported by variants datagrid", () => {
    // Arrange
    const unsupportedInputTypes = [AttributeInputTypeEnum.BOOLEAN, null, undefined];

    // Act
    const result = unsupportedInputTypes.map(isVariantDatagridSupportedAttribute);

    // Assert
    expect(result).toEqual([false, false, false]);
  });
});

describe("useWarehouseAdapter", () => {
  const intl = createIntl({ locale: "en", messages: {} });
  const usWarehouse: WarehouseFragment = { __typename: "Warehouse", id: "w-1", name: "US" };
  const euWarehouse: WarehouseFragment = { __typename: "Warehouse", id: "w-2", name: "EU" };
  const makeSearch = (overrides: Partial<WarehouseColumnsSearch> = {}): WarehouseColumnsSearch => ({
    availableWarehouses: [usWarehouse, euWarehouse],
    selectedWarehouses: [euWarehouse],
    hasNextPage: true,
    hasPreviousPage: false,
    onSearch: jest.fn(),
    onNextPage: jest.fn(),
    onPreviousPage: jest.fn(),
    ...overrides,
  });

  it("maps picker results and selected warehouses to columns", () => {
    // Arrange
    const search = makeSearch();

    // Act
    const { result } = renderHook(() => useWarehouseAdapter({ intl, ...search }));

    // Assert
    expect(result.current.prefix).toBe("warehouse");
    expect(result.current.availableNodes?.map(node => node.id)).toEqual([
      "warehouse:w-1",
      "warehouse:w-2",
    ]);
    expect(result.current.selectedNodes).toEqual([
      expect.objectContaining({ id: "warehouse:w-2", title: "EU" }),
    ]);
    expect(result.current.hasNextPage).toBe(true);
    expect(result.current.hasPreviousPage).toBe(false);
    expect(result.current.onNextPage).toBe(search.onNextPage);
    expect(result.current.onPreviousPage).toBe(search.onPreviousPage);
  });

  it("leaves nodes unresolved while the API data is missing", () => {
    // Arrange
    const search = makeSearch({ availableWarehouses: undefined, selectedWarehouses: undefined });

    // Act
    const { result } = renderHook(() => useWarehouseAdapter({ intl, ...search }));

    // Assert
    expect(result.current.availableNodes).toBeUndefined();
    expect(result.current.selectedNodes).toBeUndefined();
  });

  it("forwards searches to the API and remembers the query for the picker", () => {
    // Arrange
    const search = makeSearch();
    const { result } = renderHook(() => useWarehouseAdapter({ intl, ...search }));

    // Act
    act(() => result.current.onSearch("eu"));

    // Assert
    expect(search.onSearch).toHaveBeenCalledWith("eu");
    expect(result.current.initialSearch).toBe("eu");
  });
});
