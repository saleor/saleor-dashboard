import {
  Card,
  TableBody,
  TableCell,
  TableFooter,
  TableRow,
  Typography
} from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import TablePagination from "@saleor/components/TablePagination";
import { DeleteIcon, ResponsiveTable } from "@saleor/macaw-ui";
import { Button, IconButton } from "@saleor/macaw-ui";
import { renderCollection, stopPropagation } from "@saleor/misc";
import { ListProps } from "@saleor/types";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "../../styles";
import { AppsList_apps_edges } from "../../types/AppsList";
import AppsSkeleton from "../AppsSkeleton";
import DeactivatedText from "../DeactivatedText";

export interface InstalledAppsProps extends ListProps {
  appsList: AppsList_apps_edges[];
  onRemove: (id: string) => void;
  onRowAboutClick: (id: string) => () => void;
}
const numberOfColumns = 2;

const InstalledApps: React.FC<InstalledAppsProps> = ({
  appsList,
  onRemove,
  settings,
  disabled,
  onNextPage,
  onPreviousPage,
  onRowClick,
  onRowAboutClick,
  onUpdateListSettings,
  pageInfo,
  ...props
}) => {
  const intl = useIntl();
  const classes = useStyles(props);

  return (
    <Card className={classes.apps}>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Third-party Apps",
          description: "section header"
        })}
      />
      <ResponsiveTable>
        <TableFooter>
          <TableRow>
            <TablePagination
              colSpan={numberOfColumns}
              settings={settings}
              hasNextPage={pageInfo && !disabled ? pageInfo.hasNextPage : false}
              onNextPage={onNextPage}
              onUpdateListSettings={onUpdateListSettings}
              hasPreviousPage={
                pageInfo && !disabled ? pageInfo.hasPreviousPage : false
              }
              onPreviousPage={onPreviousPage}
            />
          </TableRow>
        </TableFooter>
        <TableBody>
          {renderCollection(
            appsList,
            (app, index) =>
              app ? (
                <TableRow
                  key={app.node.id}
                  className={classes.tableRow}
                  onClick={onRowClick(app.node.id)}
                >
                  <TableCell className={classes.colName}>
                    <span data-tc="name" className={classes.appName}>
                      {app.node.name}
                    </span>
                    {!app.node.isActive && (
                      <div className={classes.statusWrapper}>
                        <DeactivatedText />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className={classes.colAction}>
                    <Button
                      onClick={stopPropagation(onRowAboutClick(app.node.id))}
                    >
                      <FormattedMessage
                        defaultMessage="About"
                        description="about app"
                      />
                    </Button>
                    <IconButton
                      variant="secondary"
                      color="primary"
                      onClick={stopPropagation(() => onRemove(app.node.id))}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ) : (
                <AppsSkeleton key={index} />
              ),
            () => (
              <TableRow className={classes.tableRow}>
                <TableCell className={classes.colName}>
                  <Typography className={classes.text} variant="body2">
                    <FormattedMessage
                      defaultMessage="You don’t have any installed apps in your dashboard"
                      description="apps content"
                    />
                  </Typography>
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </ResponsiveTable>
    </Card>
  );
};

InstalledApps.displayName = "InstalledApps";
export default InstalledApps;
