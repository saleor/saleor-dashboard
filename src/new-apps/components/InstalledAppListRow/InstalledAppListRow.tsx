import Link from "@dashboard/components/Link";
import { TableButtonWrapper } from "@dashboard/components/TableButtonWrapper/TableButtonWrapper";
import { useAppListContext } from "@dashboard/new-apps/context";
import { appsMessages } from "@dashboard/new-apps/messages";
import { InstalledApp } from "@dashboard/new-apps/types";
import { AppUrls } from "@dashboard/new-apps/urls";
import { isAppInTunnel } from "@dashboard/new-apps/utils";
import { Pill } from "@saleor/macaw-ui";
import {
  Avatar,
  Box,
  Button,
  List,
  sprinkles,
  Text,
} from "@saleor/macaw-ui/next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import AppPermissions from "../AppPermissions";
import { messages } from "./messages";

export const InstalledAppListRow: React.FC<InstalledApp> = props => {
  const { app, isExternal, logo } = props;
  const intl = useIntl();
  const { openAppSettings } = useAppListContext();

  const avatarProps = {
    ...(logo?.source
      ? { src: logo.source }
      : { initials: app.name?.[0]?.toUpperCase() ?? "" }),
  };

  return (
    <List.Item
      padding={7}
      borderTopStyle="solid"
      borderWidth={1}
      borderColor="neutralPlain"
      className={sprinkles({
        justifyContent: "space-between",
        flexDirection: "row",
      })}
    >
      <Link
        href={AppUrls.resolveAppUrl(app.id)}
        className={sprinkles({ display: "contents" })}
        inline={false}
      >
        <Box display="flex" gap={5} alignItems="center">
          <Avatar.Store {...avatarProps} />
          <Text variant="bodyEmp">{app.name}</Text>
          <Text variant="body" color="textNeutralSubdued">
            {`v${app.version}`}
          </Text>
          {isExternal && (
            <Pill
              color="warning"
              label={intl.formatMessage(appsMessages.externalApp)}
              data-test-id="app-external-label"
            />
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
        <Box display="flex" flexDirection="row" gap={6}>
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
      </Link>
    </List.Item>
  );
};

export default InstalledAppListRow;
