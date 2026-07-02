import { renderHook } from "@testing-library/react";

import { useStalePickerList } from "./useStalePickerList";

describe("useStalePickerList", () => {
  it("returns current items when not loading", () => {
    // Arrange
    const { result, rerender } = renderHook(
      ({ items, loading }) => useStalePickerList(items, loading, true),
      {
        initialProps: { items: ["a", "b"], loading: false },
      },
    );

    // Assert
    expect(result.current).toEqual(["a", "b"]);

    // Act
    rerender({ items: ["c"], loading: false });

    // Assert
    expect(result.current).toEqual(["c"]);
  });

  it("keeps previous items while loading with empty incoming data", () => {
    // Arrange
    const { result, rerender } = renderHook(
      ({ items, loading }) => useStalePickerList(items, loading, true),
      {
        initialProps: { items: ["a", "b"], loading: false },
      },
    );

    // Act
    rerender({ items: [], loading: true });

    // Assert
    expect(result.current).toEqual(["a", "b"]);
  });

  it("replaces stale items when loading completes with new results", () => {
    // Arrange
    const { result, rerender } = renderHook(
      ({ items, loading }) => useStalePickerList(items, loading, true),
      {
        initialProps: { items: ["a", "b"], loading: false },
      },
    );

    // Act
    rerender({ items: [], loading: true });
    rerender({ items: ["c"], loading: false });

    // Assert
    expect(result.current).toEqual(["c"]);
  });

  it("clears stale cache when modal closes", () => {
    // Arrange
    const { result, rerender } = renderHook(
      ({ items, loading, open }) => useStalePickerList(items, loading, open),
      {
        initialProps: { items: ["a"], loading: false, open: true },
      },
    );

    // Act
    rerender({ items: [], loading: true, open: true });
    rerender({ items: [], loading: false, open: false });

    // Assert
    expect(result.current).toEqual([]);
  });
});
