import { act, renderHook } from "@testing-library/react";
import { useHotkeys } from "react-hotkeys-hook";

import { CELL_TOOLTIP_SHOW_DELAY_MS, useTooltipContainer } from "./useTooltipContainer";

// react-hotkeys-hook is stubbed globally in testUtils/setup.ts, so key matching itself
// cannot be exercised here — assert the registration and run the callback it was given.
const lastHotkeyCall = () => {
  const { calls } = (useHotkeys as jest.Mock).mock;

  return calls[calls.length - 1];
};

const bounds = { x: 0, y: 0, width: 10, height: 10 };

describe("useTooltipContainer", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("delays the first cell tooltip until the show delay elapses", () => {
    // Arrange
    const { result } = renderHook(() => useTooltipContainer());

    // Act
    act(() => {
      result.current.scheduleTooltip("cell-a", bounds, [0, 0], "left");
    });

    // Assert
    expect(result.current.tooltip).toBeUndefined();

    act(() => {
      jest.advanceTimersByTime(CELL_TOOLTIP_SHOW_DELAY_MS);
    });

    expect(result.current.tooltip?.content).toBe("cell-a");
  });

  it("cancels a pending show when the pointer leaves before the delay", () => {
    // Arrange
    const { result } = renderHook(() => useTooltipContainer());

    // Act
    act(() => {
      result.current.scheduleTooltip("cell-a", bounds, [0, 0], "left");
      result.current.clearTooltip();
      jest.advanceTimersByTime(CELL_TOOLTIP_SHOW_DELAY_MS);
    });

    // Assert
    expect(result.current.tooltip).toBeUndefined();
  });

  it("updates immediately when a tooltip is already open", () => {
    // Arrange
    const { result } = renderHook(() => useTooltipContainer());

    act(() => {
      result.current.scheduleTooltip("cell-a", bounds, [0, 0], "left");
      jest.advanceTimersByTime(CELL_TOOLTIP_SHOW_DELAY_MS);
    });

    // Act
    act(() => {
      result.current.scheduleTooltip("cell-b", bounds, [0, 1], "left");
    });

    // Assert
    expect(result.current.tooltip?.content).toBe("cell-b");
    expect(result.current.tooltip?.location).toEqual([0, 1]);
  });

  it("shows header tooltips immediately via setTooltip", () => {
    // Arrange
    const { result } = renderHook(() => useTooltipContainer());

    // Act
    act(() => {
      result.current.setTooltip("header", bounds, [1, -1]);
    });

    // Assert
    expect(result.current.tooltip?.content).toBe("header");
  });

  it("dismisses an open tooltip on outside pointerdown", () => {
    // Arrange
    const { result } = renderHook(() => useTooltipContainer());

    act(() => {
      result.current.setTooltip("header", bounds, [1, -1]);
    });
    // Effect schedules listener on setTimeout(0) after open — flush that turn.
    act(() => {
      jest.runOnlyPendingTimers();
    });

    // Act
    act(() => {
      window.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    });

    // Assert
    expect(result.current.tooltip).toBeUndefined();
  });

  it("dismisses an open tooltip on Escape", () => {
    // Arrange
    const { result } = renderHook(() => useTooltipContainer());

    act(() => {
      result.current.setTooltip("header", bounds, [1, -1]);
    });

    // Act
    const [keys, onEscape, options] = lastHotkeyCall();

    act(() => {
      onEscape();
    });

    // Assert
    expect(keys).toBe("escape");
    expect(options).toEqual({ enabled: true, enableOnFormTags: true });
    expect(result.current.tooltip).toBeUndefined();
  });

  it("keeps the Escape hotkey disabled while no tooltip is open", () => {
    // Arrange & Act
    renderHook(() => useTooltipContainer());

    // Assert
    const [, , options] = lastHotkeyCall();

    expect(options).toEqual({ enabled: false, enableOnFormTags: true });
  });

  it("does not dismiss on the same turn as opening", () => {
    // Arrange
    const { result } = renderHook(() => useTooltipContainer());

    // Act — pointerdown before the deferred listener attaches
    act(() => {
      result.current.setTooltip("header", bounds, [1, -1]);
      window.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    });

    // Assert
    expect(result.current.tooltip?.content).toBe("header");
  });
});
