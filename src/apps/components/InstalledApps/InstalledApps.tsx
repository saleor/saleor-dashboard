import {
  Card,
  TableBody,
  TableCell,
  TableFooter,
  TableRow,
  Typography
} from "@material-ui/core";
import { appDetailsUrl, appUrl } from "@saleor/apps/urls";
import { Button } from "@saleor/components/Button";
import CardTitle from "@saleor/components/CardTitle";
import { IconButton } from "@saleor/components/IconButton";
import { TableButtonWrapper } from "@saleor/components/TableButtonWrapper/TableButtonWrapper";
import { TablePaginationWithContext } from "@saleor/components/TablePagination";
import TableRowLink from "@saleor/components/TableRowLink";
import { AppsListQuery } from "@saleor/graphql";
import { DeleteIcon, ResponsiveTable } from "@saleor/macaw-ui";
import { renderCollection } from "@saleor/misc";
import { ListProps } from "@saleor/types";
import clsx from "clsx";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "../../styles";
import AppsSkeleton from "../AppsSkeleton";
import DeactivatedText from "../DeactivatedText";

export interface InstalledAppsProps extends ListProps {
  appsList: AppsListQuery["apps"]["edges"];
  onRemove: (id: string) => void;
}
const numberOfColumns = 2;

const InstalledApps: React.FC<InstalledAppsProps> = ({
  appsList,
  onRemove,
  settings,
  disabled,
  onUpdateListSettings,
  ...props
}) => {
  const intl = useIntl();
  const classes = useStyles(props);

  return (
    <Card className={classes.apps}>
      <CardTitle
        title={intl.formatMessage({
          id: "ZeD2TK",
          defaultMessage: "Third-party Apps",
          description: "section header"
        })}
      />
      <ResponsiveTable>
        <TableFooter>
          <TableRow>
            <TablePaginationWithContext
              colSpan={numberOfColumns}
              settings={settings}
              onUpdateListSettings={onUpdateListSettings}
            />
          </TableRow>
        </TableFooter>
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
                    {!app.node.isActive && (
                      <div className={classes.statusWrapper}>
                        <DeactivatedText />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className={classes.colAction}>
                    {app.node.appUrl && (
                      <Typography
                        className={clsx(classes.text, classes.appUrl)}
                        variant="body2"
                      >
                        {app.node.appUrl}
                      </Typography>
                    )}
                    <TableButtonWrapper>
                      <Button href={appDetailsUrl(app.node.id)}>
                        <FormattedMessage
                          id="TBaMo2"
                          defaultMessage="About"
                          description="about app"
                        />
                      </Button>
                    </TableButtonWrapper>
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
            )
          )}
        </TableBody>
      </ResponsiveTable>
    </Card>
  );
};

InstalledApps.displayName = "InstalledApps";
export default InstalledApps;
