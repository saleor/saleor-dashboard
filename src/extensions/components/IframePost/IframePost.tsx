import { SaleorThrobber } from "@dashboard/components/Throbber";
import { getAbsoluteApiUrl } from "@dashboard/config";
import {
  useWidgetIframeAutoHeight,
  WIDGET_DEFAULT_HEIGHT,
} from "@dashboard/extensions/hooks/useWidgetIframeAutoHeight";
import { type AppDetailsUrlMountQueryParams } from "@dashboard/extensions/urls";
import { useNodeRef } from "@dashboard/hooks/useNodeRef";
import { Box, Skeleton } from "@saleor/macaw-ui-next";
import { type CSSProperties, useEffect, useRef } from "react";

const hiddenStyle: CSSProperties = { visibility: "hidden" };

interface IframePostProps {
  extensionId: string;
  extensionUrl: string;
  appId: string;
  accessToken: string;
  params?: AppDetailsUrlMountQueryParams;
  height?: number | string;
  /**
   * Grow/shrink the iframe when the embedded app posts `saleor:widget:resize`.
   * POST iframes do not run the App Bridge handshake; apps must call
   * `reportWidgetHeight()` from `@saleor/app-sdk/app-bridge` directly (or use
   * `useWidgetAutoResize` only on GET/AppFrame mounts where the bridge is ready).
   */
  autoHeight?: boolean;
  loaderType?: "skeleton" | "throbber";
}

/**
 * Renders a hidden form which auto-submits on mount with POST so the iframe
 * receives credentials in the body instead of the URL.
 */
export const IframePost = ({
  extensionId,
  extensionUrl,
  appId,
  accessToken,
  params,
  height = WIDGET_DEFAULT_HEIGHT,
  autoHeight = false,
  loaderType = "skeleton",
}: IframePostProps) => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const loadingRef = useRef<HTMLDivElement | null>(null);
  const { ref: iframeRef, node: iframeEl, setRef: setIframeRef } = useNodeRef<HTMLIFrameElement>();

  useWidgetIframeAutoHeight(iframeEl, autoHeight);

  useEffect(() => {
    if (formRef.current) {
      formRef.current.submit();
    }

    const iframe = iframeRef.current;
    const loading = loadingRef.current;

    if (!iframe || !loading) {
      return;
    }

    const onload = () => {
      loading.style.display = "none";
      iframe.style.visibility = "visible";
    };

    iframe.addEventListener("load", onload);

    return () => {
      iframe.removeEventListener("load", onload);
    };
  }, [iframeRef]);

  const boxHeight = autoHeight ? undefined : height;
  const loaderHeight = autoHeight ? WIDGET_DEFAULT_HEIGHT : height;

  return (
    <Box width="100%" __height={boxHeight}>
      <form ref={formRef} action={extensionUrl} method="POST" target={`ext-frame-${extensionId}`}>
        <input type="hidden" name="saleorApiUrl" value={getAbsoluteApiUrl()} />
        <input type="hidden" name="accessToken" value={accessToken} />
        <input type="hidden" name="appId" value={appId} />
        {params &&
          Object.entries(params).map(([key, value]) => (
            <input type="hidden" key={key} name={key} value={value} />
          ))}
      </form>
      <Box
        ref={loadingRef}
        width="100%"
        __height={loaderHeight}
        display={loaderType === "throbber" ? "flex" : "block"}
        alignItems={loaderType === "throbber" ? "center" : undefined}
        justifyContent={loaderType === "throbber" ? "center" : undefined}
      >
        {loaderType === "throbber" ? <SaleorThrobber /> : <Skeleton __height={loaderHeight} />}
      </Box>
      <Box
        style={hiddenStyle}
        ref={setIframeRef}
        as="iframe"
        borderWidth={0}
        __height={boxHeight}
        sandbox="allow-same-origin allow-forms allow-scripts allow-downloads allow-popups"
        name={`ext-frame-${extensionId}`}
        width="100%"
      />
    </Box>
  );
};
