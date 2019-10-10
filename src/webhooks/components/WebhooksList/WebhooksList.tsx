import Card from "@material-ui/core/Card";
import IconButton from "@material-ui/core/IconButton";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";
import { useIntl } from "react-intl";

import Skeleton from "@saleor/components/Skeleton";
import TablePagination from "@saleor/components/TablePagination";
import { maybe, renderCollection, stopPropagation } from "@saleor/misc";
import { ListProps } from "@saleor/types";
import { Webhooks_webhooks_edges_node } from "../../types/Webhooks";

export interface WebhooksListProps extends ListProps {
  webhooks: Webhooks_webhooks_edges_node[];
  onRemove: (id: string) => void;
}

const styles = (theme: Theme) =>
  createStyles({
    [theme.breakpoints.up("lg")]: {
      colAction: {
        "& svg": {
          color: theme.palette.primary.main
        },
        textAlign: "right"
      },
      colActive: {},
      colName: {}
    },
    colAction: {},
    colActive: {},
    colName: {},
    link: {
      cursor: "pointer"
    }
  });

const numberOfColumns = 4;

const WebhooksList = withStyles(styles, { name: "PluginList" })(
  ({
    classes,
    settings,
    webhooks,
    disabled,
    onNextPage,
    pageInfo,
    onRowClick,
    onRemove,
    onUpdateListSettings,
    onPreviousPage
  }: WebhooksListProps & WithStyles<typeof styles>) => {
    const intl = useIntl();
    return (
      <Card>
        <Table>
          <TableHead>
            <TableCell className={classes.colName} padding="dense">
              {intl.formatMessage({
                defaultMessage: "Name",
                description: "webhook name"
              })}
            </TableCell>
            <TableCell className={classes.colActive} padding="dense">
              {intl.formatMessage({
                defaultMessage: "Service Account",
                description: "webhook service account"
              })}
            </TableCell>
            <TableCell className={classes.colAction} padding="dense">
              {intl.formatMessage({
                defaultMessage: "Action",
                description: "user action bar"
              })}
            </TableCell>
          </TableHead>
          <TableFooter>
            <TableRow>
              <TablePagination
                colSpan={numberOfColumns}
                settings={settings}
                hasNextPage={
                  pageInfo && !disabled ? pageInfo.hasNextPage : false
                }
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
              webhooks,
              webhook => {
                return (
                  <TableRow
                    hover={!!webhook}
                    className={!!webhook ? classes.link : undefined}
                    onClick={webhook ? onRowClick(webhook.id) : undefined}
                    key={webhook ? webhook.id : "skeleton"}
                  >
                    <TableCell className={classes.colName}>
                      {maybe<React.ReactNode>(() => webhook.name, <Skeleton />)}
                    </TableCell>
                    <TableCell className={classes.colActive}>
                      {maybe<React.ReactNode>(
                        () => webhook.serviceAccount.name,
                        <Skeleton />
                      )}
                    </TableCell>
                    <TableCell className={classes.colAction}>
                      <IconButton
                        color="primary"
                        onClick={webhook ? onRowClick(webhook.id) : undefined}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="primary"
                        onClick={
                          webhook
                            ? stopPropagation(() => onRemove(webhook.id))
                            : undefined
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              },
              () => (
                <TableRow>
                  <TableCell colSpan={numberOfColumns}>
                    {intl.formatMessage({
                      defaultMessage: "No webhooks found"
                    })}
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </Card>
    );
  }
);
WebhooksList.displayName = "WebhooksList";
export default WebhooksList;
