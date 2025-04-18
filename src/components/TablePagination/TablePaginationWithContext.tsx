import { usePaginatorContext } from "@dashboard/hooks/usePaginator";
import React from "react";

import { Pagination, PaginationProps } from "./Pagination";

export type TablePaginationWithContextProps = Omit<
  PaginationProps,
  | "nextHref"
  | "prevHref"
  | "hasNextPage"
  | "hasPreviousPage"
  | "onNextPage"
  | "onPreviousPage"
  | "paginatorSettings"
>;
export const TablePaginationWithContext = ({
  onUpdateListSettings,
  settings,
  ...props
}: TablePaginationWithContextProps) => {
  const { hasNextPage, hasPreviousPage, ...rest } = usePaginatorContext();

  return (
    <Pagination
      {...props}
      onUpdateListSettings={onUpdateListSettings}
      numberOfRows={settings?.rowNumber}
      hasPreviousPage={hasPreviousPage}
      hasNextPage={hasNextPage}
      paginatorSettings={rest}
    />
  );
};
