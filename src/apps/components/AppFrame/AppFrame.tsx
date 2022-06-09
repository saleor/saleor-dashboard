import useShop from "@saleor/hooks/useShop";
import { useTheme } from "@saleor/macaw-ui";
import clsx from "clsx";
import React from "react";
import urlJoin from "url-join";

import { useStyles } from "./styles";
import { useAppActions } from "./useAppActions";

interface Props {
  src: string;
  appToken: string;
  appId: string;
  className?: string;
  allowPopups?: boolean;
  onLoad?(): void;
  onError?(): void;
}

const baseSandbox = "allow-same-origin allow-forms allow-scripts";

const getOrigin = (url: string) => new URL(url).origin;

export const AppFrame: React.FC<Props> = ({
  src,
  appToken,
  appId,
  className,
  allowPopups = false,
  onLoad,
  onError
}) => {
  const shop = useShop();
  const frameRef = React.useRef<HTMLIFrameElement>();
  const { sendThemeToExtension } = useTheme();
  const classes = useStyles();
  const appOrigin = getOrigin(src);
  const { postToExtension } = useAppActions(frameRef, appOrigin);

  const handleLoad = () => {
    postToExtension({
      type: "handshake",
      payload: {
        token: appToken,
        version: 1
      }
    });
    sendThemeToExtension();

    if (onLoad) {
      onLoad();
    }
  };

  if (!shop?.domain.host) {
    return null;
  }

  const iframeSandbox = allowPopups
    ? `${baseSandbox} allow-popups`
    : baseSandbox;

  return (
    <iframe
      ref={frameRef}
      src={urlJoin(src, `?domain=${shop.domain.host}&id=${appId}`)}
      onError={onError}
      onLoad={handleLoad}
      className={clsx(classes.iframe, className)}
      sandbox={iframeSandbox}
    />
  );
};
