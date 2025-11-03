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
    const { themeType } = useTheme();

    // Ignore updates to themeType - iframe will be notified via events
    // Otherwise this will cause reload of entire iframe
    useEffect(() => {
      themeRef.current = themeType;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
        onLoad={onLoad}
        onError={onError}
        className={className}
        sandbox="allow-same-origin allow-forms allow-scripts allow-downloads allow-popups"
      />
    );
  },
);

_AppIFrame.displayName = "AppIFrame";

export const AppIFrame = memo(_AppIFrame, (prev, next) => isEqualWith(prev, next));
