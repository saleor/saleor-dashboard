import React from "react";
import urlJoin from "url-join";

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
    onLoad();
  };

  return (
    <iframe
      ref={frameRef}
      src={urlJoin(src, `?domain=${backendHost}`)}
      onError={onError}
      onLoad={handleLoad}
    />
  );
};
