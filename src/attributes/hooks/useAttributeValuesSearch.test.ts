import { act, renderHook } from "@testing-library/react-hooks";

import { useAttributeValuesSearch } from "./useAttributeValuesSearch";

describe("useAttributeValuesSearch", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should return empty search query initially", () => {
    // Arrange
    const onResetPagination = jest.fn();

    // Act
    const { result } = renderHook(() => useAttributeValuesSearch({ onResetPagination }));

    // Assert
    expect(result.current.searchQuery).toBe("");
    expect(result.current.debouncedSearchQuery).toBe("");
  });

  it("should update searchQuery immediately on change", () => {
    // Arrange
    const onResetPagination = jest.fn();
    const { result } = renderHook(() => useAttributeValuesSearch({ onResetPagination }));

    // Act
    act(() => {
      result.current.handleSearchChange("test");
    });

    // Assert
    expect(result.current.searchQuery).toBe("test");
    expect(result.current.debouncedSearchQuery).toBe(""); // not yet debounced
  });

  it("should update debouncedSearchQuery after debounce delay", () => {
    // Arrange
    const onResetPagination = jest.fn();
    const { result } = renderHook(() => useAttributeValuesSearch({ onResetPagination }));

    // Act
    act(() => {
      result.current.handleSearchChange("test");
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Assert
    expect(result.current.debouncedSearchQuery).toBe("test");
  });

  it("should call onResetPagination when debouncedSearchQuery changes", () => {
    // Arrange
    const onResetPagination = jest.fn();
    const { result } = renderHook(() => useAttributeValuesSearch({ onResetPagination }));

    // Act
    act(() => {
      result.current.handleSearchChange("test");
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Assert
    expect(onResetPagination).toHaveBeenCalledTimes(1);
  });

  it("should NOT call onResetPagination on initial mount", () => {
    // Arrange
    const onResetPagination = jest.fn();

    // Act
    renderHook(() => useAttributeValuesSearch({ onResetPagination }));

    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Assert
    expect(onResetPagination).not.toHaveBeenCalled();
  });

  it("should debounce rapid changes and only trigger once", () => {
    // Arrange
    const onResetPagination = jest.fn();
    const { result } = renderHook(() => useAttributeValuesSearch({ onResetPagination }));

    // Act - rapid typing
    act(() => {
      result.current.handleSearchChange("t");
    });
    act(() => {
      jest.advanceTimersByTime(100);
    });
    act(() => {
      result.current.handleSearchChange("te");
    });
    act(() => {
      jest.advanceTimersByTime(100);
    });
    act(() => {
      result.current.handleSearchChange("test");
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Assert - should only have final value, pagination reset once
    expect(result.current.searchQuery).toBe("test");
    expect(result.current.debouncedSearchQuery).toBe("test");
    expect(onResetPagination).toHaveBeenCalledTimes(1);
  });
});
