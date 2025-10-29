import { createAppsDebug } from "@dashboard/extensions/views/ViewManifestExtension/utils/apps-debug";
import { Events } from "@saleor/app-sdk/app-bridge";
import { useCallback } from "react";

const debug = createAppsDebug("postToExtension");

export const postToExtension = (
  event: Events,
  iframeElement: HTMLIFrameElement | null,
  appOrigin: string,
) => {
  if (iframeElement?.contentWindow) {
    try {
      debug("Sending %s event to origin %s", event.type, appOrigin);
      iframeElement.contentWindow.postMessage(event, appOrigin);
    } catch (e) {
      console.error(e);
    }
  } else {
    console.warn("Skipping sending event due to missing contentWindow");
  }
};

export const usePostToExtension = (iframeElement: HTMLIFrameElement | null, appOrigin: string) => {
  const postToExtensionMemoized = useCallback(
    (event: Events) => postToExtension(event, iframeElement, appOrigin),
    [appOrigin, iframeElement],
  );

  return postToExtensionMemoized;
};
