import { act } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";

import { useListSelectedItems } from "./useListSelectedItems";

describe("useListSelectedItems", () => {
  it("should return empty array when there is no items", () => {
    // Arrange & Act
    const { result } = renderHook(() => useListSelectedItems());

    // Assert
    expect(result.current.selectedItems).toEqual([]);
  });

  it("should return initially provided array", () => {
    // Arrange & Act
    const initialArray = ["test1"];
    const { result } = renderHook(() => useListSelectedItems(initialArray));

    // Assert
    expect(result.current.selectedItems).toEqual(initialArray);
  });

  it("should set selected items", () => {
    // Arrange
    const { result } = renderHook(() => useListSelectedItems(["test1"]));

    // Act
    act(() => {
      result.current.setSelectedItems(["test1", "test2"]);
    });

    // Assert
    expect(result.current.selectedItems).toEqual(["test1", "test2"]);
  });

  it("should add item to array when not exists", () => {
    // Arrange
    const { result } = renderHook(() => useListSelectedItems(["test1"]));

    // Act
    act(() => {
      result.current.toggleSelectItem("test2");
    });

    // Assert
    expect(result.current.selectedItems).toEqual(["test1", "test2"]);
  });

  it("should remove item from array when exists", () => {
    // Arrange
    const { result } = renderHook(() => useListSelectedItems(["test1", "test2"]));

    // Act
    act(() => {
      result.current.toggleSelectItem("test2");
    });

    // Assert
    expect(result.current.selectedItems).toEqual(["test1"]);
  });
});
