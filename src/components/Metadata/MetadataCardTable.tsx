import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Table, TableBody, TableCell, TableHead } from "@dashboard/components/Table/Table";
import TableRowLink from "@dashboard/components/TableRowLink/TableRowLink";
import { type MetadataInput } from "@dashboard/graphql";
import { type FormChange } from "@dashboard/hooks/useForm";
import { Box, Button, Input, Text, Textarea, vars } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { Trash2 } from "lucide-react";
import { useMemo } from "react";
import { FormattedMessage } from "react-intl";

import styles from "./MetadataCardTable.module.css";
import { EventDataAction } from "./types";
import {
  getMetadataKeyFieldErrors,
  nameInputPrefix,
  nameSeparator,
  valueInputPrefix,
} from "./utils";

interface MetadataCardTableProps {
  data: MetadataInput[];
  onChange: FormChange;
  /** Form is not editable (permanently, e.g. it's not a form) */
  readonly?: boolean;
  /** Form is temporarily unavailable (e.g. on submit) */
  disabled?: boolean;
  /** DetailGroupBox layout — full-bleed row dividers with inset cell padding */
  inModal?: boolean;
  error?: string;
}

export const MetadataCardTable = ({
  data,
  onChange,
  readonly = false,
  disabled,
  inModal = false,
  error,
}: MetadataCardTableProps) => {
  const keyFieldErrors = useMemo(() => getMetadataKeyFieldErrors(data, error), [data, error]);

  if (!data || data.length === 0) {
    return null;
  }

  const pageHorizontalPadding = vars.spacing[6];

  const tableBody = (
    <TableBody>
      {data.map((field, fieldIndex) => {
        const keyFieldError = keyFieldErrors[fieldIndex];

        return (
          <TableRowLink data-test-id="field" key={fieldIndex}>
            <TableCell
              width={inModal ? undefined : "50%"}
              className={clsx(inModal && keyFieldError && styles.fieldCellWithError)}
              style={
                inModal
                  ? undefined
                  : {
                      paddingLeft: pageHorizontalPadding,
                    }
              }
            >
              <Box className={styles.fieldCell}>
                <Input
                  data-test-id="metadata-key-input"
                  width="100%"
                  size="small"
                  aria-label={`${nameInputPrefix}${nameSeparator}${fieldIndex}`}
                  name={`${nameInputPrefix}${nameSeparator}${fieldIndex}`}
                  onChange={onChange}
                  value={field.key}
                  readOnly={readonly}
                  disabled={disabled}
                  color="default1"
                  fontWeight="bold"
                  error={!!keyFieldError}
                />
                {keyFieldError && (
                  <Text size={2} color="critical1" data-test-id="metadata-key-error">
                    {keyFieldError}
                  </Text>
                )}
              </Box>
            </TableCell>
            <TableCell
              width={inModal ? undefined : "50%"}
              style={
                inModal
                  ? undefined
                  : {
                      paddingTop: vars.spacing[2],
                      paddingBottom: vars.spacing[2],
                    }
              }
            >
              <Textarea
                data-test-id="metadata-value-input"
                readOnly={readonly}
                disabled={disabled}
                width="100%"
                rows={1}
                size="small"
                aria-label={`${valueInputPrefix}${nameSeparator}${fieldIndex}`}
                name={`${valueInputPrefix}${nameSeparator}${fieldIndex}`}
                onChange={onChange}
                value={field.value}
                color="default1"
              />
            </TableCell>
            {!readonly && (
              <TableCell
                style={
                  inModal
                    ? undefined
                    : {
                        paddingRight: pageHorizontalPadding,
                      }
                }
              >
                <Box
                  className={inModal ? styles.actionsCell : undefined}
                  {...(!inModal && { display: "flex", justifyContent: "flex-end" })}
                >
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
                    icon={
                      <Trash2 size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
                    }
                  />
                </Box>
              </TableCell>
            )}
          </TableRowLink>
        );
      })}
    </TableBody>
  );

  const pageTableHead = (
    <TableHead>
      <TableRowLink>
        <TableCell style={{ paddingLeft: pageHorizontalPadding }}>
          <Text size={2} color="default2">
            <FormattedMessage
              id="nudPsY"
              defaultMessage="Field"
              description="metadata field name, header"
            />
          </Text>
        </TableCell>
        <TableCell style={{ paddingLeft: vars.spacing[8] }}>
          <Text size={2} color="default2">
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
              paddingRight: pageHorizontalPadding,
            }}
          >
            <Text size={2} color="default2">
              <FormattedMessage id="nEixpu" defaultMessage="Actions" description="table action" />
            </Text>
          </TableCell>
        )}
      </TableRowLink>
    </TableHead>
  );

  if (inModal) {
    return (
      <Box data-test-id="metadata-table" className={styles.modalTableRoot}>
        <Table className={styles.modalTable}>
          <colgroup>
            <col />
            <col />
            {!readonly && <col className={styles.actionsCol} />}
          </colgroup>
          <TableHead>
            <TableRowLink>
              <TableCell>
                <Text size={2} color="default2">
                  <FormattedMessage
                    id="nudPsY"
                    defaultMessage="Field"
                    description="metadata field name, header"
                  />
                </Text>
              </TableCell>
              <TableCell>
                <Text size={2} color="default2">
                  <FormattedMessage
                    id="LkuDEb"
                    defaultMessage="Value"
                    description="metadata field value, header"
                  />
                </Text>
              </TableCell>
              {!readonly && (
                <TableCell>
                  <Text size={2} color="default2">
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
          {tableBody}
        </Table>
      </Box>
    );
  }

  return (
    <Box __marginLeft={-24} __marginRight={-24}>
      <Table>
        {pageTableHead}
        {tableBody}
      </Table>
    </Box>
  );
};
