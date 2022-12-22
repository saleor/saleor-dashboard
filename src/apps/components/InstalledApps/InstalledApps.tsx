import {
  Card,
  Switch,
  TableBody,
  TableCell,
  Typography,
} from "@material-ui/core";
import { AppManifestTableDisplay } from "@saleor/apps/components/AppManifestTableDisplay/AppManifestTableDisplay";
import { InstallWithManifestFormButton } from "@saleor/apps/components/InstallWithManifestFormButton";
import { useAppListContext } from "@saleor/apps/context";
import { appUrl, createAppInstallUrl } from "@saleor/apps/urls";
import { isAppInTunnel } from "@saleor/apps/utils";
import CardTitle from "@saleor/components/CardTitle";
import { IconButton } from "@saleor/components/IconButton";
import { TableButtonWrapper } from "@saleor/components/TableButtonWrapper/TableButtonWrapper";
import TableRowLink from "@saleor/components/TableRowLink";
import { AppListItemFragment } from "@saleor/graphql";
import useNavigator from "@saleor/hooks/useNavigator";
import { DeleteIcon, ResponsiveTable } from "@saleor/macaw-ui";
import { renderCollection } from "@saleor/misc";
import { ListProps } from "@saleor/types";
import React, { useCallback } from "react";
import { FormattedMessage } from "react-intl";

import { useStyles } from "../../styles";
import { AppPermissions } from "../AppPermissions/AppPermissions";
import AppsSkeleton from "../AppsSkeleton";

export interface InstalledAppsProps extends ListProps {
  appsList: AppListItemFragment[];
  onRemove: (id: string) => void;
  displayQuickManifestButton?: boolean;
  title: string;
}

const InstalledApps: React.FC<InstalledAppsProps> = ({
  appsList,
  onRemove,
  title,
  displayQuickManifestButton = false,
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

  return (
    <Card className={classes.apps}>
      <CardTitle
        title={title}
        toolbar={
          displayQuickManifestButton ? (
            <InstallWithManifestFormButton
              onSubmitted={navigateToAppInstallPage}
            />
          ) : (
            undefined
          )
        }
      />
      <ResponsiveTable>
        <TableBody>
          {renderCollection(
            appsList,
            (app, index) =>
              app ? (
                <TableRowLink
                  key={app.id}
                  className={classes.tableRow}
                  href={appUrl(app.id)}
                >
                  <TableCell className={classes.colName}>
                    <span data-tc="name" className={classes.appName}>
                      {app.name}
                    </span>
                    {app.manifestUrl && isAppInTunnel(app.manifestUrl) ? (
                      <Typography variant="caption">
                        <FormattedMessage
                          defaultMessage="(TUNNEL - DEVELOPMENT)"
                          id="QdQ9z7"
                        />
                      </Typography>
                    ) : null}
                  </TableCell>

                  <TableCell className={classes.colAction}>
                    {app.manifestUrl && (
                      <AppManifestTableDisplay manifestUrl={app.manifestUrl} />
                    )}
                    <TableButtonWrapper>
                      <Switch
                        checked={app?.isActive || false}
                        onChange={getHandleToggle(app)}
                      />
                    </TableButtonWrapper>
                    <AppPermissions permissions={app.permissions || []} />
                    <TableButtonWrapper>
                      <IconButton
                        variant="secondary"
                        color="primary"
                        onClick={() => onRemove(app.id)}
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
  );
};

InstalledApps.displayName = "InstalledApps";
export default InstalledApps;
