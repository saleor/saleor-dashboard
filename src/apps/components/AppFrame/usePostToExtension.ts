import { Events } from "@saleor/app-sdk/app-bridge";
import { useCallback } from "react";

export const usePostToExtension = (iframeElement: HTMLIFrameElement | null, appOrigin: string) => {
  const postToExtension = useCallback(
    (event: Events) => {
      if (iframeElement?.contentWindow) {
        try {
          iframeElement.contentWindow.postMessage(event, appOrigin);
        } catch (e) {
          console.error(e);
        }
      }
    },
    [appOrigin, iframeElement],
  );

  return postToExtension;
};
