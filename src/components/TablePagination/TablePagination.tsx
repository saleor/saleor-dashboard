import { TableCell } from "@material-ui/core";
import {
  Pagination,
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
  component?: React.ElementType;
  colSpan?: number;
  settings?: ListSettings;
  onUpdateListSettings?: ListSettingsUpdate;
}
export const TablePagination: React.FC<PaginationProps> = ({
  component,
  colSpan,
  settings,
  onUpdateListSettings,
  ...rest
}) => {
  const intl = useIntl();
  const Wrapper = component || TableCell;

  return (
    <Wrapper colSpan={colSpan || 1000}>
      <Pagination
        {...rest}
        labels={{
          noOfRows: intl.formatMessage(messages.noOfRows)
        }}
        rowNumber={settings?.rowNumber}
        onRowNumberUpdate={
          onUpdateListSettings
            ? value => onUpdateListSettings("rowNumber", value)
            : undefined
        }
      />
    </Wrapper>
  );
};

TablePagination.displayName = "TablePagination";
export default TablePagination;
