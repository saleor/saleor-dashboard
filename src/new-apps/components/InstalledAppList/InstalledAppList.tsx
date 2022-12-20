import {
  Switch,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableRow,
  Typography,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { TableButtonWrapper } from "@saleor/components/TableButtonWrapper/TableButtonWrapper";
import TableCellAvatar from "@saleor/components/TableCellAvatar";
import { TablePaginationWithContext } from "@saleor/components/TablePagination";
import TableRowLink from "@saleor/components/TableRowLink";
import { AppListItemFragment } from "@saleor/graphql";
import { DeleteIcon, IconButton, Pill } from "@saleor/macaw-ui";
import { useAppListContext } from "@saleor/new-apps/context";
import { InstalledApp } from "@saleor/new-apps/types";
import { AppUrls } from "@saleor/new-apps/urls";
import { isAppInTunnel } from "@saleor/new-apps/utils";
import { ListProps } from "@saleor/types";
import clsx from "clsx";
import React from "react";
import { useIntl } from "react-intl";

import AppManifestTableDisplay from "../AppManifestTableDisplay";
import { AppPermissions } from "../AppPermissions";
import { messages } from "./messages";
import { useStyles } from "./styles";

interface InstalledAppListProps extends ListProps {
  appList?: InstalledApp[];
  onRemove: (id: string) => void;
}

const InstalledAppList: React.FC<InstalledAppListProps> = ({
  appList,
  disabled,
  settings,
  onRemove,
  onUpdateListSettings,
}) => {
  const intl = useIntl();
  const classes = useStyles();
  const { activateApp, deactivateApp } = useAppListContext();

  const getHandleToggle = (app: AppListItemFragment) => () => {
    if (app.isActive) {
      deactivateApp(app.id);
    } else {
      activateApp(app.id);
    }
  };

  if (!appList) {
    return <Skeleton />;
  }

  return (
    <Table className={classes.table}>
      <TableBody>
        {appList.map(({ app, isExternal }) => (
          <TableRowLink
            key={app.id}
            className={classes.row}
            href={AppUrls.resolveAppUrl(app.id)}
          >
            <TableCellAvatar
              initials={app.name[0]?.toUpperCase()}
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
                  <Typography variant="caption" className={classes.tunnel}>
                    {`(${intl.formatMessage(messages.tunnelDevelopment)})`}
                  </Typography>
                ) : null}
                <TableButtonWrapper>
                  <Switch
                    checked={app.isActive}
                    onChange={getHandleToggle(app)}
                  />
                </TableButtonWrapper>
                <AppPermissions permissions={app.permissions} />
                <TableButtonWrapper>
                  <IconButton
                    variant="secondary"
                    color="primary"
                    onClick={() => onRemove(app.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableButtonWrapper>
              </div>
            </TableCell>
          </TableRowLink>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TablePaginationWithContext
            disabled={disabled}
            settings={settings}
            onUpdateListSettings={onUpdateListSettings}
          />
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default InstalledAppList;
