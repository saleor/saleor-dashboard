import TableButtonWrapper from "@dashboard/components/TableButtonWrapper/TableButtonWrapper";
import { JobStatusEnum } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { useAppListContext } from "@dashboard/new-apps/context";
import {
  appInstallationStatusMessages,
  appsMessages,
} from "@dashboard/new-apps/messages";
import { AppInstallation } from "@dashboard/new-apps/types";
import { CircularProgress } from "@material-ui/core";
import { Indicator, Tooltip, TooltipMountWrapper } from "@saleor/macaw-ui";
import {
  Avatar,
  Box,
  Button,
  Chip,
  List,
  RemoveIcon,
  sprinkles,
  Text,
} from "@saleor/macaw-ui/next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "./styles";

export const NotInstalledAppListRow: React.FC<AppInstallation> = props => {
  const { appInstallation, isExternal, logo } = props;
  const intl = useIntl();
  const classes = useStyles(props);
  const { retryAppInstallation, removeAppInstallation } = useAppListContext();

  const avatarProps = {
    ...(logo?.source
      ? { src: logo.source }
      : { initials: appInstallation.appName?.[0]?.toUpperCase() ?? "" }),
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
      <Box display="flex" gap={5} alignItems="center">
        <Avatar.Store {...avatarProps} className={sprinkles({ padding: 4 })} />
        <Text variant="body">{appInstallation.appName}</Text>
        {isExternal && (
          <Chip data-test-id="app-external-label">
            <Text variant="caption" size="small">
              <FormattedMessage {...appsMessages.externalApp} />
            </Text>
          </Chip>
        )}
      </Box>
      <div className={classes.actions}>
        {appInstallation?.status === JobStatusEnum.PENDING && (
          <>
            <Text
              variant="caption"
              className={classes.pending}
              data-test-id="app-pending-label"
            >
              {intl.formatMessage(appInstallationStatusMessages.pending)}
            </Text>
            <div className={classes.colSpinner}>
              <CircularProgress size={20} />
            </div>
          </>
        )}
        {appInstallation?.status === JobStatusEnum.FAILED && (
          <>
            <Text
              variant="body"
              color="textCriticalSubdued"
              data-test-id="app-failed-label"
            >
              <Tooltip title={appInstallation.message} variant="error">
                <TooltipMountWrapper>
                  {/* TODO: Replace with WarningIcon */}
                  <Indicator icon="error" />
                </TooltipMountWrapper>
              </Tooltip>
              <FormattedMessage {...appInstallationStatusMessages.failed} />
            </Text>

            <Button
              variant="secondary"
              icon={<RemoveIcon />}
              onClick={() => removeAppInstallation(appInstallation.id)}
              data-test-id="app-installation-remove-button"
            />
            <TableButtonWrapper>
              <Button
                variant="secondary"
                onClick={() => retryAppInstallation(appInstallation.id)}
                data-test-id="app-installation-retry-button"
              >
                <FormattedMessage {...buttonMessages.retry} />
              </Button>
            </TableButtonWrapper>
          </>
        )}
      </div>
    </List.Item>
  );
};

export default NotInstalledAppListRow;
