import { appsMessages } from "@dashboard/apps/messages";
import { InstalledApp } from "@dashboard/apps/types";
import { AppPaths, AppUrls } from "@dashboard/apps/urls";
import { isAppInTunnel } from "@dashboard/apps/utils";
import Link from "@dashboard/components/Link";
import { StopPropagation } from "@dashboard/components/StopPropagation";
import { useFlag } from "@dashboard/featureFlags";
import { Box, Chip, List, sprinkles, Text } from "@saleor/macaw-ui-next";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useLocation } from "react-router";

import { AppAdditionalInfo } from "../AppAdditionalInfo/AppAdditionalInfo";
import { AppRowDisabledAlert } from "../AppAlerts/AppRowDisabledAlert";
import { AppRowWebhookIssueAlert } from "../AppAlerts/AppRowWebhookIssueAlert";
import { AppAvatar } from "../AppAvatar/AppAvatar";
import { AppManifestUrl } from "./AppManifestUrl";
import { messages } from "./messages";

export const InstalledAppListRow: React.FC<InstalledApp> = props => {
  const { enabled: appAlertsEnabled } = useFlag("app_alerts"); // Note: when removing clean up tests
  const { app, isExternal, logo } = props;
  const intl = useIntl();
  const location = useLocation();
  const [isMouseOverAlertIcons, setIsMouseOverAlertIcons] = useState(false);
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
        data-test-id={"apps:installed-app-row"}
        padding={4}
        borderTopStyle="solid"
        borderWidth={1}
        borderColor="default1"
        justifyContent="space-between"
        flexDirection="row"
        flexWrap="wrap"
        transition={"ease"}
        backgroundColor={
          isMouseOverAlertIcons
            ? {
                default: !app.isActive ? "default2" : undefined,
              }
            : {
                default: !app.isActive ? "default2" : undefined,
                hover: "default1Hovered",
                active: "default1Pressed",
              }
        }
        cursor={isMouseOverAlertIcons ? "auto" : "pointer"}
      >
        <Box gap={2} alignItems="center" display="grid" __gridTemplateColumns="1fr auto">
          <AppAvatar logo={logo} />
          <Box display="flex" gap={1} flexDirection="column" alignItems="flex-start">
            <Box display="flex" gap={2} alignItems="center">
              <Text
                size={4}
                fontWeight="bold"
                data-test-id={"app-" + app.name?.toLowerCase().replace(" ", "")}
                marginTop={0.5}
              >
                {app.name}
              </Text>

              <AppAdditionalInfo permissions={app.permissions} created={app.created} />

              {isExternal && (
                <Chip
                  data-test-id="app-external-label"
                  size="large"
                  backgroundColor="default1"
                  borderColor="default1"
                >
                  <Text size={1}>
                    <FormattedMessage {...appsMessages.externalApp} />
                  </Text>
                </Chip>
              )}
              {app.manifestUrl && isAppInTunnel(app.manifestUrl) ? (
                <Text size={2} color="default2" data-test-id="app-tunnel-label">
                  {`(${intl.formatMessage(messages.tunnelDevelopment)})`}
                </Text>
              ) : null}
            </Box>
            {app.manifestUrl && <AppManifestUrl manifestUrl={app.manifestUrl} />}
          </Box>
        </Box>
        <StopPropagation>
          <Box
            display="flex"
            marginTop={{ mobile: 1.5, desktop: 0 }}
            flexDirection="row"
            justifyContent={{ mobile: "flex-end", desktop: "flex-start" }}
            gap={3}
            onClick={e => e.preventDefault()}
            onMouseEnter={() => setIsMouseOverAlertIcons(true)}
            onMouseLeave={() => setIsMouseOverAlertIcons(false)}
          >
            <Box marginLeft="auto" display="flex" alignItems="center" gap={5}>
              {appAlertsEnabled ? (
                <AppRowDisabledAlert app={app} />
              ) : (
                !app.isActive && (
                  <Text size={2} color="default2">
                    <FormattedMessage {...messages.appDisabled} />
                  </Text>
                )
              )}

              {appAlertsEnabled && <AppRowWebhookIssueAlert app={app} />}
            </Box>
          </Box>
        </StopPropagation>
      </List.Item>
    </Link>
  );
};

export default InstalledAppListRow;
