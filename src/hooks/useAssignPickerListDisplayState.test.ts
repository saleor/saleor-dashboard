import { renderHook } from "@testing-library/react";

import { useAssignPickerListDisplayState } from "./useAssignPickerListDisplayState";

describe("useAssignPickerListDisplayState", () => {
  it("shows loading placeholder only while loading with an empty list", () => {
    // Arrange & Act
    const { result } = renderHook(() => useAssignPickerListDisplayState(true, 0));

    // Assert
    expect(result.current.showListLoading).toBe(true);
    expect(result.current.showEmptyState).toBe(false);
  });

  it("shows empty state only when loading finished with no items", () => {
    // Arrange & Act
    const { result } = renderHook(() => useAssignPickerListDisplayState(false, 0));

    // Assert
    expect(result.current.showListLoading).toBe(false);
    expect(result.current.showEmptyState).toBe(true);
  });

  it("shows neither placeholder when items are available", () => {
    // Arrange & Act
    const { result } = renderHook(() => useAssignPickerListDisplayState(false, 2));

    // Assert
    expect(result.current.showListLoading).toBe(false);
    expect(result.current.showEmptyState).toBe(false);
  });
});
