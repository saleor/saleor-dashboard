import { act, renderHook } from "@testing-library/react";

import { useSuppressClickAfterDrag } from "./useSuppressClickAfterDrag";

const dispatchClick = (): MouseEvent => {
  const event = new MouseEvent("click", { bubbles: true, cancelable: true });

  document.body.dispatchEvent(event);

  return event;
};

describe("useSuppressClickAfterDrag", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("prevents the next click after arming", () => {
    // Arrange
    const { result } = renderHook(() => useSuppressClickAfterDrag());

    // Act
    act(() => {
      result.current();
    });

    const event = dispatchClick();

    // Assert
    expect(event.defaultPrevented).toBe(true);
  });

  it("does not prevent a later click after the suppression window", () => {
    // Arrange
    const { result } = renderHook(() => useSuppressClickAfterDrag());

    act(() => {
      result.current();
    });
    act(() => {
      jest.advanceTimersByTime(100);
    });

    // Act
    const event = dispatchClick();

    // Assert
    expect(event.defaultPrevented).toBe(false);
  });

  it("does not prevent clicks when it has not been armed", () => {
    // Arrange
    renderHook(() => useSuppressClickAfterDrag());

    // Act
    const event = dispatchClick();

    // Assert
    expect(event.defaultPrevented).toBe(false);
  });
});
