import { Button } from "@dashboard/components/Button";
import CardTitle from "@dashboard/components/CardTitle";
import useStyles from "@dashboard/components/Metadata/styles";
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

const WebhookHeaders: React.FC<WebhookHeadersProps> = ({ data, onChange }) => {
  const customHeaders = data.customHeaders;

  const intl = useIntl();
  const loaded = useRef(false);
  const [expanded, setExpanded] = useState(false);
  const classes = useStyles();
  const headers = useMemo(() => mapHeaders(customHeaders), [customHeaders]);

  const change = (event: ChangeEvent) => {
    const { name, value } = event.target as HTMLTextAreaElement;
    const [field, index] = name.split(":");

    const item = headers[index];
    item[field] = value;

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
              id: "b89+oM",
              defaultMessage: "Headers",
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
                  id="hvDSHe"
                  defaultMessage="{number,plural,one{{number} header} other{{number} headers}}"
                  description="number of metadata fields in model"
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
                      id="CdxVko"
                      defaultMessage="No headers created for this webhook. Use the button below to add new header."
                      description="empty headers text"
                    />
                  </Typography>
                </CardContent>
              ) : (
                <>
                  <CardContent>
                    <Typography variant="body2">
                      <FormattedMessage
                        id="pSECJe"
                        defaultMessage="Headers with in following format are accepted: `Authorization`, `X-`"
                        description="accepted header names"
                      />
                    </Typography>
                  </CardContent>

                  <Table className={classes.table}>
                    <TableHead>
                      <TableRowLink>
                        <TableCell className={classes.colNameHeader}>
                          <FormattedMessage
                            id="No4lyL"
                            defaultMessage="Name"
                            description="header field name, header"
                          />
                        </TableCell>
                        <TableCell className={classes.colValue}>
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
                          <TableCell className={classes.colName}>
                            <TextField
                              InputProps={{
                                classes: {
                                  input: classes.nameInput,
                                },
                              }}
                              inputProps={{
                                "aria-label": `${nameInputPrefix}${nameSeparator}${fieldIndex}`,
                              }}
                              name={`${nameInputPrefix}${nameSeparator}${fieldIndex}`}
                              fullWidth
                              onChange={change}
                              value={field.name}
                              placeholder="Authorization"
                              error={field.error}
                              helperText={
                                field.error &&
                                intl.formatMessage({
                                  id: "YIxI6R",
                                  defaultMessage: "Incorrect name",
                                  description: "header name input",
                                })
                              }
                            />
                          </TableCell>
                          <TableCell className={classes.colValue}>
                            <TextField
                              InputProps={{
                                classes: {
                                  root: classes.input,
                                },
                              }}
                              inputProps={{
                                "aria-label": `${valueInputPrefix}${nameSeparator}${fieldIndex}`,
                              }}
                              multiline
                              name={`${valueInputPrefix}${nameSeparator}${fieldIndex}`}
                              fullWidth
                              onChange={change}
                              value={field.value}
                              placeholder="XYZ"
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
                    id="CvyQ1c"
                    defaultMessage="Add Header"
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
