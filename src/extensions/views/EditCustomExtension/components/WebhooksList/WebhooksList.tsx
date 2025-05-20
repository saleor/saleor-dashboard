import { DashboardCard } from "@dashboard/components/Card";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import TableButtonWrapper from "@dashboard/components/TableButtonWrapper";
import TableCellHeader from "@dashboard/components/TableCellHeader";
import TableRowLink from "@dashboard/components/TableRowLink";
import { isUnnamed } from "@dashboard/custom-apps/utils";
import { ExtensionsUrls } from "@dashboard/extensions/urls";
import { WebhookFragment } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { commonMessages, commonStatusMessages, sectionNames } from "@dashboard/intl";
import { renderCollection, stopPropagation } from "@dashboard/misc";
import { TableBody, TableCell, TableHead } from "@material-ui/core";
import { Box, Button, Chip, Skeleton, Text, TrashBinIcon } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";
import { useStyles } from "./styles";

export interface WebhooksListProps {
  webhooks: WebhookFragment[];
  onRemove: (id: string) => void;
  createHref?: string;
  hasManagedAppsPermission: boolean;
}

export const WebhooksList: React.FC<WebhooksListProps> = ({
  webhooks,
  createHref,
  onRemove,
  hasManagedAppsPermission,
}) => {
  const intl = useIntl();
  const classes = useStyles();
  const navigate = useNavigator();
  const numberOfColumns = hasManagedAppsPermission ? 3 : 1;

  const handleCreateWebhook = () => {
    if (!createHref) return;

    navigate(createHref);
  };

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title className={classes.cardTitle}>
          {intl.formatMessage(sectionNames.webhooksAndEvents)}
        </DashboardCard.Title>
        <DashboardCard.Toolbar>
          {!!createHref && hasManagedAppsPermission && (
            <Button variant="secondary" onClick={handleCreateWebhook} data-test-id="create-webhook">
              <FormattedMessage {...messages.createWebhook} />
            </Button>
          )}
        </DashboardCard.Toolbar>
      </DashboardCard.Header>
      <DashboardCard.Content paddingX={0}>
        <ResponsiveTable className={classes.table}>
          {hasManagedAppsPermission && (
            <TableHead>
              <TableRowLink>
                <TableCellHeader>{intl.formatMessage(commonMessages.name)}</TableCellHeader>
                <TableCellHeader>{intl.formatMessage(commonMessages.status)}</TableCellHeader>
                <TableCell className={clsx(classes.colAction, classes.colRight)}>
                  <FormattedMessage {...messages.action} />
                </TableCell>
              </TableRowLink>
            </TableHead>
          )}
          <TableBody>
            {hasManagedAppsPermission ? (
              renderCollection(
                webhooks,
                webhook => (
                  <TableRowLink
                    hover={!!webhook}
                    className={webhook ? classes.tableRow : undefined}
                    href={
                      webhook &&
                      ExtensionsUrls.resolveEditCustomExtensionWebhookUrl(
                        webhook.app.id,
                        webhook.id,
                      )
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
                        <Chip
                          backgroundColor={webhook.isActive ? "success1" : "critical1"}
                          borderColor={webhook.isActive ? "success1" : "critical1"}
                          color={"default1"}
                          data-test-id={
                            webhook.isActive ? "webhook-active-chip" : "webhook-inactive-chip"
                          }
                        >
                          {webhook.isActive
                            ? intl.formatMessage(commonStatusMessages.active)
                            : intl.formatMessage(commonStatusMessages.notActive)}
                        </Chip>
                      ) : (
                        <Skeleton />
                      )}
                    </TableCell>
                    <TableCell className={clsx(classes.colAction, classes.colRight)}>
                      {hasManagedAppsPermission && (
                        <Box display="flex" justifyContent="flex-end" width="100%">
                          <TableButtonWrapper>
                            <Button
                              variant="tertiary"
                              onClick={
                                webhook ? stopPropagation(() => onRemove(webhook.id)) : undefined
                              }
                              data-test-id={`delete-webhook-${webhook?.id}`}
                              icon={<TrashBinIcon />}
                            />
                          </TableButtonWrapper>
                        </Box>
                      )}
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
              )
            ) : (
              <TableRowLink>
                <TableCell colSpan={numberOfColumns}>
                  <Text color="default2">
                    <FormattedMessage
                      id="ALe+of"
                      defaultMessage="You don't have permission to manage webhooks. Contact your administrator for access."
                    />
                  </Text>
                </TableCell>
              </TableRowLink>
            )}
          </TableBody>
        </ResponsiveTable>
      </DashboardCard.Content>
    </DashboardCard>
  );
};

WebhooksList.displayName = "WebhooksList";
