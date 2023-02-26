import {
  AppDetailsUrlQueryParams,
  getAppDeepPathFromDashboardUrl,
  prepareFeatureFlagsList,
  resolveAppIframeUrl,
} from "@dashboard/apps/urls";
import { useAllFlags } from "@dashboard/hooks/useFlags";
import useLocale from "@dashboard/hooks/useLocale";
import { useTheme } from "@saleor/macaw-ui";
import clsx from "clsx";
import React, { useEffect } from "react";
import { useLocation } from "react-router";

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
  const frameRef = React.useRef<HTMLIFrameElement>(null);
  const { themeType } = useTheme();
  const classes = useStyles();
  const appOrigin = getOrigin(src);
  const flags = useAllFlags();
  const { postToExtension, handshakeDone, setHandshakeDone } = useAppActions(
    frameRef.current,
    appOrigin,
    appId,
    appToken,
  );
  const location = useLocation();
  const { locale } = useLocale();

  useEffect(() => {
    if (!handshakeDone) {
      return;
    }

    postToExtension({
      type: "localeChanged",
      payload: {
        locale,
      },
    });
  }, [handshakeDone, locale, postToExtension]);

  useEffect(() => {
    if (!handshakeDone) {
      return;
    }
    postToExtension({
      type: "theme",
      payload: {
        theme: themeType,
      },
    });
  }, [themeType, postToExtension, handshakeDone]);

  useEffect(() => {
    if (!handshakeDone) {
      return;
    }
    postToExtension({
      type: "redirect",
      payload: {
        path: getAppDeepPathFromDashboardUrl(location.pathname, appId),
      },
    });
  }, [appId, handshakeDone, location.pathname, postToExtension]);

  useTokenRefresh(appToken, refetch);

  const handleLoad = () => {
    /**
     * @deprecated
     *
     * Move handshake to notifyReady, so app is requesting token after its ready to receive it
     */
    postToExtension({
      type: "handshake",
      payload: {
        token: appToken,
        version: 1,
      },
    });
    setHandshakeDone(true);
    postToExtension({
      type: "theme",
      payload: {
        theme: themeType,
      },
    });

    if (onLoad) {
      onLoad();
    }
  };

  return (
    <iframe
      ref={frameRef}
      src={resolveAppIframeUrl(appId, src, {
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
  );
};

// export const AppFrame = React.memo(_AppFrame);
