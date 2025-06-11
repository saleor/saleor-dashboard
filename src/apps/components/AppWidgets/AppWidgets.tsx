import { AppFrame } from "@dashboard/apps/components/AppFrame";
import { AppDetailsUrlMountQueryParams, AppUrls } from "@dashboard/apps/urls";
import { DashboardCard } from "@dashboard/components/Card";
import Link from "@dashboard/components/Link";
import { APP_VERSION } from "@dashboard/config";
import { Extension } from "@dashboard/extensions/types";
import { useAllFlags } from "@dashboard/featureFlags";
import { AppExtensionTargetEnum } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { ThemeType } from "@saleor/app-sdk/app-bridge";
import { Box, Text } from "@saleor/macaw-ui-next";
import React, { useRef } from "react";

export type AppWidgetsProps = {
  extensions: Extension[];
  params: AppDetailsUrlMountQueryParams;
};

const defaultIframeSize = 50;

// todo translations
const getNonIframeLabel = (target: AppExtensionTargetEnum) => {
  switch (target) {
    case AppExtensionTargetEnum.APP_PAGE:
      return "Redirect to the App details";
    case AppExtensionTargetEnum.NEW_TAB:
      return "Open in a new tab";
    case AppExtensionTargetEnum.POPUP:
      return "Open Popup";
    case AppExtensionTargetEnum.WIDGET:
      throw new Error("Widget should not render link to click");
  }
};

/**
 * TODO
 * - accept extensions
 * - extension height should be negotiated with sdk
 */
export const AppWidgets = ({ extensions, params }: AppWidgetsProps) => {
  const flags = useAllFlags();

  const navigate = useNavigator();
  const themeRef = useRef<ThemeType>();

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>Apps</DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        {extensions.map(ext => {
          const isIframeType = ext.target === "WIDGET";

          const appIframeUrl = AppUrls.resolveAppIframeUrl(
            ext.app.id,
            ext.app.appUrl + ext.url, // todo should url for extension be relative or absolute?
            {
              ...params,
              id: ext.app.id,
              featureFlags: flags,
              theme: themeRef.current!, //todo
            },
          );

          const appPageUrl = AppUrls.resolveAppUrl(ext.app.id, {
            featureFlags: flags,
          });

          const onNonIframeActionClick = () => {
            switch (ext.target) {
              case AppExtensionTargetEnum.APP_PAGE: {
                ext.open();

                return;
              }
              case AppExtensionTargetEnum.WIDGET: {
                throw new Error("Widget should not render link to click");
              }
              case AppExtensionTargetEnum.NEW_TAB: {
                ext.open();

                return;
              }
              case AppExtensionTargetEnum.POPUP: {
                ext.open();

                return;
              }
            }
          };

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
              {isIframeType && (
                <Box marginTop={2} __height={defaultIframeSize}>
                  <AppFrame
                    src={appIframeUrl}
                    appToken={ext.accessToken}
                    appId={ext.app.id}
                    dashboardVersion={APP_VERSION}
                  />
                </Box>
              )}
              {!isIframeType && (
                <Box marginTop={2}>
                  <Link onClick={onNonIframeActionClick}>{getNonIframeLabel(ext.target)}</Link>
                </Box>
              )}
            </Box>
          );
        })}
      </DashboardCard.Content>
    </DashboardCard>
  );
};
