import { type Dispatch, type SetStateAction, useState } from "react";

export function getMaxPage(valuesCount: number, paginateBy: number) {
  return Math.floor(Math.max(0, valuesCount - 1) / paginateBy);
}

interface UseLocalPageInfoOptions {
  /**
   * Go back to the last page that still has values when removing values leaves the current page
   * past the end (e.g. after removing the only value on the last page). Off by default because
   * some callers page past their local values on purpose: a saved voucher's codes continue from
   * local draft codes into server pages.
   */
  clampToLastPage?: boolean;
}

interface LocalPageInfo<T> {
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    endCursor: number;
    startCursor: number;
  };
  pageValues: T[];
  resetPage: () => void;
  loadNextPage: () => void;
  loadPreviousPage: () => void;
  loadPage: Dispatch<SetStateAction<number>>;
}

function useLocalPageInfo<T>(
  values: T[],
  paginateBy: number,
  { clampToLastPage = false }: UseLocalPageInfoOptions = {},
): LocalPageInfo<T> {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(paginateBy);
  const maxPage = getMaxPage(values.length, paginateBy);
  // State is adjusted during render (not in an effect), so no frame shows a stale page.
  // A new page size starts from the first page.
  const pageSizeChanged = !Object.is(pageSize, paginateBy);

  if (pageSizeChanged) {
    setPageSize(paginateBy);
  }

  const requestedPage = pageSizeChanged ? 0 : page;
  // Clamp only when the last page is known: a missing or zero page size gives none.
  const currentPage =
    clampToLastPage && Number.isFinite(maxPage)
      ? Math.max(0, Math.min(requestedPage, maxPage))
      : requestedPage;

  if (!Object.is(currentPage, page)) {
    setPage(currentPage);
  }

  const hasPreviousPage = currentPage > 0;
  const hasNextPage = currentPage < maxPage;
  const startCursor = currentPage * paginateBy;
  const endCursor = hasNextPage ? startCursor + paginateBy - 1 : Math.max(0, values.length - 1);
  const pageValues = values.slice(startCursor, endCursor + 1);
  const loadPreviousPage = (): void => setPage(Math.max(0, currentPage - 1));
  const loadNextPage = (): void => setPage(currentPage + 1);
  const resetPage = () => setPage(0);

  return {
    pageInfo: {
      hasNextPage,
      hasPreviousPage,
      endCursor,
      startCursor,
    },
    pageValues,
    resetPage,
    loadNextPage,
    loadPreviousPage,
    loadPage: setPage,
  };
}
export default useLocalPageInfo;
