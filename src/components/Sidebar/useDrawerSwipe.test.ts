import { act, renderHook } from "@testing-library/react";

import { type SwipePointerEvent, useDrawerSwipe } from "./useDrawerSwipe";

const PANEL_WIDTH = 260;

const createPanel = (): HTMLDivElement => {
  const panel = document.createElement("div");

  Object.defineProperty(panel, "offsetWidth", { value: PANEL_WIDTH });
  panel.setPointerCapture = jest.fn();

  return panel;
};

const pointerAt = (
  panel: HTMLElement,
  { x, y = 100, time }: { x: number; y?: number; time: number },
): SwipePointerEvent => ({
  pointerId: 1,
  pointerType: "touch",
  isPrimary: true,
  clientX: x,
  clientY: y,
  timeStamp: time,
  currentTarget: panel,
});

describe("useDrawerSwipe", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("follows a leftward swipe and slides the drawer away once released past the threshold", () => {
    // Arrange
    const onDismiss = jest.fn();
    const panel = createPanel();
    const { result } = renderHook(() => useDrawerSwipe({ onDismiss }));
    const { onPointerDown, onPointerMove, onPointerUp } = result.current.swipeHandlers;

    // Act
    onPointerDown(pointerAt(panel, { x: 220, time: 0 }));
    onPointerMove(pointerAt(panel, { x: 160, time: 300 }));
    onPointerMove(pointerAt(panel, { x: 100, time: 600 }));

    // Assert
    expect(panel.style.transform).toBe("translateX(-120px)");
    expect(panel.setPointerCapture).toHaveBeenCalledWith(1);

    // Act
    onPointerUp(pointerAt(panel, { x: 100, time: 650 }));
    act(() => jest.runAllTimers());

    // Assert
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("settles back open after a short, slow swipe", () => {
    // Arrange
    const onDismiss = jest.fn();
    const panel = createPanel();
    const { result } = renderHook(() => useDrawerSwipe({ onDismiss }));
    const { onPointerDown, onPointerMove, onPointerUp } = result.current.swipeHandlers;

    // Act
    onPointerDown(pointerAt(panel, { x: 220, time: 0 }));
    onPointerMove(pointerAt(panel, { x: 180, time: 400 }));
    onPointerUp(pointerAt(panel, { x: 180, time: 800 }));
    act(() => jest.runAllTimers());

    // Assert
    expect(onDismiss).not.toHaveBeenCalled();
    expect(panel.style.transform).toBe("");
  });

  it("dismisses on a quick flick even when it is short", () => {
    // Arrange
    const onDismiss = jest.fn();
    const panel = createPanel();
    const { result } = renderHook(() => useDrawerSwipe({ onDismiss }));
    const { onPointerDown, onPointerMove, onPointerUp } = result.current.swipeHandlers;

    // Act
    onPointerDown(pointerAt(panel, { x: 220, time: 0 }));
    onPointerMove(pointerAt(panel, { x: 210, time: 10 }));
    onPointerMove(pointerAt(panel, { x: 180, time: 30 }));
    onPointerUp(pointerAt(panel, { x: 180, time: 40 }));
    act(() => jest.runAllTimers());

    // Assert
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("leaves vertical scrolling alone", () => {
    // Arrange
    const onDismiss = jest.fn();
    const panel = createPanel();
    const { result } = renderHook(() => useDrawerSwipe({ onDismiss }));
    const { onPointerDown, onPointerMove, onPointerUp } = result.current.swipeHandlers;

    // Act
    onPointerDown(pointerAt(panel, { x: 220, y: 300, time: 0 }));
    onPointerMove(pointerAt(panel, { x: 210, y: 200, time: 50 }));
    onPointerMove(pointerAt(panel, { x: 60, y: 190, time: 100 }));
    onPointerUp(pointerAt(panel, { x: 60, y: 190, time: 150 }));
    act(() => jest.runAllTimers());

    // Assert
    expect(onDismiss).not.toHaveBeenCalled();
    expect(panel.style.transform).toBe("");
    expect(panel.setPointerCapture).not.toHaveBeenCalled();
  });

  it("ignores the mouse, which drags to select text", () => {
    // Arrange
    const onDismiss = jest.fn();
    const panel = createPanel();
    const { result } = renderHook(() => useDrawerSwipe({ onDismiss }));
    const { onPointerDown, onPointerMove, onPointerUp } = result.current.swipeHandlers;
    const mouseAt = (x: number, time: number): SwipePointerEvent => ({
      ...pointerAt(panel, { x, time }),
      pointerType: "mouse",
    });

    // Act
    onPointerDown(mouseAt(220, 0));
    onPointerMove(mouseAt(40, 50));
    onPointerUp(mouseAt(40, 60));
    act(() => jest.runAllTimers());

    // Assert
    expect(onDismiss).not.toHaveBeenCalled();
    expect(panel.style.transform).toBe("");
  });
});
