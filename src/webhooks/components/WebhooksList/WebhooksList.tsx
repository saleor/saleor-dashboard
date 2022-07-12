import {
  Card,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { Button } from "@saleor/components/Button";
import CardTitle from "@saleor/components/CardTitle";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import { TableButtonWrapper } from "@saleor/components/TableButtonWrapper/TableButtonWrapper";
import TableCellHeader from "@saleor/components/TableCellHeader";
import TableRowLink from "@saleor/components/TableRowLink";
import { AppQuery } from "@saleor/graphql";
import { DeleteIcon, IconButton } from "@saleor/macaw-ui";
import { renderCollection, stopPropagation } from "@saleor/misc";
import { webhookPath } from "@saleor/webhooks/urls";
import { isUnnamed } from "@saleor/webhooks/utils";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "./styles";

export interface WebhooksListProps {
  webhooks: AppQuery["app"]["webhooks"];
  onRemove: (id: string) => void;
  createHref?: string;
}

const WebhooksList: React.FC<WebhooksListProps> = ({
  webhooks,
  createHref,
  onRemove,
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
          description: "header",
        })}
        toolbar={
          !!createHref && (
            <Button
              variant="secondary"
              href={createHref}
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
                description: "webhook name",
              })}
            </TableCellHeader>
            <TableCell
              className={classNames(classes.colAction, classes.colRight)}
            >
              {intl.formatMessage({
                id: "a/QJBx",
                defaultMessage: "Action",
                description: "user action bar",
              })}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {renderCollection(
            webhooks,
            webhook => (
              <TableRowLink
                hover={!!webhook}
                className={!!webhook ? classes.tableRow : undefined}
                href={webhook && webhookPath(webhook.id)}
                key={webhook ? webhook.id : "skeleton"}
              >
                <TableCell
                  className={classNames(classes.colName, {
                    [classes.colNameUnnamed]: isUnnamed(webhook),
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
                  <TableButtonWrapper>
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
                  </TableButtonWrapper>
                </TableCell>
              </TableRowLink>
            ),
            () => (
              <TableRow>
                <TableCell colSpan={numberOfColumns}>
                  {intl.formatMessage({
                    id: "wbjuR4",
                    defaultMessage: "No webhooks found",
                  })}
                </TableCell>
              </TableRow>
            ),
          )}
        </TableBody>
      </ResponsiveTable>
    </Card>
  );
};
WebhooksList.displayName = "WebhooksList";
export default WebhooksList;
