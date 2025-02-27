import useLocalStorage from "@dashboard/hooks/useLocalStorage";
import { renderHook } from "@testing-library/react-hooks";
import { useState } from "react";
import { act } from "react-dom/test-utils";

import { useIntervalActionWithState } from "./useIntervalActionWithState";

jest.mock("@dashboard/hooks/useLocalStorage", () => ({
  __esModule: true,
  default: jest.fn(() => {
    const [value, setValue] = useState(0);

    return [value, setValue];
  }),
}));

const TEST_KEY = "test-key";

describe("useIntervalActionWithState", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should execute action immediately if interval has passed", () => {
    // Arrange
    const action = jest.fn();

    // Act
    renderHook(() =>
      useIntervalActionWithState({
        action,
        interval: 1000,
        key: TEST_KEY,
      }),
    );

    // Assert
    expect(action).toHaveBeenCalledTimes(1);
  });

  it("should execute action after interval", () => {
    // Arrange
    const action = jest.fn();

    // Act
    renderHook(() =>
      useIntervalActionWithState({
        action,
        interval: 1000,
        key: TEST_KEY,
      }),
    );

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Assert
    expect(action).toHaveBeenCalledTimes(2); // Once on mount, once after interval
  });

  it("should clear timeout on unmount", () => {
    // Arrange
    const action = jest.fn();

    // Act
    const { unmount } = renderHook(() =>
      useIntervalActionWithState({
        action,
        interval: 1000,
        key: TEST_KEY,
      }),
    );

    unmount();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Assert
    expect(action).toHaveBeenCalledTimes(1); // Only initial call
  });

  it("should handle multiple intervals", () => {
    // Arrange
    const action = jest.fn();

    // Act
    renderHook(() =>
      useIntervalActionWithState({
        action,
        interval: 1000,
        key: TEST_KEY,
      }),
    );

    act(() => {
      jest.advanceTimersByTime(2500);
    });

    // Assert
    expect(action).toHaveBeenCalledTimes(3); // Initial + 2 intervals
  });

  it("should handle component rerenders", () => {
    // Arrange
    const action = jest.fn();

    // Act
    const { rerender } = renderHook(() =>
      useIntervalActionWithState({
        action,
        interval: 1000,
        key: TEST_KEY,
      }),
    );

    rerender();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Assert
    expect(action).toHaveBeenCalledTimes(2);
  });

  it("should calculate correct delay based on last invocation", () => {
    // Arrange
    const action = jest.fn();
    const mockTime = new Date().getTime();

    (useLocalStorage as jest.Mock).mockReturnValue([mockTime - 500, jest.fn()]);

    // Act
    renderHook(() =>
      useIntervalActionWithState({
        action,
        interval: 1000,
        key: TEST_KEY,
      }),
    );

    expect(action).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Assert
    expect(action).toHaveBeenCalledTimes(1);
  });

  it("should skip execution if skip is true", () => {
    // Arrange
    const action = jest.fn();

    // Act
    renderHook(() =>
      useIntervalActionWithState({
        action,
        interval: 1000,
        key: TEST_KEY,
        skip: true,
      }),
    );

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Assert
    expect(action).not.toHaveBeenCalled();
  });
});
