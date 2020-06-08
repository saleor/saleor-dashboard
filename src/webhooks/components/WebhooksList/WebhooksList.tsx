import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import IconButton from "@material-ui/core/IconButton";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from "@material-ui/icons/Delete";
import { App_app_webhooks } from "@saleor/apps/types/App";
import CardTitle from "@saleor/components/CardTitle";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import TableCellHeader from "@saleor/components/TableCellHeader";
import { renderCollection, stopPropagation } from "@saleor/misc";
import { isUnnamed } from "@saleor/webhooks/utils";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "./styles";

export interface WebhooksListProps {
  webhooks: App_app_webhooks[];
  onRemove: (id: string) => void;
  onRowClick: (id: string) => () => void;
  onCreate?: () => void;
}
const numberOfColumns = 3;

const WebhooksList: React.FC<WebhooksListProps> = ({
  webhooks,
  onCreate,
  onRowClick,
  onRemove
}) => {
  const intl = useIntl();
  const classes = useStyles({});

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Webhooks",
          description: "header"
        })}
        toolbar={
          !!onCreate && (
            <Button color="primary" onClick={onCreate}>
              <FormattedMessage
                defaultMessage="Create Webhook"
                description="button"
              />
            </Button>
          )
        }
      />
      <ResponsiveTable className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCellHeader>
              {intl.formatMessage({
                defaultMessage: "Name",
                description: "webhook name"
              })}
            </TableCellHeader>
            <TableCell
              className={classNames(classes.colAction, classes.colRight)}
            >
              {intl.formatMessage({
                defaultMessage: "Action",
                description: "user action bar"
              })}
            </TableCell>
          </TableRow>
        </TableHead>
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
                <TableCell
                  className={classNames(classes.colName, {
                    [classes.colNameUnnamed]: isUnnamed(webhook)
                  })}
                >
                  {isUnnamed(webhook) ? (
                    <FormattedMessage defaultMessage="Unnamed webhook" />
                  ) : (
                    webhook?.name || <Skeleton />
                  )}
                </TableCell>
                <TableCell
                  className={classNames(classes.colAction, classes.colRight)}
                >
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
    </Card>
  );
};
WebhooksList.displayName = "WebhooksList";
export default WebhooksList;
