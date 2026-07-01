import { Link } from "@dashboard/components/Link";
import { APP_VERSION } from "@dashboard/config";
import { AppWidgetCard } from "@dashboard/extensions/components/AppWidgetCard/AppWidgetCard";
import { IframePost } from "@dashboard/extensions/components/IframePost/IframePost";
import { appExtensionManifestOptionsSchema } from "@dashboard/extensions/domain/app-extension-manifest-options";
import { isUrlAbsolute } from "@dashboard/extensions/isUrlAbsolute";
import { extensionActions } from "@dashboard/extensions/messages";
import { type ExtensionWithParams } from "@dashboard/extensions/types";
import { type AppDetailsUrlMountQueryParams, ExtensionsUrls } from "@dashboard/extensions/urls";
import { AppFrame } from "@dashboard/extensions/views/ViewManifestExtension/components/AppFrame/AppFrame";
import { type ThemeType } from "@saleor/app-sdk/app-bridge";
import { Box, Skeleton, Text } from "@saleor/macaw-ui-next";
import { ExternalLink } from "lucide-react";
import { useIntl } from "react-intl";

interface AppWidgetExtensionItemProps {
  extension: ExtensionWithParams;
  params: AppDetailsUrlMountQueryParams;
  theme: ThemeType | undefined;
}

export const AppWidgetExtensionItem = ({
  extension,
  params,
  theme,
}: AppWidgetExtensionItemProps) => {
  const intl = useIntl();
  const settingsValidation = appExtensionManifestOptionsSchema.safeParse(extension.settings);

  if (!settingsValidation.success) {
    return (
      <Box>
        <Text>Error rendering extension</Text>
      </Box>
    );
  }

  const settings = settingsValidation.data;

  if (extension.targetName !== "WIDGET") {
    const onClick = () => extension.open(params);

    switch (extension.targetName) {
      case "APP_PAGE":
        return (
          <Link onClick={onClick} title={intl.formatMessage(extensionActions.redirectToAppPage)}>
            {extension.label}
          </Link>
        );
      case "NEW_TAB":
        return (
          <Link onClick={onClick} title={intl.formatMessage(extensionActions.openInNewTab)}>
            {extension.label}{" "}
            <ExternalLink style={{ width: 16, height: 16, verticalAlign: "text-bottom" }} />
          </Link>
        );
      case "POPUP":
        return (
          <Link onClick={onClick} title={intl.formatMessage(extensionActions.openInPopup)}>
            {extension.label}...
          </Link>
        );
    }
  }

  if (extension.fromCache) {
    // Snapshot extension has no real access token yet — show a loader and wait
    // for the background revalidation. Mounting the iframe now would POST/handshake
    // an empty token and crash the app with "Invalid JWT".
    return (
      <AppWidgetCard extension={extension}>
        <Skeleton />
      </AppWidgetCard>
    );
  }

  const isIframePost = settings?.widgetTarget?.method === "POST";
  const extensionUrl = isUrlAbsolute(extension.url)
    ? extension.url
    : `${extension.app.appUrl ?? ""}${extension.url}`;
  const appIframeUrl = ExtensionsUrls.resolveAppIframeUrl(extension.app.id, extensionUrl, {
    id: extension.app.id,
    theme: theme!,
  });

  return (
    <AppWidgetCard extension={extension}>
      {isIframePost ? (
        <IframePost
          autoHeight
          appId={extension.app.id}
          accessToken={extension.accessToken}
          extensionId={extension.id}
          extensionUrl={extensionUrl}
          params={params}
        />
      ) : (
        <AppFrame
          target="WIDGET"
          autoHeight
          src={appIframeUrl}
          appToken={extension.accessToken}
          appId={extension.app.id}
          dashboardVersion={APP_VERSION}
          params={params}
        />
      )}
    </AppWidgetCard>
  );
};
