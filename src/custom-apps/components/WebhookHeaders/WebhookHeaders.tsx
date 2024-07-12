import { Button } from "@dashboard/components/Button";
import { DashboardCard } from "@dashboard/components/Card";
import TableRowLink from "@dashboard/components/TableRowLink";
import { FormChange } from "@dashboard/hooks/useForm";
import { CardActions, Table, TableCell, TableHead } from "@material-ui/core";
import { ExpandIcon, IconButton } from "@saleor/macaw-ui";
import { Skeleton, Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import React, { useEffect, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { WebhookFormData } from "../WebhookDetailsPage";
import { messages } from "./messages";
import useStyles from "./styles";
import { hasEmptyHeader, mapHeaders, stringifyHeaders } from "./utils";
import WebhookHeadersTableBody from "./WebhookHeadersTableBody";

export interface WebhookHeadersProps {
  data: WebhookFormData;
  onChange: FormChange;
}

const WebhookHeaders: React.FC<WebhookHeadersProps> = ({ data: { customHeaders }, onChange }) => {
  const intl = useIntl();
  const [expanded, setExpanded] = useState(false);
  const classes = useStyles();
  const headers = useMemo(() => mapHeaders(customHeaders), [customHeaders]);

  useEffect(() => {
    if (headers.length > 0) {
      setExpanded(true);
    }
  }, [headers.length]);

  const add = () => {
    const items = [...headers];

    items.push({ name: "", value: "", error: false });
    onChange({
      target: {
        name: "customHeaders",
        value: stringifyHeaders(items),
      },
    });
  };

  return (
    <DashboardCard data-test-id="webhook-headers-editor" data-test-expanded={expanded}>
      <DashboardCard.Title className={classes.header}>
        {intl.formatMessage(messages.header)}
      </DashboardCard.Title>

      <DashboardCard.Toolbar>
        <IconButton
          className={clsx(classes.expandBtn, {
            [classes.rotate]: expanded,
          })}
          hoverOutline={false}
          variant="secondary"
          data-test-id="expand"
          onClick={() => setExpanded(!expanded)}
        >
          <ExpandIcon />
        </IconButton>
      </DashboardCard.Toolbar>
      {headers === undefined ? (
        <DashboardCard.Content>
          <Skeleton />
        </DashboardCard.Content>
      ) : (
        <>
          <DashboardCard.Content className={classes.content}>
            {headers.length > 0 && (
              <Text color="default2" fontSize={3}>
                <FormattedMessage
                  {...messages.headersCount}
                  values={{
                    number: headers.length,
                  }}
                />
              </Text>
            )}
          </DashboardCard.Content>
          {expanded && (
            <>
              {headers.length === 0 ? (
                <DashboardCard.Content className={classes.emptyContainer}>
                  <Text size={3} fontWeight="regular" color="default2">
                    <FormattedMessage {...messages.noHeaders} />
                  </Text>
                </DashboardCard.Content>
              ) : (
                <>
                  <DashboardCard.Content>
                    <Text size={3} fontWeight="regular">
                      <FormattedMessage
                        {...messages.acceptedFormat}
                        values={{
                          code: (...chunks) => <code>{chunks}</code>,
                        }}
                      />
                    </Text>
                  </DashboardCard.Content>

                  <Table className={classes.table}>
                    <TableHead>
                      <TableRowLink>
                        <TableCell className={clsx(classes.colNameHeader, classes.tableCell)}>
                          <FormattedMessage {...messages.headerName} />
                        </TableCell>
                        <TableCell className={clsx(classes.colValue, classes.tableCell)}>
                          <FormattedMessage {...messages.headerValue} />
                        </TableCell>
                        <TableCell className={classes.colActionHeader}>
                          <FormattedMessage {...messages.actions} />
                        </TableCell>
                      </TableRowLink>
                    </TableHead>
                    <WebhookHeadersTableBody onChange={onChange} headers={headers} />
                  </Table>
                </>
              )}
              <CardActions className={classes.actions}>
                <Button
                  variant="secondary"
                  data-test-id="add-header"
                  onClick={add}
                  disabled={hasEmptyHeader(headers)}
                >
                  <FormattedMessage {...messages.add} />
                </Button>
              </CardActions>
            </>
          )}
        </>
      )}
    </DashboardCard>
  );
};

WebhookHeaders.displayName = "WebhookHeaders";
export default WebhookHeaders;
