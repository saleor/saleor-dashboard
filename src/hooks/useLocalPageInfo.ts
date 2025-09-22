import { useEffect, useState } from "react";

export function getMaxPage(valuesCount: number, paginateBy: number) {
  return Math.floor(Math.max(0, valuesCount - 1) / paginateBy);
}

function useLocalPageInfo<T>(values: T[], paginateBy: number) {
  const [page, setPage] = useState(0);
  const maxPage = getMaxPage(values.length, paginateBy);

  useEffect(() => {
    setPage(0);
  }, [paginateBy]);

  const hasPreviousPage = page > 0;
  const hasNextPage = page < maxPage;
  const startCursor = page * paginateBy;
  const endCursor = hasNextPage ? startCursor + paginateBy - 1 : Math.max(0, values.length - 1);
  const pageValues = values.slice(startCursor, endCursor + 1);
  const loadPreviousPage = () => setPage(page - 1);
  const loadNextPage = () => setPage(page + 1);
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
