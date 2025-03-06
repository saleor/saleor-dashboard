import { DEFAULT_NOTIFICATION_SHOW_TIME } from "@dashboard/config";
import { act, renderHook } from "@testing-library/react-hooks";

import { useMessageState } from "./useMessageState";

describe("useMessageState", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("should initialize with empty notifications", () => {
    // Arrange
    const { result } = renderHook(() => useMessageState());

    // Assert
    expect(result.current.componentState.notifications).toEqual([]);
  });

  test("should add a notification when show is called", () => {
    // Arrange
    const { result } = renderHook(() => useMessageState());

    // Act
    act(() => {
      result.current.context.show({ text: "Test notification" });
    });

    // Assert
    expect(result.current.componentState.notifications).toHaveLength(1);
    expect(result.current.componentState.notifications[0].message.text).toBe("Test notification");
  });

  test("should remove a notification when remove is called", () => {
    // Arrange
    const { result } = renderHook(() => useMessageState());

    // Act
    act(() => {
      result.current.context.show({ text: "Test notification" });
    });

    act(() => {
      result.current.context.remove(result.current.componentState.notifications[0].id);
    });

    // Assert
    expect(result.current.componentState.notifications).toHaveLength(0);
  });

  test("should auto-remove notification after timeout", () => {
    // Arrange
    const { result } = renderHook(() => useMessageState());

    // Act
    act(() => {
      result.current.context.show({ text: "Test notification" }, 1000);
    });

    // Assert
    expect(result.current.componentState.notifications).toHaveLength(1);

    // Act
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Assert
    expect(result.current.componentState.notifications).toHaveLength(0);
  });

  test("should pause and resume timer correctly", () => {
    // Arrange
    const { result } = renderHook(() => useMessageState());

    // Act
    act(() => {
      result.current.context.show({ text: "Test notification" }, 2000);
    });

    act(() => {
      // Advance time partially
      jest.advanceTimersByTime(10);
    });

    // Assert: Notification should still be there
    expect(result.current.componentState.notifications).toHaveLength(1);

    // Act
    act(() => {
      // Pause the timer
      result.current.componentState.pauseTimer(result.current.componentState.notifications[0]);
    });

    act(() => {
      // Advance time beyond original timeout
      jest.advanceTimersByTime(DEFAULT_NOTIFICATION_SHOW_TIME);
    });

    // Assert: Notification should still be there because timer was paused
    expect(result.current.componentState.notifications).toHaveLength(1);

    // Act
    act(() => {
      // Resume the timer
      result.current.componentState.resumeTimer(result.current.componentState.notifications[0]);
    });

    // Act
    act(() => {
      // Advance time to complete the remaining time
      jest.advanceTimersByTime(DEFAULT_NOTIFICATION_SHOW_TIME);
    });

    // Assert: Notification should be removed now
    expect(result.current.componentState.notifications).toHaveLength(0);
  });
});
