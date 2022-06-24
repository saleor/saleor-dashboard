import { TableCell } from "@material-ui/core";
import {
  Pagination,
  PaginationProps as MacawPaginationProps,
} from "@saleor/macaw-ui";
import React from "react";
import { defineMessages, useIntl } from "react-intl";
import { Link, LinkProps } from "react-router-dom";

import { ListSettings } from "../../types";

export type ListSettingsUpdate = <T extends keyof ListSettings>(
  key: T,
  value: ListSettings[T],
) => void;

const messages = defineMessages({
  noOfRows: {
    id: "2HfSiT",
    defaultMessage: "No. of rows",
    description: "pagination",
  },
});

export interface PaginationProps
  extends Omit<
    MacawPaginationProps,
    "labels" | "rowNumber" | "nextIconButtonProps" | "prevIconButtonProps"
  > {
  component?: React.ElementType;
  colSpan?: number;
  settings?: ListSettings;
  onUpdateListSettings?: ListSettingsUpdate;
  prevHref?: string;
  nextHref?: string;
  disabled?: boolean;
}
export const TablePagination: React.FC<PaginationProps> = ({
  component,
  colSpan,
  settings,
  onUpdateListSettings,
  nextHref,
  prevHref,
  hasNextPage,
  hasPreviousPage,
  disabled,
  ...rest
}) => {
  const intl = useIntl();
  const Wrapper = component || TableCell;

  return (
    <Wrapper colSpan={colSpan || 1000}>
      <Pagination<LinkProps>
        {...rest}
        hasNextPage={hasNextPage && !disabled}
        hasPreviousPage={hasPreviousPage && !disabled}
        labels={{
          noOfRows: intl.formatMessage(messages.noOfRows),
        }}
        rowNumber={settings?.rowNumber}
        onRowNumberUpdate={
          onUpdateListSettings
            ? value => onUpdateListSettings("rowNumber", value)
            : undefined
        }
        nextIconButtonProps={
          nextHref ? { component: Link, to: nextHref } : undefined
        }
        prevIconButtonProps={
          prevHref ? { component: Link, to: prevHref } : undefined
        }
      />
    </Wrapper>
  );
};

TablePagination.displayName = "TablePagination";
export default TablePagination;
