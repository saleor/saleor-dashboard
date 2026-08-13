import { act, renderHook } from "@testing-library/react";

import { useOptimisticListReorder } from "./useOptimisticListReorder";

describe("useOptimisticListReorder", () => {
  const items = [{ id: "a" }, { id: "b" }, { id: "c" }];

  it("reorders locally on drop and notifies the parent", () => {
    // Arrange
    const onReorder = jest.fn();
    const { result } = renderHook(() => useOptimisticListReorder(items, onReorder));

    // Act
    act(() => {
      result.current.onSortEnd({ oldIndex: 0, newIndex: 2 });
    });

    // Assert
    expect(result.current.items.map(item => item.id)).toEqual(["b", "c", "a"]);
    expect(onReorder).toHaveBeenCalledWith({ oldIndex: 0, newIndex: 2 });
  });

  it("replaces the local list when membership changes", () => {
    // Arrange
    const onReorder = jest.fn();
    const { result, rerender } = renderHook(
      ({ nextItems }) => useOptimisticListReorder(nextItems, onReorder),
      { initialProps: { nextItems: items } },
    );

    // Act
    rerender({ nextItems: [{ id: "a" }, { id: "b" }, { id: "d" }] });

    // Assert
    expect(result.current.items.map(item => item.id)).toEqual(["a", "b", "d"]);
  });
});
