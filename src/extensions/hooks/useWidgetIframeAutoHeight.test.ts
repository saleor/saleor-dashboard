import { postToExtension } from "@dashboard/extensions/views/ViewManifestExtension/components/AppFrame/usePostToExtension";
import { act, renderHook } from "@testing-library/react";

import { useWidgetIframeAutoHeight, WIDGET_DEFAULT_HEIGHT } from "./useWidgetIframeAutoHeight";

jest.mock(
  "@dashboard/extensions/views/ViewManifestExtension/components/AppFrame/usePostToExtension",
  () => ({
    postToExtension: jest.fn(),
  }),
);

const mockPostToExtension = postToExtension as jest.MockedFunction<typeof postToExtension>;

const dispatchMessage = (data: unknown, source: Window | null) => {
  const event = new MessageEvent("message", { data });

  Object.defineProperty(event, "source", { value: source, configurable: true });

  act(() => {
    window.dispatchEvent(event);
  });
};

const widgetResizeAction = (height: number, actionId = "resize-action-id") => ({
  type: "widgetResize" as const,
  payload: { height, actionId },
});

describe("useWidgetIframeAutoHeight", () => {
  const appOrigin = "https://app.example.com";
  let iframe: HTMLIFrameElement;

  beforeEach(() => {
    iframe = document.createElement("iframe");
    document.body.appendChild(iframe);
    mockPostToExtension.mockClear();
  });

  afterEach(() => {
    iframe.remove();
  });

  it("applies the default height when enabled", () => {
    renderHook(() => useWidgetIframeAutoHeight(iframe, true, { appOrigin }));

    expect(iframe.style.height).toBe(`${WIDGET_DEFAULT_HEIGHT}px`);
  });

  it("does not touch height when disabled", () => {
    renderHook(() => useWidgetIframeAutoHeight(iframe, false, { appOrigin }));

    expect(iframe.style.height).toBe("");
  });

  it("updates height from a widgetResize action sent by the iframe window", () => {
    renderHook(() => useWidgetIframeAutoHeight(iframe, true, { appOrigin }));

    dispatchMessage(widgetResizeAction(321.4), iframe.contentWindow);

    expect(iframe.style.height).toBe("322px");
    expect(mockPostToExtension).toHaveBeenCalledWith(
      {
        type: "response",
        payload: { actionId: "resize-action-id", ok: true },
      },
      iframe,
      appOrigin,
    );
  });

  it("clamps absurdly large heights", () => {
    renderHook(() => useWidgetIframeAutoHeight(iframe, true, { appOrigin }));

    dispatchMessage(widgetResizeAction(10_000_000), iframe.contentWindow);

    expect(iframe.style.height).toBe("5000px");
  });

  it("ignores messages coming from a different window", () => {
    renderHook(() => useWidgetIframeAutoHeight(iframe, true, { appOrigin }));

    dispatchMessage(widgetResizeAction(999), window);

    expect(iframe.style.height).toBe(`${WIDGET_DEFAULT_HEIGHT}px`);
    expect(mockPostToExtension).not.toHaveBeenCalled();
  });

  it("ignores malformed or non-positive heights", () => {
    renderHook(() => useWidgetIframeAutoHeight(iframe, true, { appOrigin }));

    dispatchMessage(widgetResizeAction(0), iframe.contentWindow);
    dispatchMessage(
      { type: "widgetResize", payload: { height: "tall", actionId: "x" } },
      iframe.contentWindow,
    );
    dispatchMessage(
      { type: "something:else", payload: { height: 500, actionId: "x" } },
      iframe.contentWindow,
    );

    expect(iframe.style.height).toBe(`${WIDGET_DEFAULT_HEIGHT}px`);
    expect(mockPostToExtension).not.toHaveBeenCalled();
  });

  it("does not listen when listenForResize is false", () => {
    renderHook(() =>
      useWidgetIframeAutoHeight(iframe, true, { appOrigin, listenForResize: false }),
    );

    dispatchMessage(widgetResizeAction(400), iframe.contentWindow);

    expect(iframe.style.height).toBe(`${WIDGET_DEFAULT_HEIGHT}px`);
    expect(mockPostToExtension).not.toHaveBeenCalled();
  });

  it("resets the inline height on unmount", () => {
    const { unmount } = renderHook(() => useWidgetIframeAutoHeight(iframe, true, { appOrigin }));

    expect(iframe.style.height).toBe(`${WIDGET_DEFAULT_HEIGHT}px`);

    unmount();

    expect(iframe.style.height).toBe("");
  });
});
