import {
  Card,
  Switch,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@material-ui/core";
import { useAppListContext } from "@saleor/apps/context";
import { appUrl } from "@saleor/apps/urls";
import CardTitle from "@saleor/components/CardTitle";
import { IconButton } from "@saleor/components/IconButton";
import { TableButtonWrapper } from "@saleor/components/TableButtonWrapper/TableButtonWrapper";
import TableRowLink from "@saleor/components/TableRowLink";
import { AppListItemFragment, AppsListQuery } from "@saleor/graphql";
import { DeleteIcon, ResponsiveTable } from "@saleor/macaw-ui";
import { renderCollection } from "@saleor/misc";
import { ListProps } from "@saleor/types";
import clsx from "clsx";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "../../styles";
import { AppPermissions } from "../AppPermissions/AppPermissions";
import AppsSkeleton from "../AppsSkeleton";

export interface InstalledAppsProps extends ListProps {
  appsList: AppsListQuery["apps"]["edges"];
  onRemove: (id: string) => void;
}

const InstalledApps: React.FC<InstalledAppsProps> = ({
  appsList,
  onRemove,
  ...props
}) => {
  const intl = useIntl();
  const classes = useStyles(props);
  const { activateApp, deactivateApp } = useAppListContext();

  const getHandleToggle = (app: AppListItemFragment) => () => {
    if (app.isActive) {
      deactivateApp(app.id);
    } else {
      activateApp(app.id);
    }
  };

  return (
    <Card className={classes.apps}>
      <CardTitle
        title={intl.formatMessage({
          id: "BvmnJq",
          defaultMessage: "Third Party Apps",
          description: "section header",
        })}
      />
      <ResponsiveTable>
        <TableBody>
          {renderCollection(
            appsList,
            (app, index) =>
              app ? (
                <TableRowLink
                  key={app.node.id}
                  className={classes.tableRow}
                  href={appUrl(app.node.id)}
                >
                  <TableCell className={classes.colName}>
                    <span data-tc="name" className={classes.appName}>
                      {app.node.name}
                    </span>
                  </TableCell>
                  <TableCell className={classes.colAction}>
                    {app.node.manifestUrl && (
                      <Typography
                        className={clsx(classes.text, classes.manifestUrl)}
                        variant="body2"
                      >
                        {app.node.manifestUrl}
                      </Typography>
                    )}
                    <TableButtonWrapper>
                      <Switch
                        checked={app.node.isActive}
                        onChange={getHandleToggle(app.node)}
                      />
                    </TableButtonWrapper>
                    <AppPermissions permissions={app.node.permissions} />
                    <TableButtonWrapper>
                      <IconButton
                        variant="secondary"
                        color="primary"
                        onClick={() => onRemove(app.node.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableButtonWrapper>
                  </TableCell>
                </TableRowLink>
              ) : (
                <AppsSkeleton key={index} />
              ),
            () => (
              <TableRow className={classes.tableRow}>
                <TableCell className={classes.colName}>
                  <Typography className={classes.text} variant="body2">
                    <FormattedMessage
                      id="9tgY4G"
                      defaultMessage="You don’t have any installed apps in your dashboard"
                      description="apps content"
                    />
                  </Typography>
                </TableCell>
              </TableRow>
            ),
          )}
        </TableBody>
      </ResponsiveTable>
    </Card>
  );
};

InstalledApps.displayName = "InstalledApps";
export default InstalledApps;
