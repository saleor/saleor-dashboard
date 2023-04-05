import { useAppDashboardUpdates } from "@dashboard/apps/components/AppFrame/useAppDashboardUpdates";
import {
  AppDetailsUrlQueryParams,
  AppUrls,
  prepareFeatureFlagsList,
} from "@dashboard/apps/urls";
import { useAllFlags } from "@dashboard/hooks/useFlags";
import { CircularProgress } from "@material-ui/core";
import { useTheme } from "@saleor/macaw-ui";
import clsx from "clsx";
import React from "react";

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
  onLoad?(): void;
  onError?(): void;
}

const getOrigin = (url: string) => new URL(url).origin;

export const AppFrame: React.FC<Props> = ({
  src,
  appToken,
  appId,
  className,
  params = {},
  onLoad,
  onError,
  refetch,
}) => {
  const frameRef = React.useRef<HTMLIFrameElement | null>(null);
  const { themeType } = useTheme();
  const classes = useStyles();
  const appOrigin = getOrigin(src);
  const flags = useAllFlags();

  /**
   * React on messages from App
   */
  const { postToExtension, handshakeDone, setHandshakeDone } = useAppActions(
    frameRef.current,
    appOrigin,
    appId,
    appToken,
  );

  /**
   * Listen to Dashboard context like theme or locale and inform app about it
   */
  useAppDashboardUpdates(frameRef.current, appOrigin, handshakeDone, appId);

  useTokenRefresh(appToken, refetch);

  const handleLoad = () => {
    /**
     * @deprecated
     *
     * Move handshake to notifyReady, so app is requesting token after it's ready to receive it
     * Currently handshake it 2 times, for compatibility
     */
    postToExtension({
      type: "handshake",
      payload: {
        token: appToken,
        version: 1,
      },
    });

    setHandshakeDone(true);

    if (onLoad) {
      onLoad();
    }
  };

  return (
    <>
      {!handshakeDone && (
        <div className={classes.loader}>
          <CircularProgress color="primary" />
        </div>
      )}
      <iframe
        ref={frameRef}
        src={AppUrls.resolveAppIframeUrl(appId, src, {
          ...params,
          featureFlags: prepareFeatureFlagsList(flags),
          theme: themeType,
        })}
        onError={onError}
        onLoad={handleLoad}
        className={clsx(classes.iframe, className, {
          [classes.iframeHidden]: !handshakeDone,
        })}
        sandbox="allow-same-origin allow-forms allow-scripts"
      />
    </>
  );
};
