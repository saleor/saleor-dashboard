// @ts-strict-ignore
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { TableBody, TableCell } from "@dashboard/components/Table/Table";
import TableRowLink from "@dashboard/components/TableRowLink/TableRowLink";
import { type FormChange } from "@dashboard/hooks/useForm";
import { removeAtIndex, updateAtIndex } from "@dashboard/utils/lists/lists";
import { Button, Input } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { Trash2 } from "lucide-react";
import { type ChangeEvent } from "react";
import { useIntl } from "react-intl";

import { messages } from "./messages";
import { type Header, stringifyHeaders } from "./utils";
import styles from "./WebhookHeadersTableBody.module.css";

const nameSeparator = ":";
const nameInputPrefix = "name";
const valueInputPrefix = "value";

interface WebhookHeadersTableBodyProps {
  onChange: FormChange;
  headers: Header[];
}

export const WebhookHeadersTableBody = ({ onChange, headers }: WebhookHeadersTableBodyProps) => {
  const intl = useIntl();
  const updateWebhookItem = (target: EventTarget & HTMLInputElement) => {
    const { name, value } = target;
    const [field, index] = name.split(nameSeparator);
    const item: Header = headers[index];

    // lowercase header name
    if (field === nameInputPrefix) {
      item[field] = value.toLowerCase();
    } else {
      item[field] = value;
    }

    return {
      item,
      index: parseInt(index, 10),
    };
  };
  const change = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { item, index } = updateWebhookItem(target);

    onChange({
      target: {
        name: "customHeaders",
        value: stringifyHeaders(updateAtIndex(item, headers, index)),
      },
    });
  };

  return (
    <TableBody>
      {headers.map((field, fieldIndex) => (
        <TableRowLink data-test-id="field" key={fieldIndex}>
          <TableCell className={clsx(styles.colName, styles.tableCell)}>
            <Input
              aria-label={`${nameInputPrefix}${nameSeparator}${fieldIndex}`}
              name={`${nameInputPrefix}${nameSeparator}${fieldIndex}`}
              onChange={change}
              value={field.name}
              error={field.error}
              aria-invalid={field.error}
              helperText={(field.error && intl.formatMessage(messages.headerNameError)) || " "}
            />
          </TableCell>
          <TableCell className={styles.tableCell}>
            <Input
              aria-label={`${valueInputPrefix}${nameSeparator}${fieldIndex}`}
              name={`${valueInputPrefix}${nameSeparator}${fieldIndex}`}
              onChange={change}
              value={field.value}
              helperText={" "}
            />
          </TableCell>
          <TableCell className={styles.colAction}>
            <Button
              variant="secondary"
              icon={<Trash2 size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />}
              data-test-id={"delete-field-" + fieldIndex}
              onClick={() =>
                onChange({
                  target: {
                    name: "customHeaders",
                    value: stringifyHeaders(removeAtIndex(headers, fieldIndex)),
                  },
                })
              }
            />
          </TableCell>
        </TableRowLink>
      ))}
    </TableBody>
  );
};

WebhookHeadersTableBody.displayName = "WebhookHeadersTableRow";
