import { TableButtonWrapper } from "@dashboard/components/TableButtonWrapper/TableButtonWrapper";
import TableCellAvatar from "@dashboard/components/TableCellAvatar";
import TableRowLink from "@dashboard/components/TableRowLink";
import { useAppListContext } from "@dashboard/new-apps/context";
import { appsMessages } from "@dashboard/new-apps/messages";
import { InstalledApp } from "@dashboard/new-apps/types";
import { AppUrls } from "@dashboard/new-apps/urls";
import { isAppInTunnel } from "@dashboard/new-apps/utils";
import { TableCell, Typography } from "@material-ui/core";
import { Pill } from "@saleor/macaw-ui";
import { Button } from "@saleor/macaw-ui/next";
import clsx from "clsx";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";
import { useStyles } from "./styles";

export const InstalledAppListRow: React.FC<InstalledApp> = props => {
  const { app, isExternal, logo } = props;
  const intl = useIntl();
  const classes = useStyles(props);
  const { openAppSettings } = useAppListContext();

  return (
    <TableRowLink className={classes.row} href={AppUrls.resolveAppUrl(app.id)}>
      <TableCellAvatar
        initials={app.name?.[0]?.toUpperCase()}
        thumbnail={logo?.source || undefined}
        avatarProps={classes.logo}
        className={clsx(classes.col, classes.colLogo)}
      >
        <div className={classes.mainContent}>
          <Typography variant="body1" className={classes.name}>
            {app.name}
          </Typography>
          <Typography variant="body1" className={classes.version}>
            {`v${app.version}`}
          </Typography>
          {isExternal && (
            <Pill
              color="warning"
              className={classes.externalAppLabel}
              label={intl.formatMessage(appsMessages.externalApp)}
              data-test-id="app-external-label"
            />
          )}
        </div>
      </TableCellAvatar>
      <TableCell className={clsx(classes.col, classes.colActions)}>
        <div className={classes.actions}>
          {app.manifestUrl && isAppInTunnel(app.manifestUrl) ? (
            <Typography
              variant="caption"
              className={classes.tunnel}
              data-test-id="app-tunnel-label"
            >
              {`(${intl.formatMessage(messages.tunnelDevelopment)})`}
            </Typography>
          ) : null}
          <TableButtonWrapper>
            <Button
              variant="secondary"
              onClick={() => openAppSettings(app.id)}
              data-test-id="app-settings-button"
            >
              <FormattedMessage {...messages.settings} />
            </Button>
          </TableButtonWrapper>
        </div>
      </TableCell>
    </TableRowLink>
  );
};

export default InstalledAppListRow;
