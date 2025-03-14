import { VoucherCreatePageTab } from "@dashboard/discounts/components/VoucherCreatePage/types";
import {
  CategoryWithTotalProductsFragment,
  CollectionWithTotalProductsFragment,
  CountryWithCodeFragment,
  SearchProductFragment,
} from "@dashboard/graphql";
import { act } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";

import { SpecificItemsData, useSpecificItemsAssign } from "./useSpecificItemsAssign";

describe("VoucherCreatePage / hooks / useSpecificItemsAssign", () => {
  const onChange = jest.fn();
  const data = {
    categories: [
      { id: "1", name: "category 1" },
      { id: "2", name: "category 2" },
      { id: "3", name: "category 3" },
    ],
    collections: [
      { id: "1", name: "collection 1" },
      { id: "2", name: "collection 2" },
      { id: "3", name: "collection 3" },
    ],
    products: [
      { id: "1", name: "product 1" },
      { id: "2", name: "product 2" },
      { id: "3", name: "product 3" },
    ],
    countries: [
      { code: "DE", name: "Germany" },
      { code: "USA", name: "USA" },
    ],
  } as unknown as SpecificItemsData;
  const countries = [
    { code: "PL", name: "Poland" },
    { code: "DE", name: "Germany" },
    { code: "FR", name: "France" },
    { code: "USA", name: "USA" },
  ] as unknown as CountryWithCodeFragment[];

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should handle item assign", async () => {
    // Arrange
    const { result } = renderHook(() => useSpecificItemsAssign({ data, onChange, countries }));

    // Act
    await act(async () => {
      result.current.assignItem(
        [{ id: "4", name: "category 4" }] as CategoryWithTotalProductsFragment[],
        VoucherCreatePageTab.categories,
      );
    });

    // Assert
    expect(onChange).toHaveBeenCalledWith({
      target: {
        name: "categories",
        value: [
          { id: "1", name: "category 1" },
          { id: "2", name: "category 2" },
          { id: "3", name: "category 3" },
          { id: "4", name: "category 4" },
        ],
      },
    });

    onChange.mockRestore();

    // Act
    await act(async () => {
      result.current.assignItem(
        [{ id: "4", name: "collection 4" }] as CollectionWithTotalProductsFragment[],
        VoucherCreatePageTab.collections,
      );
    });

    // Assert
    expect(onChange).toHaveBeenCalledWith({
      target: {
        name: "collections",
        value: [
          { id: "1", name: "collection 1" },
          { id: "2", name: "collection 2" },
          { id: "3", name: "collection 3" },
          { id: "4", name: "collection 4" },
        ],
      },
    });

    onChange.mockRestore();

    // Act
    await act(async () => {
      result.current.assignItem(
        [
          {
            id: "4",
            name: "product 4",
          },
        ] as SearchProductFragment[],
        VoucherCreatePageTab.products,
      );
    });

    // Assert
    expect(onChange).toHaveBeenCalledWith({
      target: {
        name: "products",
        value: [
          { id: "1", name: "product 1" },
          { id: "2", name: "product 2" },
          { id: "3", name: "product 3" },
          { id: "4", name: "product 4" },
        ],
      },
    });

    onChange.mockRestore();

    // Act
    await act(async () => {
      result.current.assignItem(["PL", "FR"], "countries");
    });

    // Assert
    expect(onChange).toHaveBeenCalledWith({
      target: {
        name: "countries",
        value: [
          { code: "DE", name: "Germany" },
          { code: "USA", name: "USA" },
          { code: "PL", name: "Poland" },
          { code: "FR", name: "France" },
        ],
      },
    });
  });

  it("should handle item unassign", async () => {
    // Arrange
    const { result } = renderHook(() => useSpecificItemsAssign({ data, onChange, countries }));

    // Act
    await act(async () => {
      result.current.unassignItem("2", VoucherCreatePageTab.categories);
    });

    // Assert
    expect(onChange).toHaveBeenCalledWith({
      target: {
        name: "categories",
        value: [
          { id: "1", name: "category 1" },
          { id: "3", name: "category 3" },
        ],
      },
    });

    onChange.mockRestore();

    // Act
    await act(async () => {
      result.current.unassignItem("2", VoucherCreatePageTab.collections);
    });

    // Assert
    expect(onChange).toHaveBeenCalledWith({
      target: {
        name: "collections",
        value: [
          { id: "1", name: "collection 1" },
          { id: "3", name: "collection 3" },
        ],
      },
    });

    onChange.mockRestore();

    // Act
    await act(async () => {
      result.current.unassignItem("2", VoucherCreatePageTab.products);
    });

    // Assert
    expect(onChange).toHaveBeenCalledWith({
      target: {
        name: "products",
        value: [
          { id: "1", name: "product 1" },
          { id: "3", name: "product 3" },
        ],
      },
    });

    onChange.mockRestore();

    // Act
    await act(async () => {
      result.current.unassignItem("DE", "countries");
    });

    // Assert
    expect(onChange).toHaveBeenCalledWith({
      target: {
        name: "countries",
        value: [{ code: "USA", name: "USA" }],
      },
    });
  });

  it("should handle bulk item unassign", async () => {
    // Arrange
    const { result } = renderHook(() => useSpecificItemsAssign({ data, onChange, countries }));

    // Act
    await act(async () => {
      result.current.bulkUnassign(VoucherCreatePageTab.categories, ["2", "3"]);
    });

    // Assert
    expect(onChange).toHaveBeenCalledWith({
      target: {
        name: "categories",
        value: [{ id: "1", name: "category 1" }],
      },
    });

    onChange.mockRestore();

    // Act
    await act(async () => {
      result.current.bulkUnassign(VoucherCreatePageTab.collections, ["2", "3"]);
    });

    // Assert
    expect(onChange).toHaveBeenCalledWith({
      target: {
        name: "collections",
        value: [{ id: "1", name: "collection 1" }],
      },
    });

    onChange.mockRestore();

    // Act
    await act(async () => {
      result.current.bulkUnassign(VoucherCreatePageTab.products, ["2", "3"]);
    });

    // Assert
    expect(onChange).toHaveBeenCalledWith({
      target: {
        name: "products",
        value: [{ id: "1", name: "product 1" }],
      },
    });

    onChange.mockRestore();

    // Act
    await act(async () => {
      result.current.bulkUnassign("countries", ["DE", "FR"]);
    });

    // Assert
    expect(onChange).toHaveBeenCalledWith({
      target: {
        name: "countries",
        value: [{ code: "USA", name: "USA" }],
      },
    });
  });
});
