import IconButton from "@material-ui/core/IconButton";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import React from "react";
import { useIntl } from "react-intl";

import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import TablePagination from "@saleor/components/TablePagination";
import { maybe, renderCollection, stopPropagation } from "@saleor/misc";
import { ListProps, SortPage } from "@saleor/types";
import { WebhookListUrlSortField } from "@saleor/webhooks/urls";
import TableCellHeader from "@saleor/components/TableCellHeader";
import { getArrowDirection } from "@saleor/utils/sort";
import { Webhooks_webhooks_edges_node } from "../../types/Webhooks";

export interface WebhooksListProps
  extends ListProps,
    SortPage<WebhookListUrlSortField> {
  webhooks: Webhooks_webhooks_edges_node[];
  onRemove: (id: string) => void;
}

const useStyles = makeStyles(
  theme => ({
    [theme.breakpoints.up("lg")]: {
      colAction: {
        "& svg": {
          color: theme.palette.primary.main
        },
        textAlign: "right" as "right"
      },
      colActive: {},
      colName: {
        "&&": {
          width: "auto"
        }
      }
    },
    colAction: {},
    colActive: {},
    colName: {
      paddingLeft: 0,
      width: 250
    },
    table: {
      tableLayout: "fixed"
    },
    tableRow: {
      cursor: "pointer"
    }
  }),
  { name: "WebhooksList" }
);

const numberOfColumns = 3;

const WebhooksList: React.FC<WebhooksListProps> = ({
  settings,
  webhooks,
  disabled,
  onNextPage,
  pageInfo,
  sort,
  onRowClick,
  onRemove,
  onSort,
  onUpdateListSettings,
  onPreviousPage
}) => {
  const intl = useIntl();
  const classes = useStyles({});

  return (
    <ResponsiveTable className={classes.table}>
      <TableHead>
        <TableRow>
          <TableCellHeader
            direction={
              sort.sort === WebhookListUrlSortField.name
                ? getArrowDirection(sort.asc)
                : undefined
            }
            arrowPosition="right"
            onClick={() => onSort(WebhookListUrlSortField.name)}
            className={classes.colName}
          >
            {intl.formatMessage({
              defaultMessage: "Name",
              description: "webhook name"
            })}
          </TableCellHeader>
          <TableCellHeader
            direction={
              sort.sort === WebhookListUrlSortField.serviceAccount
                ? getArrowDirection(sort.asc)
                : undefined
            }
            onClick={() => onSort(WebhookListUrlSortField.serviceAccount)}
            className={classes.colActive}
          >
            {intl.formatMessage({
              defaultMessage: "Service Account",
              description: "webhook service account"
            })}
          </TableCellHeader>
          <TableCell className={classes.colAction}>
            {intl.formatMessage({
              defaultMessage: "Action",
              description: "user action bar"
            })}
          </TableCell>
        </TableRow>
      </TableHead>
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
          webhooks,
          webhook => (
            <TableRow
              hover={!!webhook}
              className={!!webhook ? classes.tableRow : undefined}
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
          ),
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
    </ResponsiveTable>
  );
};
WebhooksList.displayName = "WebhooksList";
export default WebhooksList;
