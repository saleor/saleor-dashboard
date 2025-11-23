import { usePaginatorContext } from "@dashboard/hooks/usePaginator";

import { PaginationProps, TablePagination } from "./TablePagination";

type TablePaginationWithContextProps = Omit<
  PaginationProps,
  "nextHref" | "prevHref" | "hasNextPage" | "hasPreviousPage" | "onNextPage" | "onPreviousPage"
>;
export const TablePaginationWithContext = (props: TablePaginationWithContextProps) => {
  const { hasNextPage, hasPreviousPage, paginatorType, ...paginationProps } = usePaginatorContext();

  if (paginatorType === "click") {
    const { loadNextPage, loadPreviousPage } = paginationProps;

    return (
      <TablePagination
        {...props}
        hasNextPage={hasNextPage ?? false}
        hasPreviousPage={hasPreviousPage ?? false}
        onNextPage={loadNextPage}
        onPreviousPage={loadPreviousPage}
      />
    );
  }

  const { nextHref, prevHref } = paginationProps;

  return (
    <TablePagination
      {...props}
      nextHref={nextHref}
      hasNextPage={hasNextPage ?? false}
      prevHref={prevHref}
      hasPreviousPage={hasPreviousPage ?? false}
    />
  );
};
