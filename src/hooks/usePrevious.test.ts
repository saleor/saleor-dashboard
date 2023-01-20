import { renderHook } from "@testing-library/react-hooks";

import { useAllPrevious, usePrevous } from "./usePrevious";

describe("useAllPrevious", () => {
  test("should keep all previus array data", () => {
    // Arrange
    let initialValue = [1, 2, 3];
    const { result, rerender } = renderHook(() => useAllPrevious(initialValue));

    // Act
    initialValue = [4, 5, 6];
    rerender();

    initialValue = [7, 8, 9];
    rerender();
    rerender();

    // Assert
    expect(result.current).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  test("should keep all previus string data", () => {
    // Arrange
    let initialValue = "start";
    const { result, rerender } = renderHook(() => useAllPrevious(initialValue));

    // Act
    initialValue = "middle";
    rerender();

    initialValue = "end";
    rerender();
    rerender();

    // Assert
    expect(result.current).toEqual(["start", "middle", "end"]);
  });

  test("should keep all previus object data", () => {
    // Arrange
    let initialValue = { name: "Joe" };
    const { result, rerender } = renderHook(() => useAllPrevious(initialValue));

    // Act
    initialValue = { name: "Doe" };
    rerender();

    initialValue = { name: "Jack" };
    rerender();
    rerender();

    // Assert
    expect(result.current).toEqual([
      { name: "Joe" },
      { name: "Doe" },
      { name: "Jack" },
    ]);
  });
});

describe("usePrevious", () => {
  test("should keep previous array value", () => {
    // Arrange
    let initialValue = [1, 2, 3];
    const { result, rerender } = renderHook(() => usePrevous(initialValue));

    // Act
    initialValue = [4, 5, 6];
    rerender();

    // Assert
    expect(result.current).toEqual([1, 2, 3]);

    // Act
    initialValue = [7, 8, 9];
    rerender();

    // Assert
    expect(result.current).toEqual([4, 5, 6]);
  });

  test("should keep previous string value", () => {
    // Arrange
    let initialValue = "start";
    const { result, rerender } = renderHook(() => usePrevous(initialValue));

    // Act
    initialValue = "middle";
    rerender();

    // Assert
    expect(result.current).toEqual("start");

    // Act
    initialValue = "end";
    rerender();

    // Assert
    expect(result.current).toEqual("middle");
  });
});
