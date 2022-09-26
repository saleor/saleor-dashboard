import { getAppDeepPathFromDashboardUrl } from "@saleor/apps/urls";
import useLocale from "@saleor/hooks/useLocale";
import useShop from "@saleor/hooks/useShop";
import { useTheme } from "@saleor/macaw-ui";
import clsx from "clsx";
import React, { useEffect } from "react";
import { useLocation } from "react-router";
import urlJoin from "url-join";

import { useStyles } from "./styles";
import { useAppActions } from "./useAppActions";
import useTokenRefresh from "./useTokenRefresh";

interface Props {
  src: string;
  appToken: string;
  appId: string;
  className?: string;
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
  onLoad,
  onError,
  refetch,
}) => {
  const shop = useShop();
  const frameRef = React.useRef<HTMLIFrameElement>();
  const { themeType } = useTheme();
  const classes = useStyles();
  const appOrigin = getOrigin(src);
  const { postToExtension } = useAppActions(frameRef, appOrigin, appId);
  const location = useLocation();
  const { locale } = useLocale();

  useEffect(() => {
    postToExtension({
      type: "localeChanged",
      payload: {
        locale,
      },
    });
  }, [locale, postToExtension]);

  useEffect(() => {
    postToExtension({
      type: "theme",
      payload: {
        theme: themeType,
      },
    });
  }, [themeType, postToExtension]);

  useEffect(() => {
    postToExtension({
      type: "redirect",
      payload: {
        path: getAppDeepPathFromDashboardUrl(location.pathname, appId),
      },
    });
  }, [location.pathname]);

  useTokenRefresh(appToken, refetch);

  const handleLoad = () => {
    postToExtension({
      type: "handshake",
      payload: {
        token: appToken,
        version: 1,
      },
    });
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

  if (!shop?.domain.host) {
    return null;
  }

  return (
    <iframe
      ref={frameRef}
      src={urlJoin(
        src,
        window.location.search,
        `?domain=${shop.domain.host}&id=${appId}&locale=${locale}`,
      )}
      onError={onError}
      onLoad={handleLoad}
      className={clsx(classes.iframe, className)}
      sandbox="allow-same-origin allow-forms allow-scripts"
    />
  );
};
