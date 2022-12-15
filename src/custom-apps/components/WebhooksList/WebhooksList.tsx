import { Card, TableBody, TableCell, TableHead } from "@material-ui/core";
import { Button } from "@saleor/components/Button";
import CardTitle from "@saleor/components/CardTitle";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import { TableButtonWrapper } from "@saleor/components/TableButtonWrapper/TableButtonWrapper";
import TableCellHeader from "@saleor/components/TableCellHeader";
import TableRowLink from "@saleor/components/TableRowLink";
import { CustomAppUrls } from "@saleor/custom-apps/urls";
import { isUnnamed } from "@saleor/custom-apps/utils";
import { WebhookFragment } from "@saleor/graphql";
import {
  commonMessages,
  commonStatusMessages,
  sectionNames,
} from "@saleor/intl";
import { DeleteIcon, IconButton, Pill } from "@saleor/macaw-ui";
import { renderCollection, stopPropagation } from "@saleor/misc";
import clsx from "clsx";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";
import { useStyles } from "./styles";

export interface WebhooksListProps {
  webhooks: WebhookFragment[];
  onRemove: (id: string) => void;
  createHref?: string;
}

const WebhooksList: React.FC<WebhooksListProps> = ({
  webhooks,
  createHref,
  onRemove,
}) => {
  const intl = useIntl();
  const classes = useStyles();
  const numberOfColumns = webhooks?.length === 0 ? 2 : 3;

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage(sectionNames.webhooksAndEvents)}
        toolbar={
          !!createHref && (
            <Button
              variant="secondary"
              href={createHref}
              data-test-id="create-webhook"
            >
              <FormattedMessage {...messages.createWebhook} />
            </Button>
          )
        }
      />
      <ResponsiveTable className={classes.table}>
        <TableHead>
          <TableRowLink>
            <TableCellHeader>
              {intl.formatMessage(commonMessages.name)}
            </TableCellHeader>
            <TableCellHeader>
              {intl.formatMessage(commonMessages.status)}
            </TableCellHeader>
            <TableCell className={clsx(classes.colAction, classes.colRight)}>
              <FormattedMessage {...messages.action} />
            </TableCell>
          </TableRowLink>
        </TableHead>
        <TableBody>
          {renderCollection(
            webhooks,
            webhook => (
              <TableRowLink
                hover={!!webhook}
                className={!!webhook ? classes.tableRow : undefined}
                href={
                  webhook &&
                  CustomAppUrls.resolveWebhookUrl(webhook.app.id, webhook.id)
                }
                key={webhook ? webhook.id : "skeleton"}
              >
                <TableCell
                  className={clsx(classes.colName, {
                    [classes.colNameUnnamed]: isUnnamed(webhook),
                  })}
                >
                  {isUnnamed(webhook) ? (
                    <FormattedMessage {...messages.unnamedWebhook} />
                  ) : (
                    webhook?.name || <Skeleton />
                  )}
                </TableCell>
                <TableCell>
                  {webhook ? (
                    <Pill
                      label={
                        webhook.isActive
                          ? intl.formatMessage(commonStatusMessages.active)
                          : intl.formatMessage(commonStatusMessages.notActive)
                      }
                      color={webhook.isActive ? "success" : "error"}
                    />
                  ) : (
                    <Skeleton />
                  )}
                </TableCell>
                <TableCell
                  className={clsx(classes.colAction, classes.colRight)}
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
              <TableRowLink>
                <TableCell colSpan={numberOfColumns}>
                  {intl.formatMessage(messages.noWebhooks)}
                </TableCell>
              </TableRowLink>
            ),
          )}
        </TableBody>
      </ResponsiveTable>
    </Card>
  );
};
WebhooksList.displayName = "WebhooksList";
export default WebhooksList;
