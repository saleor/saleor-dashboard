import { renderHook } from "@testing-library/react-hooks";

import { useAllPreviousData } from "./useAllPreviousData";

describe("useAllPreviousData", () => {
  test("should keep all previus data", () => {
    // Arrange
    let initialValue = [1, 2, 3];
    const { result, rerender } = renderHook(() =>
      useAllPreviousData(initialValue),
    );

    // Act
    initialValue = [4, 5, 6];
    rerender();

    initialValue = [7, 8, 9];
    rerender();
    rerender();

    // Assert
    expect(result.current).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
});
