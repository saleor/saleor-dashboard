import { Button } from "@dashboard/components/Button";
import CardTitle from "@dashboard/components/CardTitle";
import Skeleton from "@dashboard/components/Skeleton";
import TableRowLink from "@dashboard/components/TableRowLink";
import { FormChange } from "@dashboard/hooks/useForm";
import { removeAtIndex, updateAtIndex } from "@dashboard/utils/lists";
import {
  Card,
  CardActions,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  Typography,
} from "@material-ui/core";
import { DeleteIcon, ExpandIcon, IconButton } from "@saleor/macaw-ui";
import clsx from "clsx";
import React, {
  ChangeEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { WebhookFormData } from "../WebhookDetailsPage";
import useStyles from "./styles";
import { mapHeaders, stringifyHeaders } from "./utils";

export interface WebhookHeadersProps {
  data: WebhookFormData;
  onChange: FormChange;
}

export interface Header {
  name: string;
  value: string;
  error?: boolean;
}

const nameSeparator = ":";
const nameInputPrefix = "name";
const valueInputPrefix = "value";

const WebhookHeaders: React.FC<WebhookHeadersProps> = ({
  data: { customHeaders },
  onChange,
}) => {
  const intl = useIntl();
  const loaded = useRef(false);
  const [expanded, setExpanded] = useState(false);
  const classes = useStyles();
  const headers = useMemo(() => mapHeaders(customHeaders), [customHeaders]);

  const change = ({ target }: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = target;
    const [field, index] = name.split(nameSeparator);

    const item = headers[index];

    // lowercase header name
    if (field === nameInputPrefix) {
      item[field] = value.toLowerCase();
    } else {
      item[field] = value;
    }

    onChange({
      target: {
        name: "customHeaders",
        value: stringifyHeaders(
          updateAtIndex(item, headers, parseInt(index, 10)),
        ),
      },
    });
  };

  useEffect(() => {
    if (headers.length > 0) {
      loaded.current = true;
      if (headers.length > 0) {
        setExpanded(true);
      }
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
            {intl.formatMessage({
              id: "2BHjVL",
              defaultMessage: "Custom request headers",
              description: "header",
            })}
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
                  id="9Y5i/8"
                  defaultMessage="{number,plural,one{{number} header} other{{number} custom request headers}}"
                  description="number of webhook headers in model"
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
                    <FormattedMessage
                      id="b1t9bM"
                      defaultMessage="No custom request headers created for this webhook. Use the button below to add new custom request header."
                      description="empty headers text"
                    />
                  </Typography>
                </CardContent>
              ) : (
                <>
                  <CardContent>
                    <Typography variant="body2">
                      <FormattedMessage
                        id="wChjN/"
                        defaultMessage="Headers with in following format are accepted: `authorization*`, `x-*`"
                        description="accepted header names"
                      />
                    </Typography>
                  </CardContent>

                  <Table className={classes.table}>
                    <TableHead>
                      <TableRowLink>
                        <TableCell
                          className={clsx(
                            classes.colNameHeader,
                            classes.tableCell,
                          )}
                        >
                          <FormattedMessage
                            id="No4lyL"
                            defaultMessage="Name"
                            description="header field name, header"
                          />
                        </TableCell>
                        <TableCell
                          className={clsx(classes.colValue, classes.tableCell)}
                        >
                          <FormattedMessage
                            id="/4bJkA"
                            defaultMessage="Value"
                            description="header field value, header"
                          />
                        </TableCell>
                        <TableCell className={classes.colActionHeader}>
                          <FormattedMessage
                            id="nEixpu"
                            defaultMessage="Actions"
                            description="table action"
                          />
                        </TableCell>
                      </TableRowLink>
                    </TableHead>
                    <TableBody>
                      {headers.map((field, fieldIndex) => (
                        <TableRowLink data-test-id="field" key={fieldIndex}>
                          <TableCell
                            className={clsx(classes.colName, classes.tableCell)}
                          >
                            <TextField
                              InputProps={{
                                classes: {
                                  input: classes.input,
                                },
                              }}
                              inputProps={{
                                "aria-label": `${nameInputPrefix}${nameSeparator}${fieldIndex}`,
                              }}
                              name={`${nameInputPrefix}${nameSeparator}${fieldIndex}`}
                              fullWidth
                              onChange={change}
                              value={field.name}
                              error={field.error}
                              helperText={
                                (field.error &&
                                  intl.formatMessage({
                                    id: "iERn5G",
                                    defaultMessage:
                                      "Should start with `x-` or `authorization`",
                                    description: "header name input",
                                  })) ||
                                " "
                              }
                            />
                          </TableCell>
                          <TableCell
                            className={clsx(
                              classes.colValue,
                              classes.tableCell,
                            )}
                          >
                            <TextField
                              InputProps={{
                                classes: {
                                  input: classes.input,
                                },
                              }}
                              inputProps={{
                                "aria-label": `${valueInputPrefix}${nameSeparator}${fieldIndex}`,
                              }}
                              name={`${valueInputPrefix}${nameSeparator}${fieldIndex}`}
                              fullWidth
                              onChange={change}
                              value={field.value}
                              helperText={" "}
                            />
                          </TableCell>
                          <TableCell className={classes.colAction}>
                            <IconButton
                              variant="secondary"
                              data-test-id={"delete-field-" + fieldIndex}
                              onClick={() =>
                                onChange({
                                  target: {
                                    name: "customHeaders",
                                    value: stringifyHeaders(
                                      removeAtIndex(headers, fieldIndex),
                                    ),
                                  },
                                })
                              }
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRowLink>
                      ))}
                    </TableBody>
                  </Table>
                </>
              )}
              <CardActions className={classes.actions}>
                <Button
                  variant="secondary"
                  data-test-id="add-header"
                  onClick={add}
                >
                  <FormattedMessage
                    id="uQNm59"
                    defaultMessage="Add custom request header"
                    description="add header,button"
                  />
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
