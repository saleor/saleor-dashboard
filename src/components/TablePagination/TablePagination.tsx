import { commonMessages } from "@dashboard/intl";
import { TableCell } from "@material-ui/core";
import {
  Pagination,
  PaginationProps as MacawPaginationProps,
  PaginationRowNumberSelectLabels,
} from "@saleor/macaw-ui";
import * as React from "react";
import { useIntl } from "react-intl";
import { Link, LinkProps } from "react-router-dom";

import { ListSettings } from "../../types";

export type ListSettingsUpdate = <T extends keyof ListSettings>(
  key: T,
  value: ListSettings[T],
) => void;

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
  labels?: PaginationRowNumberSelectLabels;
}
export const TablePagination = ({
  component,
  colSpan,
  settings,
  onUpdateListSettings,
  nextHref,
  prevHref,
  hasNextPage,
  hasPreviousPage,
  disabled,
  labels,
  ...rest
}: PaginationProps) => {
  const intl = useIntl();
  const Wrapper = component || TableCell;

  return (
    <Wrapper colSpan={colSpan || 1000}>
      <Pagination<LinkProps>
        {...rest}
        hasNextPage={hasNextPage && !disabled}
        hasPreviousPage={hasPreviousPage && !disabled}
        labels={{
          noOfRows: labels?.noOfRows ?? intl.formatMessage(commonMessages.noOfRows),
        }}
        rowNumber={settings?.rowNumber}
        onRowNumberUpdate={
          onUpdateListSettings ? value => onUpdateListSettings("rowNumber", value) : undefined
        }
        nextIconButtonProps={nextHref ? { component: Link, to: nextHref } : undefined}
        prevIconButtonProps={prevHref ? { component: Link, to: prevHref } : undefined}
      />
    </Wrapper>
  );
};

TablePagination.displayName = "TablePagination";
export default TablePagination;
