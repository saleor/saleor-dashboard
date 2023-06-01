import { appsMessages } from "@dashboard/apps/messages";
import { InstalledApp } from "@dashboard/apps/types";
import { AppPaths, AppUrls } from "@dashboard/apps/urls";
import { isAppInTunnel } from "@dashboard/apps/utils";
import Link from "@dashboard/components/Link";
import { Box, Chip, List, sprinkles, Text } from "@saleor/macaw-ui/next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useLocation } from "react-router";

import { AppAvatar } from "../AppAvatar/AppAvatar";
import AppPermissions from "../AppPermissions";
import { AppManifestUrl } from "./AppManifestUrl";
import { messages } from "./messages";

export const InstalledAppListRow: React.FC<InstalledApp> = props => {
  const { app, isExternal, logo } = props;
  const intl = useIntl();

  const location = useLocation();

  /**
   * Active app will redirect to app iframe, but disabled app is likely not going to work - so iframe is blocked.
   * Link will point to app "manage" screen where app can be enabled or uninstalled
   */
  const appUrl = app.isActive
    ? AppUrls.resolveAppUrl(app.id)
    : AppPaths.resolveAppDetailsPath(app.id);

  return (
    <Link
      href={appUrl}
      state={{ from: location.pathname }}
      className={sprinkles({ display: "contents" })}
      inline={false}
    >
      <List.Item
        padding={4}
        borderTopStyle="solid"
        borderWidth={1}
        borderColor="neutralPlain"
        justifyContent="space-between"
        flexDirection="row"
        flexWrap="wrap"
        transition={"ease"}
        backgroundColor={{
          default: !app.isActive ? "surfaceNeutralSubdued" : undefined,
          hover: "surfaceNeutralSubdued",
        }}
        cursor={"pointer"}
      >
        <Box
          gap={2}
          alignItems="center"
          display="grid"
          __gridTemplateColumns="1fr auto"
        >
          <AppAvatar logo={logo} />
          <Box
            display="flex"
            gap={1}
            flexDirection="column"
            alignItems="flex-start"
          >
            <Box display="flex" gap={2}>
              <Text variant="bodyStrong">{app.name}</Text>
              <Text variant="body" color="textNeutralSubdued">
                {`v${app.version}`}
              </Text>
              {isExternal && (
                <Chip data-test-id="app-external-label" size="large">
                  <Text variant="caption" size="small">
                    <FormattedMessage {...appsMessages.externalApp} />
                  </Text>
                </Chip>
              )}
              {app.manifestUrl && isAppInTunnel(app.manifestUrl) ? (
                <Text
                  variant="caption"
                  color="textNeutralSubdued"
                  data-test-id="app-tunnel-label"
                >
                  {`(${intl.formatMessage(messages.tunnelDevelopment)})`}
                </Text>
              ) : null}
            </Box>
            {app.manifestUrl && (
              <AppManifestUrl manifestUrl={app.manifestUrl} />
            )}
          </Box>
        </Box>
        <Box
          display="flex"
          marginTop={{ mobile: 1.5, desktop: 0 }}
          flexDirection="row"
          justifyContent={{ mobile: "flex-end", desktop: "flex-start" }}
          gap={3}
        >
          <Box marginLeft="auto" display="flex" alignItems="center" gap={5}>
            {!app.isActive && (
              <Text variant="caption" color="textNeutralSubdued">
                <FormattedMessage {...messages.appDisabled} />
              </Text>
            )}
            <AppPermissions permissions={app.permissions} />
          </Box>
        </Box>
      </List.Item>
    </Link>
  );
};

export default InstalledAppListRow;
