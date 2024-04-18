import { usePostToExtension } from "@dashboard/apps/components/AppFrame/usePostToExtension";
import { AppUrls } from "@dashboard/apps/urls";
import useLocale from "@dashboard/hooks/useLocale";
import { useTheme } from "@saleor/macaw-ui";
import { useEffect } from "react";

/**
 * TODO: Refactor prop-drilling, use context or some atomic state
 */
export const useAppDashboardUpdates = (
  frameEl: HTMLIFrameElement | null,
  appOrigin: string,
  enabled: boolean,
  appId: string,
) => {
  const postToExtension = usePostToExtension(frameEl, appOrigin);
  const { locale } = useLocale();
  const { themeType } = useTheme();

  useEffect(() => {
    if (!enabled) {
      return;
    }

    postToExtension({
      type: "localeChanged",
      payload: {
        locale,
      },
    });
  }, [enabled, locale, postToExtension]);
  useEffect(() => {
    if (!enabled) {
      return;
    }

    postToExtension({
      type: "theme",
      payload: {
        theme: themeType,
      },
    });
  }, [themeType, postToExtension, enabled]);
  useEffect(() => {
    if (!enabled) {
      return;
    }
    postToExtension({
      type: "redirect",
      payload: {
        path: AppUrls.resolveAppDeepPathFromDashboardUrl(location.pathname, appId),
      },
    });
  }, [appId, enabled, postToExtension]);
};
