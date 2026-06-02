import { SaleorThrobber } from "@dashboard/components/Throbber";
import { useWidgetIframeAutoHeight } from "@dashboard/extensions/hooks/useWidgetIframeAutoHeight";
import { useAppFrameReferences } from "@dashboard/extensions/popup-frame-reference";
import { type AppDetailsUrlQueryParams } from "@dashboard/extensions/urls";
import { useAllFlags } from "@dashboard/featureFlags";
import { useNodeRef } from "@dashboard/hooks/useNodeRef";
import { DashboardEventFactory } from "@saleor/app-sdk/app-bridge";
import clsx from "clsx";
import { useCallback, useEffect } from "react";

import { AppIFrame } from "./AppIFrame";
import { useStyles } from "./styles";
import { useAppActions } from "./useAppActions";
import { useAppDashboardUpdates } from "./useAppDashboardUpdates";
import { useTokenRefresh } from "./useTokenRefresh";
import { useUpdateAppToken } from "./useUpdateAppToken";

interface Props {
  src: string;
  appToken: string;
  appId: string;
  className?: string;
  params?: AppDetailsUrlQueryParams;
  refetch?: () => void;
  dashboardVersion: string;
  coreVersion?: string;
  onError?: () => void;
  target: "POPUP" | "WIDGET" | "APP_PAGE";
  /**
   * Let the iframe height follow the app's reported content height instead of
   * filling its container. Used by detail-page sidebar widgets so they flow
   * naturally one after another. See {@link useWidgetIframeAutoHeight}.
   */
  autoHeight?: boolean;
}

const getOrigin = (url: string) => new URL(url).origin;

export const AppFrame = ({
  src,
  appToken,
  appId,
  className,
  params,
  onError,
  refetch,
  dashboardVersion,
  coreVersion = "",
  target,
  autoHeight = false,
}: Props) => {
  const { ref: frameRef, node: frameEl, setRef: setFrameRef } = useNodeRef<HTMLIFrameElement>();
  const classes = useStyles();
  const appOrigin = getOrigin(src);
  const flags = useAllFlags();
  const { setIframe, clearIframe } = useAppFrameReferences();
  /**
   * React on messages from App
   */
  const { postToExtension, handshakeDone, setHandshakeDone } = useAppActions(
    frameRef.current,
    appOrigin,
    appId,
    appToken,
    {
      core: coreVersion,
      dashboard: dashboardVersion,
    },
  );

  useWidgetIframeAutoHeight(frameEl, autoHeight, { listenForResize: false });

  /**
   * Listen to Dashboard context like theme or locale and inform app about it
   */
  useAppDashboardUpdates(frameRef.current, appOrigin, handshakeDone, appId);
  useTokenRefresh(appToken, refetch);

  const handleLoad = useCallback(() => {
    setIframe(frameRef.current!, true, target);

    postToExtension(
      DashboardEventFactory.createHandshakeEvent(appToken, 1, {
        core: coreVersion,
        dashboard: dashboardVersion,
      }),
    );
    setHandshakeDone(true);
  }, [appToken, postToExtension, setHandshakeDone]);

  useUpdateAppToken({
    postToExtension,
    appToken,
    /**
     * If app is not ready, ignore this flow
     */
    enabled: handshakeDone,
  });

  useEffect(() => {
    return () => {
      if (frameRef.current) {
        clearIframe(frameRef?.current);
      }
    };
  }, []);

  return (
    <>
      {!handshakeDone && (
        <div className={classes.loader}>
          <SaleorThrobber />
        </div>
      )}
      <AppIFrame
        ref={setFrameRef}
        src={src}
        appId={appId}
        featureFlags={flags}
        params={params}
        onLoad={handleLoad}
        onError={onError}
        className={clsx(autoHeight ? classes.iframeWidget : classes.iframe, className, {
          [classes.iframeHidden]: !handshakeDone,
        })}
      />
    </>
  );
};
