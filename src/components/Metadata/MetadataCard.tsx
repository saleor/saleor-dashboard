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
  Typography
} from "@material-ui/core";
import { FormChange } from "@saleor/hooks/useForm";
import { Button, DeleteIcon, ExpandIcon, IconButton } from "@saleor/macaw-ui";
import { MetadataInput } from "@saleor/types/globalTypes";
import classNames from "classnames";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import { FormattedMessage } from "react-intl";

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
  onChange
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
      data-test="metadataEditor"
      data-test-is-private={isPrivate}
      data-test-expanded={expanded}
    >
      <CardTitle
        className={classes.header}
        title={
          <>
            {isPrivate
              ? intl.formatMessage({
                  defaultMessage: "Private Metadata",
                  description: "header"
                })
              : intl.formatMessage({
                  defaultMessage: "Metadata",
                  description: "header"
                })}
            <IconButton
              className={classNames(classes.expandBtn, {
                [classes.rotate]: expanded
              })}
              hoverOutline={false}
              variant="secondary"
              data-test="expand"
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
                  defaultMessage="{number,plural,one{{number} string} other{{number} strings}}"
                  description="number of metadata fields in model"
                  values={{
                    number: data.length
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
                          defaultMessage="Field"
                          description="metadata field name, header"
                        />
                      </TableCell>
                      <TableCell className={classes.colValue}>
                        <FormattedMessage
                          defaultMessage="Value"
                          description="metadata field value, header"
                        />
                      </TableCell>
                      <TableCell className={classes.colActionHeader}>
                        <FormattedMessage
                          defaultMessage="Actions"
                          description="table action"
                        />
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((field, fieldIndex) => (
                      <TableRow data-test="field" key={fieldIndex}>
                        <TableCell className={classes.colName}>
                          <TextField
                            InputProps={{
                              classes: {
                                input: classes.nameInput
                              }
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
                                root: classes.input
                              }
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
                            data-test="deleteField"
                            data-test-id={fieldIndex}
                            onClick={() =>
                              onChange({
                                target: {
                                  name: EventDataAction.delete,
                                  value: fieldIndex
                                }
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
                  data-test="addField"
                  onClick={() =>
                    onChange({
                      target: {
                        name: EventDataAction.add,
                        value: null
                      }
                    })
                  }
                >
                  <FormattedMessage
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
