import { useAppListContext } from "@dashboard/apps/context";
import { appInstallationStatusMessages, appsMessages } from "@dashboard/apps/messages";
import { AppInstallation } from "@dashboard/apps/types";
import TableButtonWrapper from "@dashboard/components/TableButtonWrapper/TableButtonWrapper";
import { JobStatusEnum } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { CircularProgress } from "@material-ui/core";
import {
  Box,
  Button,
  Chip,
  List,
  Text,
  Tooltip,
  TrashBinIcon,
  WarningIcon,
} from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { AppAvatar } from "../AppAvatar/AppAvatar";
import { useStyles } from "./styles";

export const NotInstalledAppListRow: React.FC<AppInstallation> = props => {
  const { appInstallation, isExternal, logo } = props;
  const intl = useIntl();
  const classes = useStyles(props);
  const { retryAppInstallation, removeAppInstallation } = useAppListContext();

  return (
    <List.Item
      padding={4}
      borderTopStyle="solid"
      borderWidth={1}
      borderColor="default1"
      justifyContent="space-between"
      flexDirection="row"
      flexWrap={{ mobile: "wrap", desktop: "nowrap" }}
    >
      <Box
        display="flex"
        gap={2}
        alignItems="center"
        justifyContent={{ mobile: "space-between", desktop: "flex-start" }}
      >
        <AppAvatar logo={logo} />
        <Text size={4} fontWeight="bold">
          {appInstallation.appName}
        </Text>
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
      </Box>
      <div className={classes.actions}>
        {appInstallation?.status === JobStatusEnum.PENDING && (
          <>
            <Text size={2} className={classes.pending} data-test-id="app-pending-label">
              {intl.formatMessage(appInstallationStatusMessages.pending)}
            </Text>
            <div className={classes.colSpinner}>
              <CircularProgress size={20} />
            </div>
          </>
        )}
        {appInstallation?.status === JobStatusEnum.FAILED && (
          <>
            <Tooltip>
              <Tooltip.Trigger>
                <Box display="flex" placeItems="center" gap={1} marginX={1}>
                  <WarningIcon size="small" color="critical1" />
                  <Text size={1} color="critical2" data-test-id="app-failed-label">
                    <FormattedMessage {...appInstallationStatusMessages.failed} />
                  </Text>
                </Box>
              </Tooltip.Trigger>
              <Tooltip.Content>
                <Tooltip.Arrow />
                {appInstallation.message}
              </Tooltip.Content>
            </Tooltip>
            <Button
              variant="secondary"
              icon={<TrashBinIcon />}
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
