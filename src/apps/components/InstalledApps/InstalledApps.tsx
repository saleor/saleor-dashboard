import { AppManifestTableDisplay } from "@dashboard/apps/components/AppManifestTableDisplay/AppManifestTableDisplay";
import { InstallWithManifestFormButton } from "@dashboard/apps/components/InstallWithManifestFormButton";
import { appUrl, createAppInstallUrl } from "@dashboard/apps/urls";
import { isAppInTunnel } from "@dashboard/apps/utils";
import CardTitle from "@dashboard/components/CardTitle";
import { IconButton } from "@dashboard/components/IconButton";
import { TableButtonWrapper } from "@dashboard/components/TableButtonWrapper/TableButtonWrapper";
import TableRowLink from "@dashboard/components/TableRowLink";
import { AppListItemFragment } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { renderCollection } from "@dashboard/misc";
import { ListProps } from "@dashboard/types";
import { Card, TableBody, TableCell, Typography } from "@material-ui/core";
import { ResponsiveTable, SettingsIcon } from "@saleor/macaw-ui";
import React, { useCallback } from "react";
import { FormattedMessage } from "react-intl";

import { useStyles } from "../../styles";
import { AppPermissions } from "../AppPermissions/AppPermissions";
import AppsSkeleton from "../AppsSkeleton";

export interface InstalledAppsProps extends ListProps {
  appsList: AppListItemFragment[];
  onSettingsClick: (id: string) => void;
  displayQuickManifestButton?: boolean;
  title: string;
}

const InstalledApps: React.FC<InstalledAppsProps> = ({
  appsList,
  onSettingsClick,
  title,
  displayQuickManifestButton = false,
  ...props
}) => {
  const classes = useStyles(props);
  const navigate = useNavigator();

  const navigateToAppInstallPage = useCallback(
    (url: string) => {
      navigate(createAppInstallUrl(url));
    },
    [navigate],
  );

  return (
    <Card className={classes.apps}>
      <CardTitle
        title={title}
        toolbar={
          displayQuickManifestButton ? (
            <InstallWithManifestFormButton onSubmitted={navigateToAppInstallPage} />
          ) : undefined
        }
      />
      <ResponsiveTable>
        <TableBody>
          {renderCollection(
            appsList,
            (app, index) =>
              app ? (
                <TableRowLink key={app.id} className={classes.tableRow} href={appUrl(app.id)}>
                  <TableCell className={classes.colName}>
                    <span data-tc="name" className={classes.appName}>
                      {app.name}
                    </span>
                    {app.manifestUrl && isAppInTunnel(app.manifestUrl) ? (
                      <Typography variant="caption">
                        <FormattedMessage defaultMessage="(TUNNEL - DEVELOPMENT)" id="QdQ9z7" />
                      </Typography>
                    ) : null}
                  </TableCell>

                  <TableCell className={classes.colAction}>
                    {app.manifestUrl && <AppManifestTableDisplay manifestUrl={app.manifestUrl} />}
                    <AppPermissions permissions={app.permissions || []} />
                    <TableButtonWrapper>
                      <IconButton
                        variant="secondary"
                        color="primary"
                        onClick={() => onSettingsClick(app.id)}
                      >
                        <SettingsIcon />
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
  );
};

InstalledApps.displayName = "InstalledApps";
export default InstalledApps;
