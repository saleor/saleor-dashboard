import { act, renderHook } from "@testing-library/react-hooks";

import { FilterValueProvider } from "./FilterValueProvider";
import {
  attributeBottleSizeElement,
  emptyFilterElement,
  staticPriceElement,
} from "./fixtures";
import { useContainerState } from "./useContainerState";

describe("useContainerState", () => {
  const valueProvider: FilterValueProvider = {
    loading: false,
    value: [],
    persist: () => {},
    isPersisted: () => true,
    clear: () => {},
    count: 0,
  };

  it("should set initial value from value provider", () => {
    // Act
    const { result } = renderHook(() => useContainerState(valueProvider));
    // Assert
    expect(result.current.value).toEqual([]);
  });

  it("should create new empty row", () => {
    // Arrange
    const { result } = renderHook(() => useContainerState(valueProvider));
    // Act
    act(() => {
      result.current.createEmpty();
    });
    // Assert
    expect(result.current.value).toEqual([emptyFilterElement]);
  });

  it("should add new row", () => {
    // Arrange
    const { result } = renderHook(() => useContainerState(valueProvider));
    // Act
    act(() => {
      result.current.createEmpty();
    });
    act(() => {
      result.current.create(staticPriceElement);
    });
    // Assert
    expect(result.current.value).toEqual([
      emptyFilterElement,
      "AND",
      staticPriceElement,
    ]);
  });

  it("should update row", () => {
    // Arrange
    const { result } = renderHook(() => useContainerState(valueProvider));
    // Act
    act(() => {
      result.current.create(staticPriceElement);
    });
    act(() => {
      result.current.updateAt("0", el => {
        el.updateLeftOperator({
          type: "category",
          label: "Category",
          slug: "category",
          value: "category",
        });
      });
    });
    // Assert
    expect(result.current.value).toEqual([staticPriceElement]);
  });

  it("should remove row", () => {
    // Arrange
    const { result } = renderHook(() => useContainerState(valueProvider));
    // Act
    act(() => {
      result.current.createEmpty();
    });
    act(() => {
      result.current.create(staticPriceElement);
    });
    act(() => {
      result.current.removeAt("0");
    });
    // Assert
    expect(result.current.value).toEqual([staticPriceElement]);
  });

  it("should clear not filled rows", () => {
    // Arrange
    const { result } = renderHook(() => useContainerState(valueProvider));
    // Act
    act(() => {
      result.current.createEmpty();
    });
    act(() => {
      result.current.create(attributeBottleSizeElement);
    });
    act(() => {
      result.current.clearEmpty();
    });
    // Assert
    expect(result.current.value).toEqual([attributeBottleSizeElement]);
  });
});
