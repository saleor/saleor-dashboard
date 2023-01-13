import { Switch, TableCell, Typography } from "@material-ui/core";
import { TableButtonWrapper } from "@saleor/components/TableButtonWrapper/TableButtonWrapper";
import TableCellAvatar from "@saleor/components/TableCellAvatar";
import TableRowLink from "@saleor/components/TableRowLink";
import { DeleteIcon, IconButton, Pill } from "@saleor/macaw-ui";
import { useAppListContext } from "@saleor/new-apps/context";
import { InstalledApp } from "@saleor/new-apps/types";
import { AppUrls } from "@saleor/new-apps/urls";
import { isAppInTunnel } from "@saleor/new-apps/utils";
import clsx from "clsx";
import React from "react";
import { useIntl } from "react-intl";

import AppManifestTableDisplay from "../AppManifestTableDisplay";
import { AppPermissions } from "../AppPermissions";
import { messages } from "./messages";
import { useStyles } from "./styles";

export const InstalledAppListRow: React.FC<InstalledApp> = ({
  app,
  isExternal,
}) => {
  const intl = useIntl();
  const classes = useStyles();
  const { activateApp, deactivateApp, removeApp } = useAppListContext();

  const handleToggleActive = () => {
    if (app.isActive) {
      deactivateApp(app.id);
    } else {
      activateApp(app.id);
    }
  };

  return (
    <TableRowLink className={classes.row} href={AppUrls.resolveAppUrl(app.id)}>
      <TableCellAvatar
        initials={app.name?.[0]?.toUpperCase()}
        thumbnail={undefined}
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
              label={intl.formatMessage(messages.externalApp)}
              data-test-id="app-external-label"
            />
          )}
        </div>
        {app.manifestUrl && (
          <AppManifestTableDisplay manifestUrl={app.manifestUrl} />
        )}
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
            <Switch
              checked={!!app.isActive}
              onChange={handleToggleActive}
              data-test-id="app-active-switch"
            />
          </TableButtonWrapper>
          <AppPermissions permissions={app.permissions} />
          <TableButtonWrapper>
            <IconButton
              variant="secondary"
              color="primary"
              onClick={() => removeApp(app.id)}
              data-test-id="app-remove-button"
            >
              <DeleteIcon />
            </IconButton>
          </TableButtonWrapper>
        </div>
      </TableCell>
    </TableRowLink>
  );
};

export default InstalledAppListRow;
