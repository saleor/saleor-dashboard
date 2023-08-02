import TableRowLink from "@dashboard/components/TableRowLink";
import { MetadataInput } from "@dashboard/graphql";
import { FormChange } from "@dashboard/hooks/useForm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TextField,
} from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import {
  Box,
  Button,
  ChervonDownIcon,
  ChervonUpIcon,
  Text,
  TrashBinIcon,
  vars,
} from "@saleor/macaw-ui/next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { DashboardCard } from "../Card";
import Skeleton from "../Skeleton";
import { EventDataAction } from "./types";
import { nameInputPrefix, nameSeparator, valueInputPrefix } from "./utils";

const useStyles = makeStyles(
  theme => ({
    input: {
      padding: theme.spacing(0.5, 2),
    },
    nameInput: {
      padding: "13px 16px",
    },
  }),
  {
    name: "Metadata",
  },
);

export interface MetadataCardProps {
  data: MetadataInput[];
  isPrivate: boolean;
  onChange: FormChange;
}

export const MetadataCard: React.FC<MetadataCardProps> = ({
  data,
  isPrivate,
  onChange,
}) => {
  const intl = useIntl();
  const [expanded, setExpanded] = React.useState(false);
  const classes = useStyles();

  return (
    <DashboardCard
      data-test-id="metadata-editor"
      data-test-is-private={isPrivate}
      data-test-expanded={expanded}
      gap={1}
    >
      <DashboardCard.Title>
        <Box
          display="flex"
          justifyContent="space-between"
          onClick={() => setExpanded(!expanded)}
          cursor="pointer"
        >
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
          <Button
            variant="secondary"
            data-test-id="expand"
            type="button"
            icon={expanded ? <ChervonUpIcon /> : <ChervonDownIcon />}
          />
        </Box>
      </DashboardCard.Title>
      {data === undefined ? (
        <DashboardCard.Content>
          <Skeleton />
        </DashboardCard.Content>
      ) : (
        <>
          {data.length > 0 && (
            <DashboardCard.Content>
              <Text variant="caption">
                <FormattedMessage
                  id="2+v1wX"
                  defaultMessage="{number,plural,one{{number} string} other{{number} strings}}"
                  description="number of metadata fields in model"
                  values={{
                    number: data.length,
                  }}
                />
              </Text>
            </DashboardCard.Content>
          )}
          {expanded && (
            <>
              {data.length === 0 ? (
                <DashboardCard.Content>
                  <Text variant="caption" color="textNeutralSubdued">
                    <FormattedMessage
                      id="cY6H2C"
                      defaultMessage="No metadata created for this element. Use the button below to add new metadata field."
                      description="empty metadata text"
                    />
                  </Text>
                </DashboardCard.Content>
              ) : (
                <Table>
                  <TableHead>
                    <TableRowLink>
                      <TableCell style={{ paddingLeft: vars.spacing[6] }}>
                        <Text variant="caption" color="textNeutralSubdued">
                          <FormattedMessage
                            id="nudPsY"
                            defaultMessage="Field"
                            description="metadata field name, header"
                          />
                        </Text>
                      </TableCell>
                      <TableCell style={{ paddingLeft: vars.spacing[8] }}>
                        <Text variant="caption" color="textNeutralSubdued">
                          <FormattedMessage
                            id="LkuDEb"
                            defaultMessage="Value"
                            description="metadata field value, header"
                          />
                        </Text>
                      </TableCell>
                      <TableCell
                        style={{
                          textAlign: "end",
                          paddingRight: vars.spacing[6],
                        }}
                      >
                        <Text variant="caption" color="textNeutralSubdued">
                          <FormattedMessage
                            id="nEixpu"
                            defaultMessage="Actions"
                            description="table action"
                          />
                        </Text>
                      </TableCell>
                    </TableRowLink>
                  </TableHead>
                  <TableBody>
                    {data.map((field, fieldIndex) => (
                      <TableRowLink data-test-id="field" key={fieldIndex}>
                        <TableCell style={{ paddingLeft: vars.spacing[6] }}>
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
                            onChange={onChange}
                            value={field.key}
                          />
                        </TableCell>
                        <TableCell>
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
                            onChange={onChange}
                            value={field.value}
                          />
                        </TableCell>
                        <TableCell style={{ paddingRight: vars.spacing[6] }}>
                          <Box display="flex" justifyContent="flex-end">
                            <Button
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
                              type="button"
                              icon={<TrashBinIcon />}
                            />
                          </Box>
                        </TableCell>
                      </TableRowLink>
                    ))}
                  </TableBody>
                </Table>
              )}
              <DashboardCard.Content marginTop={2} paddingLeft={6}>
                <Button
                  variant="secondary"
                  data-test-id="add-field"
                  type="button"
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
              </DashboardCard.Content>
            </>
          )}
        </>
      )}
    </DashboardCard>
  );
};
