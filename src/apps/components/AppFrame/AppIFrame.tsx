import { AppDetailsUrlQueryParams, AppUrls } from "@dashboard/apps/urls";
import { ThemeType } from "@saleor/app-sdk/app-bridge";
import { useTheme } from "@saleor/macaw-ui";
import isEqualWith from "lodash/isEqualWith";
import React, { forwardRef, memo, useEffect, useRef } from "react";

interface AppIFrameProps {
  appId: string;
  src: string;
  featureFlags: Record<string, string>;
  params: AppDetailsUrlQueryParams;
  onLoad: () => void;
  onError: () => void;
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

    const iframeSrc = AppUrls.resolveAppIframeUrl(appId, src, {
      ...params,
      featureFlags,
      theme: themeRef.current,
    });

    return (
      <iframe
        data-test-id="app-frame"
        ref={ref}
        src={iframeSrc}
        onLoad={onLoad}
        onError={onError}
        className={className}
        sandbox="allow-same-origin allow-forms allow-scripts"
      />
    );
  },
);

export const AppIFrame = memo(_AppIFrame, (prev, next) =>
  isEqualWith(prev, next),
);
