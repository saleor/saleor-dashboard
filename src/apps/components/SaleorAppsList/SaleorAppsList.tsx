import {
  Card,
  Switch,
  TableBody,
  TableCell,
  Typography,
} from "@material-ui/core";
import { useAppListContext } from "@saleor/apps/context";
import { SaleorApp } from "@saleor/apps/hooks/useSaleorApps";
import { appUrl, createAppInstallUrl } from "@saleor/apps/urls";
import CardTitle from "@saleor/components/CardTitle";
import { IconButton } from "@saleor/components/IconButton";
import { TableButtonWrapper } from "@saleor/components/TableButtonWrapper/TableButtonWrapper";
import TableRowLink from "@saleor/components/TableRowLink";
import { AppListItemFragment, AppsListQuery } from "@saleor/graphql";
import useNavigator from "@saleor/hooks/useNavigator";
import { DeleteIcon, ResponsiveTable } from "@saleor/macaw-ui";
import { renderCollection } from "@saleor/misc";
import { ListProps } from "@saleor/types";
import React, { useCallback, useMemo } from "react";
import { FormattedMessage } from "react-intl";

import { useStyles } from "../../styles";
import { AppPermissions } from "../AppPermissions/AppPermissions";
import AppsSkeleton from "../AppsSkeleton";

export interface InstalledAppsProps extends ListProps {
  installedApps: AppsListQuery["apps"]["edges"];
  availableApps: SaleorApp[];
  onRemove: (id: string) => void;
  title: string;
}

const SaleorAppsList: React.FC<InstalledAppsProps> = ({
  installedApps,
  onRemove,
  title,
  availableApps,
  ...props
}) => {
  const classes = useStyles(props);
  const { activateApp, deactivateApp } = useAppListContext();
  const navigate = useNavigator();

  const navigateToAppInstallPage = useCallback(
    (url: string) => {
      navigate(createAppInstallUrl(url));
    },
    [navigate],
  );

  const getHandleToggle = (app: AppListItemFragment) => () => {
    if (app.isActive) {
      deactivateApp(app.id);
    } else {
      activateApp(app.id);
    }
  };

  const installedSaleorApps = useMemo(
    () =>
      installedApps.filter(app =>
        availableApps.find(
          saleorApp => app.node?.manifestUrl === saleorApp.manifestUrl,
        ),
      ),
    [availableApps, installedApps],
  );

  const notInstalledSaleorApps = useMemo(
    () =>
      availableApps.filter(
        availableApp =>
          !installedApps.find(
            installedApp =>
              installedApp.node.manifestUrl === availableApp.manifestUrl,
          ),
      ),
    [availableApps, installedApps],
  );

  return (
    <>
      <Card className={classes.apps}>
        <CardTitle title={title} />
        <ResponsiveTable>
          <TableBody>
            {renderCollection(
              installedSaleorApps,
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
                <TableRowLink className={classes.tableRow}>
                  <TableCell className={classes.colName}>
                    <Typography className={classes.text} variant="body2">
                      <FormattedMessage
                        id="9tgY4G"
                        defaultMessage="You don’t have any installed apps in your dashboard"
                        description="apps content"
                      />
                    </Typography>
                  </TableCell>
                </TableRowLink>
              ),
            )}
          </TableBody>
        </ResponsiveTable>
      </Card>

      <Card className={classes.apps}>
        <CardTitle title="Available Saleor Apps" />
        <ResponsiveTable>
          <TableBody>
            {renderCollection(
              notInstalledSaleorApps,
              (app, index) =>
                app ? (
                  <TableRowLink
                    key={app.manifestUrl}
                    className={classes.tableRow}
                    onClick={() => navigateToAppInstallPage(app.manifestUrl)}
                  >
                    <TableCell className={classes.colName}>
                      <span data-tc="name" className={classes.appName}>
                        {app.name}
                      </span>
                    </TableCell>
                  </TableRowLink>
                ) : (
                  <AppsSkeleton key={index} />
                ),
              () => (
                <TableRowLink className={classes.tableRow}>
                  <TableCell className={classes.colName}>
                    <Typography className={classes.text} variant="body2">
                      <FormattedMessage
                        id="9tgY4G"
                        defaultMessage="You don’t have any installed apps in your dashboard"
                        description="apps content"
                      />
                    </Typography>
                  </TableCell>
                </TableRowLink>
              ),
            )}
          </TableBody>
        </ResponsiveTable>
      </Card>
    </>
  );
};

SaleorAppsList.displayName = "InstalledApps";
export default SaleorAppsList;
