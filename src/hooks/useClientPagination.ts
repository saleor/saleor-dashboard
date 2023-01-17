import { useCallback, useEffect, useState } from "react";

const DEFAULT_ROWS_COUNT = 10;
const FIRST_PAGINATED_PAGE = 1;

export const useClientPagination = () => {
  const [rowNumber, setRowNumber] = useState(DEFAULT_ROWS_COUNT);
  const [currentPage, setCurrentPage] = useState(FIRST_PAGINATED_PAGE);

  const indexOfLastElement = currentPage * rowNumber;
  const indexOfFirstElement = indexOfLastElement - rowNumber;

  useEffect(() => {
    setCurrentPage(FIRST_PAGINATED_PAGE);
  }, [rowNumber]);

  const restartPagination = useCallback(() => {
    setCurrentPage(FIRST_PAGINATED_PAGE);
    setRowNumber(DEFAULT_ROWS_COUNT);
  }, []);

  const changeRowNumber = useCallback((rowNumber: number) => {
    setRowNumber(rowNumber);
  }, []);

  const changeCurrentPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  return {
    rowNumber,
    changeRowNumber,
    changeCurrentPage,
    currentPage,
    restartPagination,
    indexOfLastElement,
    indexOfFirstElement,
  };
};
