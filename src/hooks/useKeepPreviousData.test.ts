import { renderHook } from "@testing-library/react-hooks";

import { useKeepPreviousData } from "./useKeepPreviousData";

describe("useKeepPreviousData", () => {
  test("should keep previuse data", () => {
    // Arrange
    let initialValue = [1, 2, 3];
    const { result, rerender } = renderHook(() =>
      useKeepPreviousData(initialValue),
    );

    // Act
    initialValue = [4, 5, 6];
    rerender();
    rerender();

    // Assert
    expect(result.current).toEqual([1, 2, 3, 4, 5, 6]);
  });
});
