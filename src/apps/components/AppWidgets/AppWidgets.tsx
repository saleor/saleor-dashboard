import { AppFrame } from "@dashboard/apps/components/AppFrame";
import { AppDetailsUrlMountQueryParams, AppUrls } from "@dashboard/apps/urls";
import { DashboardCard } from "@dashboard/components/Card";
import Link from "@dashboard/components/Link";
import { APP_VERSION } from "@dashboard/config";
import { extensionActions } from "@dashboard/extensions/messages";
import { ExtensionWithParams } from "@dashboard/extensions/types";
import { AppExtensionTargetEnum } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { ThemeType } from "@saleor/app-sdk/app-bridge";
import { Box, Text } from "@saleor/macaw-ui-next";
import React, { useEffect, useRef } from "react";
import { IntlShape, useIntl } from "react-intl";

export type AppWidgetsProps = {
  extensions: ExtensionWithParams[];
  params: AppDetailsUrlMountQueryParams;
};

// TODO We will add size negotiations after render
const defaultIframeSize = 200;

const getNonIframeLabel = (target: AppExtensionTargetEnum, intl: IntlShape) => {
  switch (target) {
    case AppExtensionTargetEnum.APP_PAGE:
      return intl.formatMessage(extensionActions.redirectToAppPage);
    case AppExtensionTargetEnum.NEW_TAB:
      return intl.formatMessage(extensionActions.openInNewTab);
    case AppExtensionTargetEnum.POPUP:
      return intl.formatMessage(extensionActions.openInPopup);
    case AppExtensionTargetEnum.WIDGET:
      throw new Error("You should not render widget type as link");
  }
};

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

  useEffect(() => {
    formRef.current && formRef.current.submit();
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
      <Box
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

const isUrlAbsolute = (url: string) => {
  try {
    new URL(url);

    return true;
  } catch (e) {
    return false;
  }
};

export const AppWidgets = ({ extensions, params }: AppWidgetsProps) => {
  const navigate = useNavigator();
  const themeRef = useRef<ThemeType>();
  const intl = useIntl();

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>Apps</DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        {extensions.map(ext => {
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

          const appPageUrl = AppUrls.resolveAppUrl(ext.app.id);

          const onNonIframeActionClick = () => {
            switch (ext.target) {
              case AppExtensionTargetEnum.WIDGET: {
                throw new Error("Widget should not render link to click");
              }
              case AppExtensionTargetEnum.APP_PAGE:
              case AppExtensionTargetEnum.NEW_TAB:
              case AppExtensionTargetEnum.POPUP: {
                ext.open(params);

                return;
              }
            }
          };

          const renderIframeGETvariant = () => (
            <Box marginTop={2} __height={defaultIframeSize}>
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
            <IframePost
              appId={ext.app.id}
              accessToken={ext.accessToken}
              extensionId={ext.id}
              extensionUrl={extensionUrl}
              params={params}
            />
          );

          const renderNonIframeExtensionLabel = () => (
            <Box marginTop={2}>
              <Link onClick={onNonIframeActionClick}>{getNonIframeLabel(ext.target, intl)}</Link>
            </Box>
          );

          const renderPOSTiframe = isIframeType && isPOST;
          const renderGETiframe = isIframeType && !isPOST;
          const renderNonIframe = !isIframeType;

          return (
            <Box marginBottom={4} key={ext.id}>
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
                {ext.app.name}: {ext.label}
              </Text>
              {renderGETiframe && renderIframeGETvariant()}
              {renderPOSTiframe && renderIframePOSTvariant()}
              {renderNonIframe && renderNonIframeExtensionLabel()}
            </Box>
          );
        })}
      </DashboardCard.Content>
    </DashboardCard>
  );
};
