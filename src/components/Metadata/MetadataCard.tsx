import {
  Card,
  CardActions,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import { Button } from "@saleor/components/Button";
import { MetadataInput } from "@saleor/graphql";
import { FormChange } from "@saleor/hooks/useForm";
import { DeleteIcon, ExpandIcon, IconButton } from "@saleor/macaw-ui";
import classNames from "classnames";
import React, { useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import CardTitle from "../CardTitle";
import Skeleton from "../Skeleton";
import useStyles from "./styles";
import { EventDataAction, EventDataField } from "./types";

export interface MetadataCardProps {
  data: MetadataInput[];
  isPrivate: boolean;
  onChange: FormChange;
}

export const nameSeparator = ":";
export const nameInputPrefix = EventDataField.name;
export const valueInputPrefix = EventDataField.value;

const MetadataCard: React.FC<MetadataCardProps> = ({
  data,
  isPrivate,
  onChange,
}) => {
  const intl = useIntl();
  const loaded = React.useRef(false);
  const [expanded, setExpanded] = React.useState(true);
  const classes = useStyles({});

  useEffect(() => {
    if (data !== undefined) {
      loaded.current = true;
      if (data.length > 0) {
        setExpanded(false);
      }
    }
  }, [data === undefined]);

  return (
    <Card
      data-test-id="metadata-editor"
      data-test-is-private={isPrivate}
      data-test-expanded={expanded}
    >
      <CardTitle
        className={classes.header}
        title={
          <>
            {isPrivate
              ? intl.formatMessage({
                  id: "ETHnjq",
                  defaultMessage: "Private Metadata",
                  description: "header",
                })
              : intl.formatMessage({
                  id: "VcI+Zh",
                  defaultMessage: "Metadata",
                  description: "header",
                })}
            <IconButton
              className={classNames(classes.expandBtn, {
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
      {data === undefined ? (
        <CardContent>
          <Skeleton />
        </CardContent>
      ) : (
        <>
          <CardContent className={classes.content}>
            {data.length > 0 && (
              <Typography color="textSecondary" variant="body2">
                <FormattedMessage
                  id="2+v1wX"
                  defaultMessage="{number,plural,one{{number} string} other{{number} strings}}"
                  description="number of metadata fields in model"
                  values={{
                    number: data.length,
                  }}
                />
              </Typography>
            )}
          </CardContent>
          {expanded && (
            <>
              {data.length === 0 ? (
                <CardContent className={classes.emptyContainer}>
                  <Typography variant="body2" color="textSecondary">
                    <FormattedMessage
                      id="cY6H2C"
                      defaultMessage="No metadata created for this element. Use the button below to add new metadata field."
                      description="empty metadata text"
                    />
                  </Typography>
                </CardContent>
              ) : (
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.colNameHeader}>
                        <FormattedMessage
                          id="nudPsY"
                          defaultMessage="Field"
                          description="metadata field name, header"
                        />
                      </TableCell>
                      <TableCell className={classes.colValue}>
                        <FormattedMessage
                          id="LkuDEb"
                          defaultMessage="Value"
                          description="metadata field value, header"
                        />
                      </TableCell>
                      <TableCell className={classes.colActionHeader}>
                        <FormattedMessage
                          id="nEixpu"
                          defaultMessage="Actions"
                          description="table action"
                        />
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((field, fieldIndex) => (
                      <TableRow data-test-id="field" key={fieldIndex}>
                        <TableCell className={classes.colName}>
                          <TextField
                            InputProps={{
                              classes: {
                                input: classes.nameInput,
                              },
                            }}
                            name={`${nameInputPrefix}${nameSeparator}${fieldIndex}`}
                            fullWidth
                            onChange={onChange}
                            value={field.key}
                          />
                        </TableCell>
                        <TableCell className={classes.colValue}>
                          <TextField
                            InputProps={{
                              classes: {
                                root: classes.input,
                              },
                            }}
                            multiline
                            name={`${valueInputPrefix}${nameSeparator}${fieldIndex}`}
                            fullWidth
                            onChange={onChange}
                            value={field.value}
                          />
                        </TableCell>
                        <TableCell className={classes.colAction}>
                          <IconButton
                            variant="secondary"
                            data-test-id={"delete-field-" + fieldIndex}
                            onClick={() =>
                              onChange({
                                target: {
                                  name: EventDataAction.delete,
                                  value: fieldIndex,
                                },
                              })
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              <CardActions className={classes.actions}>
                <Button
                  variant="secondary"
                  data-test-id="add-field"
                  onClick={() =>
                    onChange({
                      target: {
                        name: EventDataAction.add,
                        value: null,
                      },
                    })
                  }
                >
                  <FormattedMessage
                    id="GiDxS4"
                    defaultMessage="Add Field"
                    description="add metadata field,button"
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

MetadataCard.displayName = "MetadataCard";
export default MetadataCard;
