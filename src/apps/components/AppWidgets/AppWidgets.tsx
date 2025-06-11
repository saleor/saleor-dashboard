import { AppFrame } from "@dashboard/apps/components/AppFrame";
import { AppDetailsUrlMountQueryParams, AppUrls } from "@dashboard/apps/urls";
import { DashboardCard } from "@dashboard/components/Card";
import { APP_VERSION } from "@dashboard/config";
import { Extension } from "@dashboard/extensions/types";
import { useAllFlags } from "@dashboard/featureFlags";
import useNavigator from "@dashboard/hooks/useNavigator";
import { ThemeType } from "@saleor/app-sdk/app-bridge";
import { Box, Text } from "@saleor/macaw-ui-next";
import React, { useRef } from "react";

export type AppWidgetsProps = {
  extensions: Extension[];
  params: AppDetailsUrlMountQueryParams;
};

const defaultIframeSize = 50;

/**
 * TODO
 * - accept extensions
 * - app name link to app page
 * - extension height should be configurable in manifest
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
            </Box>
          );
        })}
      </DashboardCard.Content>
    </DashboardCard>
  );
};
