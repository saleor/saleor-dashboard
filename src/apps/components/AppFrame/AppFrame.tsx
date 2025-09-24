import { useAppDashboardUpdates } from "@dashboard/apps/components/AppFrame/useAppDashboardUpdates";
import { useUpdateAppToken } from "@dashboard/apps/components/AppFrame/useUpdateAppToken";
import { AppDetailsUrlQueryParams } from "@dashboard/apps/urls";
import { translateProductFormStateAtom } from "@dashboard/extensions/form-context-state";
import { useAllFlags } from "@dashboard/featureFlags";
import { CircularProgress } from "@material-ui/core";
import { DashboardEventFactory } from "@saleor/app-sdk/app-bridge";
import clsx from "clsx";
import { useAtom } from "jotai";
import { PropsWithChildren, useCallback, useEffect, useRef } from "react";

import { AppIFrame } from "./AppIFrame";
import { useStyles } from "./styles";
import { useAppActions } from "./useAppActions";
import useTokenRefresh from "./useTokenRefresh";

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
}

const getOrigin = (url: string) => new URL(url).origin;

/** @deprecated Use component from extensions/ */
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
}: PropsWithChildren<Props>) => {
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const classes = useStyles();
  const appOrigin = getOrigin(src);
  const flags = useAllFlags();

  const [formState] = useAtom(translateProductFormStateAtom);

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

  useEffect(() => {
    if (formState && handshakeDone) {
      console.log("pushing to extension");
      postToExtension(DashboardEventFactory.createFormDataEvent(formState.formId, formState));
    }
  }, [formState, postToExtension, handshakeDone]);

  /**
   * Listen to Dashboard context like theme or locale and inform app about it
   */
  useAppDashboardUpdates(frameRef.current, appOrigin, handshakeDone, appId);
  useTokenRefresh(appToken, refetch);

  const handleLoad = useCallback(() => {
    /**
     * @deprecated
     *
     * Move handshake to notifyReady, so app is requesting token after it's ready to receive it
     * Currently handshake it 2 times, for compatibility
     */
    postToExtension(
      DashboardEventFactory.createHandshakeEvent(appToken, 1, {
        core: coreVersion,
        dashboard: dashboardVersion,
      }),
    );
    console.log("Handshake done");
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

  return (
    <>
      {!handshakeDone && (
        <div className={classes.loader}>
          <CircularProgress color="primary" />
        </div>
      )}
      <AppIFrame
        ref={frameRef}
        src={src}
        appId={appId}
        featureFlags={flags}
        params={params}
        onLoad={handleLoad}
        onError={onError}
        className={clsx(classes.iframe, className, {
          [classes.iframeHidden]: !handshakeDone,
        })}
      />
    </>
  );
};
