import { type SearchProductsQueryVariables } from "@dashboard/graphql";
import { act, renderHook, type RenderHookResult } from "@testing-library/react";

import { productPickerSearch, useVoucherPickerSearches } from "./voucherPickerSearches";

type SearchesHook = RenderHookResult<
  ReturnType<typeof useVoucherPickerSearches>,
  { action: string | undefined }
>;

const searchedProducts: SearchProductsQueryVariables = {
  ...productPickerSearch,
  query: "juice",
  where: { isAvailable: true },
};

const renderSearches = (action: string | undefined): SearchesHook =>
  renderHook(({ action }: { action: string | undefined }) => useVoucherPickerSearches(action), {
    initialProps: { action },
  });

describe("useVoucherPickerSearches", () => {
  it("starts from the search a freshly opened picker sends", () => {
    // Arrange & Act
    const { result } = renderSearches(undefined);

    // Assert
    expect(result.current.productSearchVariables).toEqual({
      after: null,
      first: 100,
      query: "",
      includeVariants: false,
      where: {},
    });
  });

  it("keeps the search while the same picker stays open", () => {
    // Arrange
    const { result, rerender } = renderSearches("assign-product");

    act(() => {
      result.current.setProductSearchVariables(searchedProducts);
    });

    // Act
    rerender({ action: "assign-product" });

    // Assert
    expect(result.current.productSearchVariables).toEqual(searchedProducts);
  });

  it("resets the searches when the picker closes", () => {
    // Arrange
    const { result, rerender } = renderSearches("assign-product");

    act(() => {
      result.current.setProductSearchVariables(searchedProducts);
    });

    // Act
    rerender({ action: undefined });

    // Assert
    expect(result.current.productSearchVariables).toEqual(productPickerSearch);
  });

  it("resets the searches when another picker replaces the open one", () => {
    // Arrange
    const { result, rerender } = renderSearches("assign-product");

    act(() => {
      result.current.setProductSearchVariables(searchedProducts);
    });

    // Act
    rerender({ action: "assign-collection" });

    // Assert
    expect(result.current.productSearchVariables).toEqual(productPickerSearch);
  });

  it("does not reset when a picker opens", () => {
    // Arrange
    const { result, rerender } = renderSearches("remove");

    act(() => {
      result.current.setProductSearchVariables(searchedProducts);
    });

    // Act
    rerender({ action: "assign-product" });

    // Assert
    expect(result.current.productSearchVariables).toEqual(searchedProducts);
  });
});
