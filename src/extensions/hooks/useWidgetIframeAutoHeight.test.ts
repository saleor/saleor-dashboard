import { act, renderHook } from "@testing-library/react";

import {
  useWidgetIframeAutoHeight,
  WIDGET_DEFAULT_HEIGHT,
  WIDGET_RESIZE_MESSAGE,
} from "./useWidgetIframeAutoHeight";

const dispatchMessage = (data: unknown, source: Window | null) => {
  const event = new MessageEvent("message", { data });

  // jsdom does not populate `source` from the init dict, so set it explicitly.
  Object.defineProperty(event, "source", { value: source, configurable: true });

  act(() => {
    window.dispatchEvent(event);
  });
};

describe("useWidgetIframeAutoHeight", () => {
  let iframe: HTMLIFrameElement;

  beforeEach(() => {
    iframe = document.createElement("iframe");
    document.body.appendChild(iframe);
  });

  afterEach(() => {
    iframe.remove();
  });

  it("applies the default height when enabled", () => {
    // Arrange & Act
    renderHook(() => useWidgetIframeAutoHeight(iframe, true));

    // Assert
    expect(iframe.style.height).toBe(`${WIDGET_DEFAULT_HEIGHT}px`);
  });

  it("does not touch height when disabled", () => {
    // Arrange & Act
    renderHook(() => useWidgetIframeAutoHeight(iframe, false));

    // Assert
    expect(iframe.style.height).toBe("");
  });

  it("updates height from a valid message sent by the iframe window", () => {
    // Arrange
    renderHook(() => useWidgetIframeAutoHeight(iframe, true));

    // Act
    dispatchMessage({ type: WIDGET_RESIZE_MESSAGE, height: 321.4 }, iframe.contentWindow);

    // Assert - rounded up
    expect(iframe.style.height).toBe("322px");
  });

  it("clamps absurdly large heights", () => {
    // Arrange
    renderHook(() => useWidgetIframeAutoHeight(iframe, true));

    // Act
    dispatchMessage({ type: WIDGET_RESIZE_MESSAGE, height: 10_000_000 }, iframe.contentWindow);

    // Assert
    expect(iframe.style.height).toBe("5000px");
  });

  it("ignores messages coming from a different window", () => {
    // Arrange
    renderHook(() => useWidgetIframeAutoHeight(iframe, true));

    // Act - source is the parent window, not the iframe
    dispatchMessage({ type: WIDGET_RESIZE_MESSAGE, height: 999 }, window);

    // Assert - stays at default
    expect(iframe.style.height).toBe(`${WIDGET_DEFAULT_HEIGHT}px`);
  });

  it("ignores malformed or non-positive heights", () => {
    // Arrange
    renderHook(() => useWidgetIframeAutoHeight(iframe, true));

    // Act
    dispatchMessage({ type: WIDGET_RESIZE_MESSAGE, height: 0 }, iframe.contentWindow);
    dispatchMessage({ type: WIDGET_RESIZE_MESSAGE, height: "tall" }, iframe.contentWindow);
    dispatchMessage({ type: "something:else", height: 500 }, iframe.contentWindow);

    // Assert - untouched default
    expect(iframe.style.height).toBe(`${WIDGET_DEFAULT_HEIGHT}px`);
  });

  it("resets the inline height on unmount", () => {
    // Arrange
    const { unmount } = renderHook(() => useWidgetIframeAutoHeight(iframe, true));

    expect(iframe.style.height).toBe(`${WIDGET_DEFAULT_HEIGHT}px`);

    // Act
    unmount();

    // Assert
    expect(iframe.style.height).toBe("");
  });
});
