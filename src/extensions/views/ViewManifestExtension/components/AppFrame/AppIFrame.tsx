import { usePopupFrameReference } from "@dashboard/extensions/popup-frame-reference";
import { AppDetailsUrlMountQueryParams, ExtensionsUrls } from "@dashboard/extensions/urls";
import { FlagList } from "@dashboard/featureFlags";
import { ThemeType } from "@saleor/app-sdk/app-bridge";
import { useTheme } from "@saleor/macaw-ui";
import isEqualWith from "lodash/isEqualWith";
import { forwardRef, memo, useEffect, useRef } from "react";

interface AppIFrameProps {
  appId: string;
  src: string;
  featureFlags: FlagList;
  params?: AppDetailsUrlMountQueryParams;
  onLoad: () => void;
  onError?: () => void;
  className: string;
}

const _AppIFrame = forwardRef<HTMLIFrameElement, AppIFrameProps>(
  ({ appId, src, featureFlags, params, onLoad, onError, className }, ref) => {
    const themeRef = useRef<ThemeType>();
    // For some reason when forwardRef is used, there is no direct access to ref.current in hook unload
    const localIframeRef = useRef<HTMLIFrameElement | null>();
    const { themeType } = useTheme();
    const { setIframe, clearIframe } = usePopupFrameReference();

    // Ignore updates to themeType - iframe will be notified via events
    // Otherwise this will cause reload of entire iframe
    useEffect(() => {
      themeRef.current = themeType;

      return () => {
        if (localIframeRef.current) {
          clearIframe(localIframeRef?.current);
        }
      };
    }, [ref]);

    const iframeSrc = ExtensionsUrls.resolveAppIframeUrl(appId, src, {
      ...params,
      featureFlags,
      theme: themeRef.current!,
    });

    return (
      <iframe
        data-test-id="app-frame"
        ref={ref}
        src={iframeSrc}
        onLoad={event => {
          setIframe(event.currentTarget, true);
          localIframeRef.current = event.currentTarget;

          onLoad();
        }}
        onError={onError}
        className={className}
        sandbox="allow-same-origin allow-forms allow-scripts allow-downloads allow-popups"
      />
    );
  },
);

_AppIFrame.displayName = "AppIFrame";

export const AppIFrame = memo(_AppIFrame, (prev, next) => isEqualWith(prev, next));
