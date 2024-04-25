import { Button } from "@dashboard/components/Button";
import CardTitle from "@dashboard/components/CardTitle";
import Skeleton from "@dashboard/components/Skeleton";
import TableRowLink from "@dashboard/components/TableRowLink";
import { FormChange } from "@dashboard/hooks/useForm";
import {
  Card,
  CardActions,
  CardContent,
  Table,
  TableCell,
  TableHead,
  Typography,
} from "@material-ui/core";
import { ExpandIcon, IconButton } from "@saleor/macaw-ui";
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
    <Card data-test-id="webhook-headers-editor" data-test-expanded={expanded}>
      <CardTitle
        className={classes.header}
        title={
          <>
            {intl.formatMessage(messages.header)}
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
          </>
        }
      />
      {headers === undefined ? (
        <CardContent>
          <Skeleton />
        </CardContent>
      ) : (
        <>
          <CardContent className={classes.content}>
            {headers.length > 0 && (
              <Typography color="textSecondary" variant="body2">
                <FormattedMessage
                  {...messages.headersCount}
                  values={{
                    number: headers.length,
                  }}
                />
              </Typography>
            )}
          </CardContent>
          {expanded && (
            <>
              {headers.length === 0 ? (
                <CardContent className={classes.emptyContainer}>
                  <Typography variant="body2" color="textSecondary">
                    <FormattedMessage {...messages.noHeaders} />
                  </Typography>
                </CardContent>
              ) : (
                <>
                  <CardContent>
                    <Typography variant="body2">
                      <FormattedMessage
                        {...messages.acceptedFormat}
                        values={{
                          code: (...chunks) => <code>${chunks}</code>,
                        }}
                      />
                    </Typography>
                  </CardContent>

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
    </Card>
  );
};

WebhookHeaders.displayName = "WebhookHeaders";
export default WebhookHeaders;
