import TableRowLink from "@dashboard/components/TableRowLink";
import { MetadataInput } from "@dashboard/graphql";
import { FormChange } from "@dashboard/hooks/useForm";
import { Table, TableBody, TableCell, TableHead } from "@material-ui/core";
import {
  Box,
  Button,
  Input,
  Text,
  Textarea,
  TrashBinIcon,
  vars,
} from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { EventDataAction } from "./types";
import { nameInputPrefix, nameSeparator, valueInputPrefix } from "./utils";

interface MetadataCardTableProps {
  data: MetadataInput[];
  onChange: FormChange;
  readonly?: boolean;
}

export const MetadataCardTable = ({
  data,
  onChange,
  readonly = false,
}: MetadataCardTableProps) => {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <Box __marginLeft={-24} __marginRight={-24}>
      <Table>
        <TableHead>
          <TableRowLink>
            <TableCell style={{ paddingLeft: vars.spacing[6] }}>
              <Text typeSize={2} color="default2">
                <FormattedMessage
                  id="nudPsY"
                  defaultMessage="Field"
                  description="metadata field name, header"
                />
              </Text>
            </TableCell>
            <TableCell style={{ paddingLeft: vars.spacing[8] }}>
              <Text typeSize={2} color="default2">
                <FormattedMessage
                  id="LkuDEb"
                  defaultMessage="Value"
                  description="metadata field value, header"
                />
              </Text>
            </TableCell>
            {!readonly && (
              <TableCell
                style={{
                  textAlign: "end",
                  paddingRight: vars.spacing[6],
                }}
              >
                <Text typeSize={2} color="default2">
                  <FormattedMessage
                    id="nEixpu"
                    defaultMessage="Actions"
                    description="table action"
                  />
                </Text>
              </TableCell>
            )}
          </TableRowLink>
        </TableHead>
        <TableBody>
          {data.map((field, fieldIndex) => (
            <TableRowLink data-test-id="field" key={fieldIndex}>
              <TableCell width="50%" style={{ paddingLeft: vars.spacing[6] }}>
                {readonly ? (
                  <Text typeSize={3} color="default2">
                    {field.key}
                  </Text>
                ) : (
                  <Input
                    width="100%"
                    size="small"
                    aria-label={`${nameInputPrefix}${nameSeparator}${fieldIndex}`}
                    name={`${nameInputPrefix}${nameSeparator}${fieldIndex}`}
                    onChange={onChange}
                    value={field.key}
                  />
                )}
              </TableCell>
              <TableCell
                width="50%"
                style={{
                  paddingTop: vars.spacing[2],
                  paddingBottom: vars.spacing[2],
                }}
              >
                {readonly ? (
                  <Text typeSize={3} color="default2">
                    {field.value}
                  </Text>
                ) : (
                  <Textarea
                    disabled={readonly}
                    width="100%"
                    rows={1}
                    size="small"
                    aria-label={`${valueInputPrefix}${nameSeparator}${fieldIndex}`}
                    name={`${valueInputPrefix}${nameSeparator}${fieldIndex}`}
                    onChange={onChange}
                    value={field.value}
                  />
                )}
              </TableCell>
              {!readonly && (
                <TableCell style={{ paddingRight: vars.spacing[6] }}>
                  <Box display="flex" justifyContent="flex-end">
                    {!readonly && (
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
                    )}
                  </Box>
                </TableCell>
              )}
            </TableRowLink>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};
