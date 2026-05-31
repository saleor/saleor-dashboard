import { useEffect } from "react";

/**
 * postMessage contract an embedded widget app can use to report its content
 * height so the Dashboard can grow/shrink the iframe instead of using a fixed box.
 *
 * IMPORTANT: This is a Dashboard-side convention only. It has no effect until an
 * embedded app actually posts `{ type: WIDGET_RESIZE_MESSAGE, height }` to its
 * parent window. Until/unless it does, the iframe renders at `defaultHeight`.
 * Keep this contract in sync with @saleor/app-sdk if/when it is formalized there.
 */
export const WIDGET_RESIZE_MESSAGE = "saleor:widget:resize";

/** Height used before (and if) an app reports its own. Prevents collapse to the 150px iframe default. */
export const WIDGET_DEFAULT_HEIGHT = 200;

/** Upper bound so a buggy or hostile app can't blow up the Dashboard layout. */
const WIDGET_MAX_HEIGHT = 5000;

interface WidgetResizeMessage {
  type: typeof WIDGET_RESIZE_MESSAGE;
  height: number;
}

const isWidgetResizeMessage = (data: unknown): data is WidgetResizeMessage => {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const message = data as Partial<WidgetResizeMessage>;

  return (
    message.type === WIDGET_RESIZE_MESSAGE &&
    typeof message.height === "number" &&
    Number.isFinite(message.height) &&
    message.height > 0
  );
};

const clampHeight = (height: number) => Math.min(Math.ceil(height), WIDGET_MAX_HEIGHT);

interface UseWidgetIframeAutoHeightOptions {
  defaultHeight?: number;
}

/**
 * Sidebar/detail widgets live in a scrollable column with no fixed iframe cap.
 * The iframe starts at `defaultHeight` and grows/shrinks as the app reports its
 * document height, so widgets flow naturally one after another.
 */
export const useWidgetIframeAutoHeight = (
  frameEl: HTMLIFrameElement | null,
  enabled: boolean,
  { defaultHeight = WIDGET_DEFAULT_HEIGHT }: UseWidgetIframeAutoHeightOptions = {},
) => {
  useEffect(() => {
    if (!enabled || !frameEl) {
      return;
    }

    frameEl.style.height = `${defaultHeight}px`;

    const handler = (event: MessageEvent) => {
      // Identify the sender by window reference rather than origin: an app keeps
      // its own origin under the allow-same-origin sandbox (and it can differ
      // from the manifest URL in dev), but only this iframe's contentWindow can
      // be the source of its own messages.
      if (event.source !== frameEl.contentWindow || !isWidgetResizeMessage(event.data)) {
        return;
      }

      frameEl.style.height = `${clampHeight(event.data.height)}px`;
    };

    window.addEventListener("message", handler);

    return () => {
      window.removeEventListener("message", handler);
      frameEl.style.height = "";
    };
  }, [enabled, frameEl, defaultHeight]);
};
