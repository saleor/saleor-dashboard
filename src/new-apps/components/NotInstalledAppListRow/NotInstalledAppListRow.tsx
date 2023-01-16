import TableButtonWrapper from "@dashboard/components/TableButtonWrapper/TableButtonWrapper";
import TableCellAvatar from "@dashboard/components/TableCellAvatar";
import TableRowLink from "@dashboard/components/TableRowLink";
import { AppInstallationFragment, JobStatusEnum } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { useAppListContext } from "@dashboard/new-apps/context";
import { appInstallationStatusMessages } from "@dashboard/new-apps/messages";
import { CircularProgress, TableCell, Typography } from "@material-ui/core";
import {
  Button,
  DeleteIcon,
  IconButton,
  Indicator,
  Tooltip,
  TooltipMountWrapper,
} from "@saleor/macaw-ui";
import clsx from "clsx";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import AppManifestTableDisplay from "../AppManifestTableDisplay";
import { useStyles } from "./styles";

export interface NotInstalledAppListRowProps {
  appInstallation: AppInstallationFragment;
}

export const NotInstalledAppListRow: React.FC<NotInstalledAppListRowProps> = ({
  appInstallation,
}) => {
  const intl = useIntl();
  const classes = useStyles();
  const { retryAppInstallation, removeAppInstallation } = useAppListContext();

  return (
    <TableRowLink>
      <TableCellAvatar
        initials={appInstallation.appName?.[0]?.toUpperCase()}
        thumbnail={undefined}
        className={clsx(classes.col, classes.colLogo)}
      >
        <div className={classes.mainContent}>
          <Typography variant="body1" className={classes.name}>
            {appInstallation.appName}
          </Typography>
        </div>
        {appInstallation.manifestUrl && (
          <AppManifestTableDisplay manifestUrl={appInstallation.manifestUrl} />
        )}
      </TableCellAvatar>
      <TableCell className={clsx(classes.col, classes.colActions)}>
        <div className={classes.actions}>
          {appInstallation?.status === JobStatusEnum.PENDING && (
            <>
              <Typography
                variant="caption"
                className={classes.pending}
                data-test-id="app-pending-label"
              >
                {intl.formatMessage(appInstallationStatusMessages.pending)}
              </Typography>
              <div className={classes.colSpinner}>
                <CircularProgress size={20} />
              </div>
            </>
          )}
          {appInstallation?.status === JobStatusEnum.FAILED && (
            <>
              <Typography
                variant="body2"
                className={classes.failed}
                data-test-id="app-failed-label"
              >
                <FormattedMessage {...appInstallationStatusMessages.failed} />
                <Tooltip title={appInstallation.message} variant="error">
                  <TooltipMountWrapper>
                    <Indicator icon="error" />
                  </TooltipMountWrapper>
                </Tooltip>
              </Typography>
              <TableButtonWrapper>
                <Button
                  variant="secondary"
                  color="primary"
                  onClick={() => retryAppInstallation(appInstallation.id)}
                  data-test-id="app-installation-retry-button"
                >
                  <FormattedMessage {...buttonMessages.retry} />
                </Button>
              </TableButtonWrapper>
              <TableButtonWrapper>
                <IconButton
                  variant="secondary"
                  color="primary"
                  onClick={() => removeAppInstallation(appInstallation.id)}
                  data-test-id="app-installation-remove-button"
                >
                  <DeleteIcon />
                </IconButton>
              </TableButtonWrapper>
            </>
          )}
        </div>
      </TableCell>
    </TableRowLink>
  );
};

export default NotInstalledAppListRow;
