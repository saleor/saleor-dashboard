import {
  Card,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import TableCellHeader from "@saleor/components/TableCellHeader";
import { AppQuery } from "@saleor/graphql";
import { Button, DeleteIcon, IconButton } from "@saleor/macaw-ui";
import { renderCollection, stopPropagation } from "@saleor/misc";
import { isUnnamed } from "@saleor/webhooks/utils";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "./styles";

export interface WebhooksListProps {
  webhooks: AppQuery["app"]["webhooks"];
  onRemove: (id: string) => void;
  onRowClick: (id: string) => () => void;
  onCreate?: () => void;
}

const WebhooksList: React.FC<WebhooksListProps> = ({
  webhooks,
  onCreate,
  onRowClick,
  onRemove
}) => {
  const intl = useIntl();
  const classes = useStyles({});
  const numberOfColumns = webhooks?.length === 0 ? 2 : 3;

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          id: "jqnwW9",
          defaultMessage: "Webhooks",
          description: "header"
        })}
        toolbar={
          !!onCreate && (
            <Button
              variant="secondary"
              onClick={onCreate}
              data-test-id="create-webhook"
            >
              <FormattedMessage
                id="wlr0Si"
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
                id: "OTpV1t",
                defaultMessage: "Name",
                description: "webhook name"
              })}
            </TableCellHeader>
            <TableCell
              className={classNames(classes.colAction, classes.colRight)}
            >
              {intl.formatMessage({
                id: "a/QJBx",
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
                    <FormattedMessage
                      id="1eCau/"
                      defaultMessage="Unnamed webhook"
                    />
                  ) : (
                    webhook?.name || <Skeleton />
                  )}
                </TableCell>
                <TableCell
                  className={classNames(classes.colAction, classes.colRight)}
                >
                  <IconButton
                    variant="secondary"
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
                    id: "wbjuR4",
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
