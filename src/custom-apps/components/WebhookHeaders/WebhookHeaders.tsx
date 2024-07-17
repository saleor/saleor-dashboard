import { DashboardCard } from "@dashboard/components/Card";
import Skeleton from "@dashboard/components/Skeleton";
import TableRowLink from "@dashboard/components/TableRowLink";
import { FormChange } from "@dashboard/hooks/useForm";
import { Table, TableCell, TableHead, Typography } from "@material-ui/core";
import { Button, ChervonDownIcon } from "@saleor/macaw-ui-next";
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
      <DashboardCard.Header>
        <DashboardCard.Title
          paddingBottom={!expanded ? 8 : 0}
          display="flex"
          flexDirection="row"
          alignItems="center"
          gap={2}
        >
          {intl.formatMessage(messages.header)}
          <Button
            variant="tertiary"
            backgroundColor={{ hover: "transparent" }}
            __transform={expanded ? "rotate(-180deg)" : "rotate(0)"}
            data-test-id="expand"
            onClick={() => setExpanded(!expanded)}
          >
            <ChervonDownIcon />
          </Button>
        </DashboardCard.Title>
      </DashboardCard.Header>

      {headers === undefined ? (
        <DashboardCard.Content>
          <Skeleton />
        </DashboardCard.Content>
      ) : (
        <>
          {headers.length > 0 && (
            <DashboardCard.Content>
              <Typography color="textSecondary" variant="body2">
                <FormattedMessage
                  {...messages.headersCount}
                  values={{
                    number: headers.length,
                  }}
                />
              </Typography>
            </DashboardCard.Content>
          )}
          {expanded && (
            <>
              {headers.length === 0 ? (
                <DashboardCard.Content>
                  <Typography variant="body2" color="textSecondary">
                    <FormattedMessage {...messages.noHeaders} />
                  </Typography>
                </DashboardCard.Content>
              ) : (
                <>
                  <DashboardCard.Content>
                    <Typography variant="body2">
                      <FormattedMessage
                        {...messages.acceptedFormat}
                        values={{
                          code: (...chunks) => <code>{chunks}</code>,
                        }}
                      />
                    </Typography>
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
              <DashboardCard.Actions>
                <Button
                  variant="secondary"
                  data-test-id="add-header"
                  onClick={add}
                  disabled={hasEmptyHeader(headers)}
                >
                  <FormattedMessage {...messages.add} />
                </Button>
              </DashboardCard.Actions>
            </>
          )}
        </>
      )}
    </DashboardCard>
  );
};

WebhookHeaders.displayName = "WebhookHeaders";
export default WebhookHeaders;
