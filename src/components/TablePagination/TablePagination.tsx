import { TableCell } from "@material-ui/core";
import {
  Pagination as MacawPagination,
  PaginationProps as MacawPaginationProps
} from "@saleor/macaw-ui";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import { ListSettings } from "../../types";

export type ListSettingsUpdate = <T extends keyof ListSettings>(
  key: T,
  value: ListSettings[T]
) => void;

const messages = defineMessages({
  noOfRows: {
    defaultMessage: "No. of rows",
    description: "pagination"
  }
});

export interface PaginationProps
  extends Omit<MacawPaginationProps, "labels" | "rowNumber"> {
  colSpan?: number;
  settings?: ListSettings;
  onUpdateListSettings?: ListSettingsUpdate;
}
export const TablePagination: React.FC<PaginationProps> = ({
  colSpan,
  settings,
  onUpdateListSettings,
  ...rest
}) => {
  const intl = useIntl();

  return (
    <TableCell colSpan={colSpan || 1000}>
      <MacawPagination
        {...rest}
        labels={{
          noOfRows: intl.formatMessage(messages.noOfRows)
        }}
        rowNumber={settings?.rowNumber}
        onRowNumberUpdate={value => onUpdateListSettings("rowNumber", value)}
      />
    </TableCell>
  );
};
TablePagination.displayName = "Pagination";

TablePagination.displayName = "TablePagination";
export default TablePagination;
