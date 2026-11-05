import { renderHook, type RenderHookResult } from "@testing-library/react";

import { useClearSelectionOnPageChange } from "./useClearSelectionOnPageChange";

const renderClearer = (
  pageStart: number,
  clearSelection: () => void,
): RenderHookResult<void, { start: number; clear: () => void }> =>
  renderHook(
    ({ start, clear }: { start: number; clear: () => void }) =>
      useClearSelectionOnPageChange(start, clear),
    { initialProps: { start: pageStart, clear: clearSelection } },
  );

describe("useClearSelectionOnPageChange", () => {
  it("keeps the selection when the page first renders", () => {
    // Arrange
    const clearSelection = jest.fn();

    // Act
    renderClearer(0, clearSelection);

    // Assert
    expect(clearSelection).not.toHaveBeenCalled();
  });

  it("keeps the selection while the same page stays visible", () => {
    // Arrange
    const clearSelection = jest.fn();
    const { rerender } = renderClearer(10, clearSelection);

    // Act
    rerender({ start: 10, clear: clearSelection });

    // Assert
    expect(clearSelection).not.toHaveBeenCalled();
  });

  it("clears the selection with the latest callback when the visible page changes", () => {
    // Arrange
    const firstClear = jest.fn();
    const latestClear = jest.fn();
    const { rerender } = renderClearer(10, firstClear);

    // Act
    rerender({ start: 0, clear: latestClear });

    // Assert
    expect(firstClear).not.toHaveBeenCalled();
    expect(latestClear).toHaveBeenCalledTimes(1);
  });
});
