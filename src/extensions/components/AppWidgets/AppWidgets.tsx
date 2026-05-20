import { DashboardCard } from "@dashboard/components/Card";
import Link from "@dashboard/components/Link";
import { APP_VERSION } from "@dashboard/config";
import { AppAvatar } from "@dashboard/extensions/components/AppAvatar/AppAvatar";
import { IframePost } from "@dashboard/extensions/components/IframePost/IframePost";
import { appExtensionManifestOptionsSchema } from "@dashboard/extensions/domain/app-extension-manifest-options";
import { isUrlAbsolute } from "@dashboard/extensions/isUrlAbsolute";
import { extensionActions } from "@dashboard/extensions/messages";
import { type ExtensionWithParams } from "@dashboard/extensions/types";
import { type AppDetailsUrlMountQueryParams, ExtensionsUrls } from "@dashboard/extensions/urls";
import { AppFrame } from "@dashboard/extensions/views/ViewManifestExtension/components/AppFrame/AppFrame";
import useNavigator from "@dashboard/hooks/useNavigator";
import { type ThemeType } from "@saleor/app-sdk/app-bridge";
import { Box, Text } from "@saleor/macaw-ui-next";
import { ExternalLink } from "lucide-react";
import { useRef } from "react";
import { useIntl } from "react-intl";

type AppWidgetsProps = {
  extensions: ExtensionWithParams[];
  params: AppDetailsUrlMountQueryParams;
};

// TODO We will add size negotiations after render
const defaultIframeSize = 200;

export const AppWidgets = ({ extensions, params }: AppWidgetsProps) => {
  const navigate = useNavigator();
  const themeRef = useRef<ThemeType>();
  const intl = useIntl();

  const groupedByApp = extensions.reduce(
    (group, extension) => {
      const appId = extension.app.id;
      const appGroup = group[appId];

      if (appGroup) {
        group[appId].extensions.push(extension);
      } else {
        group[appId] = {
          app: extension.app,
          extensions: [extension],
        };
      }

      return group;
    },
    {} as Record<string, { app: ExtensionWithParams["app"]; extensions: ExtensionWithParams[] }>,
  );

  // Sort alphabetically, so order of apps is constant, even if API returns them differently. This allows more consistent UX
  const sortedByAppName = Object.entries(groupedByApp).sort((a, b) =>
    (a[1].app.name ?? "" < (b[1].app.name ?? "")) ? -1 : 1,
  );

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>Apps</DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        {sortedByAppName.map(([appId, appWithExtensions]) => {
          const logo = appWithExtensions.app.brand?.logo.default;
          const appPageUrl = ExtensionsUrls.resolveViewManifestExtensionUrl(
            appWithExtensions.app.id,
            {},
          );

          return (
            <Box marginBottom={8} key={appId}>
              <Box display="flex" alignItems="center" marginBottom={2}>
                <AppAvatar size={6} logo={logo ? { source: logo } : undefined} marginRight={2} />
                <Text
                  onClick={e => {
                    navigate(appPageUrl);

                    e.preventDefault();
                  }}
                  as="a"
                  size={3}
                  color="default2"
                  href={appPageUrl}
                >
                  {appWithExtensions.app.name}
                </Text>
              </Box>
              {appWithExtensions.extensions.map(ext => {
                const settingsValidation = appExtensionManifestOptionsSchema.safeParse(
                  ext.settings,
                );

                if (!settingsValidation.success) {
                  return (
                    <Box marginTop={2} key={ext.id}>
                      <Text>Error rendering extension</Text>
                    </Box>
                  );
                }

                const settings = settingsValidation.data;

                const isIframeType = ext.targetName === "WIDGET";

                const isIframePost =
                  ext.targetName === "WIDGET" && settings?.widgetTarget?.method === "POST";

                const isExtensionAbsoluteUrl = isUrlAbsolute(ext.url);

                const extensionUrl = isExtensionAbsoluteUrl ? ext.url : ext.app.appUrl + ext.url;

                const GETappIframeUrl = ExtensionsUrls.resolveAppIframeUrl(
                  ext.app.id,
                  extensionUrl,
                  {
                    id: ext.app.id,
                    theme: themeRef.current!,
                  },
                );

                const renderIframeGETvariant = () => (
                  <Box __height={defaultIframeSize}>
                    <Text size={3} color="default2" href={appPageUrl}>
                      {ext.label}
                    </Text>
                    <AppFrame
                      target="WIDGET"
                      src={GETappIframeUrl}
                      appToken={ext.accessToken}
                      appId={ext.app.id}
                      dashboardVersion={APP_VERSION}
                      params={params}
                    />
                  </Box>
                );

                const renderIframePOSTvariant = () => (
                  <Box>
                    <Text size={3} color="default2" href={appPageUrl}>
                      {ext.label}
                    </Text>
                    <IframePost
                      appId={ext.app.id}
                      accessToken={ext.accessToken}
                      extensionId={ext.id}
                      extensionUrl={extensionUrl}
                      params={params}
                    />
                  </Box>
                );

                const renderNonIframeExtension = () => {
                  const onClick = () => ext.open(params);

                  switch (ext.targetName) {
                    case "APP_PAGE":
                      return (
                        <Box marginTop={2}>
                          <Link
                            onClick={onClick}
                            title={intl.formatMessage(extensionActions.redirectToAppPage)}
                          >
                            {ext.label}
                          </Link>
                        </Box>
                      );
                    case "NEW_TAB":
                      return (
                        <Box marginTop={2}>
                          <Link
                            onClick={onClick}
                            title={intl.formatMessage(extensionActions.openInNewTab)}
                          >
                            {ext.label}{" "}
                            <ExternalLink
                              style={{ width: 16, height: 16, verticalAlign: "text-bottom" }}
                            />
                          </Link>
                        </Box>
                      );
                    case "POPUP":
                      return (
                        <Box marginTop={2}>
                          <Link
                            onClick={onClick}
                            title={intl.formatMessage(extensionActions.openInPopup)}
                          >
                            {ext.label}...
                          </Link>
                        </Box>
                      );
                    case "WIDGET":
                      throw new Error("You should not render widget type as link");
                  }
                };

                const renderPOSTiframe = isIframeType && isIframePost;
                const renderGETiframe = isIframeType && !isIframePost;
                const renderNonIframe = !isIframeType;

                return (
                  <Box marginBottom={4} key={ext.id}>
                    {renderGETiframe && renderIframeGETvariant()}
                    {renderPOSTiframe && renderIframePOSTvariant()}
                    {renderNonIframe && renderNonIframeExtension()}
                  </Box>
                );
              })}
            </Box>
          );
        })}
      </DashboardCard.Content>
    </DashboardCard>
  );
};
