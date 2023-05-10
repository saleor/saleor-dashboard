import { Button } from "@dashboard/components/Button";
import CardTitle from "@dashboard/components/CardTitle";
import { Pill } from "@dashboard/components/Pill";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import Skeleton from "@dashboard/components/Skeleton";
import { TableButtonWrapper } from "@dashboard/components/TableButtonWrapper/TableButtonWrapper";
import TableCellHeader from "@dashboard/components/TableCellHeader";
import TableRowLink from "@dashboard/components/TableRowLink";
import { CustomAppUrls } from "@dashboard/custom-apps/urls";
import { isUnnamed } from "@dashboard/custom-apps/utils";
import { WebhookFragment } from "@dashboard/graphql";
import {
  commonMessages,
  commonStatusMessages,
  sectionNames,
} from "@dashboard/intl";
import { renderCollection, stopPropagation } from "@dashboard/misc";
import {
  Card,
  CardContent,
  TableBody,
  TableCell,
  TableHead,
} from "@material-ui/core";
import { DeleteIcon, IconButton } from "@saleor/macaw-ui";
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
    <Card className={classes.card}>
      <CardTitle
        title={intl.formatMessage(sectionNames.webhooksAndEvents)}
        className={classes.cardTitle}
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
      <CardContent>
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
      </CardContent>
    </Card>
  );
};
WebhooksList.displayName = "WebhooksList";
export default WebhooksList;
