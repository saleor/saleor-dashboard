import { act, renderHook } from "@testing-library/react";

import { CELL_TOOLTIP_SHOW_DELAY_MS, useTooltipContainer } from "./useTooltipContainer";

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
});
