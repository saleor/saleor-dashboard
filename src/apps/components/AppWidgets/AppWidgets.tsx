import { AppAvatar } from "@dashboard/apps/components/AppAvatar/AppAvatar";
import { AppFrame } from "@dashboard/apps/components/AppFrame";
import { isUrlAbsolute } from "@dashboard/apps/isUrlAbsolute";
import { AppDetailsUrlMountQueryParams, AppUrls } from "@dashboard/apps/urls";
import { DashboardCard } from "@dashboard/components/Card";
import Link from "@dashboard/components/Link";
import { APP_VERSION } from "@dashboard/config";
import { extensionActions } from "@dashboard/extensions/messages";
import { ExtensionWithParams } from "@dashboard/extensions/types";
import { AppExtensionTargetEnum } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import LaunchIcon from "@material-ui/icons/Launch";
import { ThemeType } from "@saleor/app-sdk/app-bridge";
import { Box, Skeleton, Text } from "@saleor/macaw-ui-next";
import { useEffect, useRef } from "react";
import { useIntl } from "react-intl";

export type AppWidgetsProps = {
  extensions: ExtensionWithParams[];
  params: AppDetailsUrlMountQueryParams;
};

const hiddenStyle = { visibility: "hidden" } as const;

// TODO We will add size negotiations after render
const defaultIframeSize = 200;

/**
 * Renders a form and iframe, the form is automatically submitted with POST action and <iframe> content is replaced
 */
const IframePost = ({
  extensionId,
  extensionUrl,
  appId,
  accessToken,
  params,
}: {
  extensionUrl: string;
  extensionId: string;
  accessToken: string;
  appId: string;
  params?: AppDetailsUrlMountQueryParams;
}) => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const iframeRef = useRef<HTMLFormElement | null>(null);
  const loadingRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (formRef.current) {
      formRef.current.submit();
    }

    if (iframeRef.current && loadingRef.current) {
      const iframe = iframeRef.current;
      const loading = loadingRef.current;

      const onload = () => {
        if (loading) {
          loading.style.display = "none";
        }

        if (iframe) {
          iframe.style.visibility = "visible";
        }
      };

      iframe.addEventListener("load", onload);

      return () => {
        if (iframe) {
          iframe.removeEventListener("load", onload);
        }
      };
    }
  }, []);

  /**
   * This form is rendered locally, but somewhere above there is another form. Since this is hidden, it is not visible to the user,
   * but under the hood browser is changing the DOM
   *
   * TODO: We should either render form in JS directly in <body> directly or change the tree
   */
  return (
    <Box>
      <form ref={formRef} action={extensionUrl} method="POST" target={`ext-frame-${extensionId}`}>
        <input type="hidden" name="saleorApiUrl" value={process.env.API_URL} />
        <input type="hidden" name="accessToken" value={accessToken} />
        <input type="hidden" name="appId" value={appId} />
        <>
          {params &&
            Object.entries(params).map(([key, value]) => (
              <input type="hidden" key={key} name={key} value={value} />
            ))}
        </>
      </form>
      <Box ref={loadingRef} width={"100%"} __height={defaultIframeSize}>
        <Skeleton __height={defaultIframeSize} />
      </Box>
      <Box
        style={hiddenStyle}
        ref={iframeRef}
        as="iframe"
        borderWidth={0}
        __height={defaultIframeSize}
        sandbox="allow-same-origin allow-forms allow-scripts allow-downloads"
        name={`ext-frame-${extensionId}`}
        width={"100%"}
      />
    </Box>
  );
};

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
          const appPageUrl = AppUrls.resolveAppUrl(appWithExtensions.app.id);

          return (
            <Box marginBottom={4} key={appId}>
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
                const isIframeType = ext.target === "WIDGET";
                const widgetOptions =
                  ext.options?.__typename === "AppExtensionOptionsWidget" && ext.options;

                const isPOST = widgetOptions && widgetOptions?.widgetTarget?.method === "POST";

                const isExtensionAbsoluteUrl = isUrlAbsolute(ext.url);

                const extensionUrl = isExtensionAbsoluteUrl ? ext.url : ext.app.appUrl + ext.url;

                const GETappIframeUrl = AppUrls.resolveAppIframeUrl(ext.app.id, extensionUrl, {
                  id: ext.app.id,
                  theme: themeRef.current!,
                });

                const renderIframeGETvariant = () => (
                  <Box __height={defaultIframeSize}>
                    <Text size={3} color="default2" href={appPageUrl}>
                      {ext.label}
                    </Text>
                    <AppFrame
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

                  switch (ext.target) {
                    case AppExtensionTargetEnum.APP_PAGE:
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
                    case AppExtensionTargetEnum.NEW_TAB:
                      return (
                        <Box marginTop={2}>
                          <Link
                            onClick={onClick}
                            title={intl.formatMessage(extensionActions.openInNewTab)}
                          >
                            {ext.label}{" "}
                            <LaunchIcon
                              style={{ width: 16, height: 16, verticalAlign: "text-bottom" }}
                            />
                          </Link>
                        </Box>
                      );
                    case AppExtensionTargetEnum.POPUP:
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
                    case AppExtensionTargetEnum.WIDGET:
                      throw new Error("You should not render widget type as link");
                  }
                };

                const renderPOSTiframe = isIframeType && isPOST;
                const renderGETiframe = isIframeType && !isPOST;
                const renderNonIframe = !isIframeType;

                return (
                  <>
                    {renderGETiframe && renderIframeGETvariant()}
                    {renderPOSTiframe && renderIframePOSTvariant()}
                    {renderNonIframe && renderNonIframeExtension()}
                  </>
                );
              })}
            </Box>
          );
        })}
      </DashboardCard.Content>
    </DashboardCard>
  );
};
