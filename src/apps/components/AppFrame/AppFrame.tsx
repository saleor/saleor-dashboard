import { useTheme } from "@saleor/macaw-ui";
import React from "react";
import urlJoin from "url-join";

import { useStyles } from "./styles";

interface Props {
  src: string;
  appToken: string;
  backendHost: string;
  onLoad?(): void;
  onError?(): void;
}

const getOrigin = (url: string) => new URL(url).origin;

export const AppFrame: React.FC<Props> = ({
  src,
  appToken,
  backendHost,
  onLoad,
  onError
}) => {
  const frameRef = React.useRef<HTMLIFrameElement>();
  const { sendThemeToExtension } = useTheme();
  const classes = useStyles();

  const handleLoad = () => {
    const appOrigin = getOrigin(src);
    frameRef.current.contentWindow.postMessage(
      {
        payload: {
          token: appToken
        },
        type: "handshake"
      },
      appOrigin
    );
    sendThemeToExtension();
    onLoad();
  };

  return (
    <iframe
      ref={frameRef}
      src={urlJoin(src, `?domain=${backendHost}`)}
      onError={onError}
      onLoad={handleLoad}
      className={classes.iframe}
    />
  );
};
