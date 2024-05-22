import { act, renderHook } from "@testing-library/react-hooks";

import { useOverflowDetection } from "./useOverflowDetection";

describe("useOverflowDetection", () => {
  it("should detect overflow when the element is overflowing", () => {
    // Arrange
    const { result } = renderHook(() => useOverflowDetection<HTMLDivElement>());

    const testElement = document.createElement("div");

    testElement.style.width = "100px";
    testElement.style.overflow = "hidden";

    // Act
    act(() => {
      result.current.elementRef.current = testElement;
    });

    // Mock scrollWidth and clientWidth to simulate overflow
    Object.defineProperty(testElement, "scrollWidth", { value: 150, configurable: true });
    Object.defineProperty(testElement, "clientWidth", { value: 100, configurable: true });

    // Assert
    expect(result.current.isOverflowing()).toBe(true);
  });

  it("should detect no overflow when the element is not overflowing", () => {
    // Arrange
    const { result } = renderHook(() => useOverflowDetection<HTMLDivElement>());

    const testElement = document.createElement("div");

    testElement.style.width = "100px";
    testElement.style.overflow = "hidden";

    // Act
    act(() => {
      result.current.elementRef.current = testElement;
    });

    // Mock scrollWidth and clientWidth to simulate no overflow
    Object.defineProperty(testElement, "scrollWidth", { value: 50 });
    Object.defineProperty(testElement, "clientWidth", { value: 100 });

    // Assert
    expect(result.current.isOverflowing()).toBe(false);
  });

  it("should return undefined when the element ref is not set", () => {
    // Arrange
    const { result } = renderHook(() => useOverflowDetection<HTMLDivElement>());

    // Act & Assert
    expect(result.current.isOverflowing()).toBeUndefined();
  });
});
