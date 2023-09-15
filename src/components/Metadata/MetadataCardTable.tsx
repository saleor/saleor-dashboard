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
} from "@saleor/macaw-ui/next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { EventDataAction } from "./types";
import { nameInputPrefix, nameSeparator, valueInputPrefix } from "./utils";

interface MetadataCardTableProps {
  data: MetadataInput[];
  onChange: FormChange;
}

export const MetadataCardTable = ({
  data,
  onChange,
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
                <Input
                  width="100%"
                  size="small"
                  aria-label={`${nameInputPrefix}${nameSeparator}${fieldIndex}`}
                  name={`${nameInputPrefix}${nameSeparator}${fieldIndex}`}
                  onChange={onChange}
                  value={field.key}
                />
              </TableCell>
              <TableCell>
                <Box paddingY={3}>
                  <Textarea
                    width="100%"
                    rows={1}
                    size="small"
                    aria-label={`${valueInputPrefix}${nameSeparator}${fieldIndex}`}
                    name={`${valueInputPrefix}${nameSeparator}${fieldIndex}`}
                    onChange={onChange}
                    value={field.value}
                  />
                </Box>
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
    </Box>
  );
};
