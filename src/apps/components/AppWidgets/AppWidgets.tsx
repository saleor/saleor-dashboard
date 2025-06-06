import { AppFrame } from "@dashboard/apps/components/AppFrame";
import { AppUrls } from "@dashboard/apps/urls";
import { DashboardCard } from "@dashboard/components/Card";
import { APP_VERSION } from "@dashboard/config";
import { Extension } from "@dashboard/extensions/hooks/useExtensions";
import { useAllFlags } from "@dashboard/featureFlags";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";

export type AppWidgetsProps = {
  extensions: Extension[];
};

/**
 * TODO
 * - accept extensions
 * - app name link to app page
 * - extension height should be configurable in manifest
 */
export const AppWidgets = ({ extensions }: AppWidgetsProps) => {
  const flags = useAllFlags();

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>Apps</DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        {extensions.map(ext => {
          const appCompleteUrl = AppUrls.resolveAppIframeUrl(
            ext.app.id,
            ext.app.appUrl + ext.url, // todo should url for extension be relative or absolute?
            {
              action: "app-activate",
              id: ext.app.id,
              featureFlags: flags,
              theme: "light",
            },
          );

          return (
            <Box marginBottom={4} key={ext.id}>
              <Text size={3} color="default2">
                {ext.label} (app_name)
              </Text>
              <Box marginTop={2} __height={100}>
                <AppFrame
                  src={appCompleteUrl}
                  appToken={ext.accessToken}
                  appId={ext.app.id}
                  dashboardVersion={APP_VERSION}
                />
              </Box>
            </Box>
          );
        })}
      </DashboardCard.Content>
    </DashboardCard>
  );
};
