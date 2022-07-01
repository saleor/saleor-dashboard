import { usePaginatorContext } from "@saleor/hooks/usePaginator";
import React from "react";

import TablePagination, { PaginationProps } from "./TablePagination";

export type TablePaginationWithContextProps = Omit<
  PaginationProps,
  | "nextHref"
  | "prevHref"
  | "hasNextPage"
  | "hasPreviousPage"
  | "onNextPage"
  | "onPreviousPage"
>;
export const TablePaginationWithContext = (
  props: TablePaginationWithContextProps,
) => {
  const {
    hasNextPage,
    hasPreviousPage,
    paginatorType,
    ...paginationProps
  } = usePaginatorContext();

  if (paginatorType === "click") {
    const { loadNextPage, loadPreviousPage } = paginationProps;

    return (
      <TablePagination
        {...props}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        onNextPage={loadNextPage}
        onPreviousPage={loadPreviousPage}
      />
    );
  }

  const { prevPageHref, nextPageHref } = paginationProps;

  return (
    <TablePagination
      {...props}
      hasNextPage={hasNextPage}
      hasPreviousPage={hasPreviousPage}
      prevHref={prevPageHref}
      nextHref={nextPageHref}
    />
  );
};
