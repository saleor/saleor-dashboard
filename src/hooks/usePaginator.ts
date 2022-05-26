import { stringifyQs } from "@saleor/utils/urls";
import { createContext, useContext, useMemo } from "react";

import { Pagination } from "../types";

export interface PageInfo {
  endCursor: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
}

export interface PaginationState {
  after?: string;
  before?: string;
  first?: number;
  last?: number;
}

export function createPaginationState(
  paginateBy: number,
  queryString: Pagination
): PaginationState {
  return queryString && (queryString.before || queryString.after)
    ? queryString.after
      ? {
          after: queryString.after,
          first: paginateBy
        }
      : {
          before: queryString.before,
          last: paginateBy
        }
    : {
        first: paginateBy
      };
}

interface UsePaginatorArgs {
  pageInfo: PageInfo;
  paginationState: PaginationState;
  queryString: Pagination;
}

function usePaginator({
  queryString,
  paginationState,
  pageInfo
}: UsePaginatorArgs) {
  const newPageInfo = useMemo<PageInfo>(
    () =>
      pageInfo
        ? {
            ...pageInfo,
            hasNextPage: !!paginationState.before || pageInfo.hasNextPage,
            hasPreviousPage: !!paginationState.after || pageInfo.hasPreviousPage
          }
        : undefined,
    [paginationState, pageInfo]
  );

  const nextPageHref = useMemo(() => {
    if (!newPageInfo?.hasNextPage || !pageInfo?.endCursor) {
      return undefined;
    }

    return (
      "?" +
      stringifyQs({
        ...queryString,
        after: pageInfo.endCursor,
        before: undefined
      })
    );
  }, [pageInfo?.endCursor, newPageInfo?.hasNextPage, queryString]);

  const prevPageHref = useMemo(() => {
    if (!newPageInfo?.hasPreviousPage || !pageInfo?.startCursor) {
      return undefined;
    }
    return (
      "?" +
      stringifyQs({
        ...queryString,
        after: undefined,
        before: pageInfo.startCursor
      })
    );
  }, [pageInfo?.startCursor, newPageInfo?.hasPreviousPage, queryString]);

  return {
    nextPageHref,
    prevPageHref,
    ...newPageInfo
  };
}

export default usePaginator;

export const PaginatorContext = createContext<ReturnType<
  typeof usePaginator
> | null>(null);

export const usePaginatorContext = () => {
  const context = useContext(PaginatorContext);

  if (context === null) {
    throw new Error(
      "usePaginatorContext must be used within a PaginatorContext.Provider"
    );
  }

  return context;
};
