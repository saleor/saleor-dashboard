import { postToExtension } from "@dashboard/extensions/views/ViewManifestExtension/components/AppFrame/usePostToExtension";
import { useLayoutEffect } from "react";

import {
  applyWidgetHeightToFrame,
  createWidgetResizeOkResponse,
  isWidgetResizeAction,
  WIDGET_DEFAULT_HEIGHT,
} from "./widgetIframeResize";

export { WIDGET_DEFAULT_HEIGHT } from "./widgetIframeResize";

interface UseWidgetIframeAutoHeightOptions {
  defaultHeight?: number;
  /**
   * App origin for `postMessage` responses (`dispatch` expects `ok` back).
   * Required when `listenForResize` is true.
   */
  appOrigin?: string;
  /**
   * Listen for `widgetResize` App Bridge actions from the iframe.
   * `false` when {@link useAppActions} handles resize (GET / AppFrame widgets).
   */
  listenForResize?: boolean;
}

/**
 * Sidebar/detail widgets: set a default iframe height and optionally resize when the app
 * dispatches `actions.WidgetResize` (`widgetResize` App Bridge action).
 */
export const useWidgetIframeAutoHeight = (
  frameEl: HTMLIFrameElement | null,
  enabled: boolean,
  {
    defaultHeight = WIDGET_DEFAULT_HEIGHT,
    appOrigin,
    listenForResize = true,
  }: UseWidgetIframeAutoHeightOptions = {},
) => {
  useLayoutEffect(() => {
    if (!enabled || !frameEl) {
      return;
    }

    frameEl.style.height = `${defaultHeight}px`;

    if (!listenForResize) {
      return () => {
        frameEl.style.height = "";
      };
    }

    if (!appOrigin) {
      console.warn(
        "useWidgetIframeAutoHeight: appOrigin is required when listenForResize is enabled",
      );

      return () => {
        frameEl.style.height = "";
      };
    }

    const handler = (event: MessageEvent) => {
      if (event.source !== frameEl.contentWindow || !isWidgetResizeAction(event.data)) {
        return;
      }

      applyWidgetHeightToFrame(frameEl, event.data.payload.height);
      postToExtension(
        createWidgetResizeOkResponse(event.data.payload.actionId),
        frameEl,
        appOrigin,
      );
    };

    window.addEventListener("message", handler);

    return () => {
      window.removeEventListener("message", handler);
      frameEl.style.height = "";
    };
  }, [appOrigin, defaultHeight, enabled, frameEl, listenForResize]);
};
