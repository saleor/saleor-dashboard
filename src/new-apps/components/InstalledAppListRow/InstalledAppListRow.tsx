import Link from "@dashboard/components/Link";
import { TableButtonWrapper } from "@dashboard/components/TableButtonWrapper/TableButtonWrapper";
import { useAppListContext } from "@dashboard/new-apps/context";
import { appsMessages } from "@dashboard/new-apps/messages";
import { InstalledApp } from "@dashboard/new-apps/types";
import { AppUrls } from "@dashboard/new-apps/urls";
import { isAppInTunnel } from "@dashboard/new-apps/utils";
import {
  Box,
  Button,
  Chip,
  List,
  sprinkles,
  Text,
} from "@saleor/macaw-ui/next";
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
  const { openAppSettings } = useAppListContext();
  const location = useLocation();

  return (
    <Link
      href={AppUrls.resolveAppUrl(app.id)}
      state={{ from: location.pathname }}
      className={sprinkles({ display: "contents" })}
      inline={false}
    >
      <List.Item
        padding={7}
        borderTopStyle="solid"
        borderWidth={1}
        borderColor="neutralPlain"
        justifyContent="space-between"
        flexDirection="row"
        flexWrap="wrap"
      >
        <Box
          display="flex"
          justifyContent={{ mobile: "space-between", desktop: "flex-start" }}
          gap={5}
          alignItems="center"
        >
          <AppAvatar logo={logo} />
          <Box
            display="flex"
            gap={3}
            flexDirection="column"
            alignItems="flex-start"
          >
            <Box display="flex" gap={5}>
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
          marginTop={{ mobile: 4, desktop: 0 }}
          flexDirection="row"
          justifyContent={{ mobile: "flex-end", desktop: "flex-start" }}
          gap={6}
        >
          <AppPermissions permissions={app.permissions} />
          <TableButtonWrapper>
            <Button
              variant="secondary"
              onClick={() => openAppSettings(app.id)}
              data-test-id="app-settings-button"
            >
              <FormattedMessage {...messages.settings} />
            </Button>
          </TableButtonWrapper>
        </Box>
      </List.Item>
    </Link>
  );
};

export default InstalledAppListRow;
