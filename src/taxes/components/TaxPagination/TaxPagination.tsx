import { makeStyles, Pagination } from "@saleor/macaw-ui";
import React, { Dispatch, SetStateAction } from "react";

interface TaxPaginationProps {
  rowNumber: number;
  setRowNumber: Dispatch<SetStateAction<number>>;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}

const useStyles = makeStyles(
  theme => ({
    container: {
      padding: theme.spacing(0, 4),
    },
  }),
  { name: "TaxPagination" },
);

export const TaxPagination = ({
  rowNumber,
  setRowNumber,
  setCurrentPage,
  hasNextPage,
  hasPrevPage,
}: TaxPaginationProps) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Pagination
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPrevPage}
        labels={{
          noOfRows: "No rows",
        }}
        rowNumber={rowNumber}
        onRowNumberUpdate={setRowNumber}
        onNextPage={() => {
          setCurrentPage(currentPage => (currentPage += 1));
        }}
        onPreviousPage={() => {
          setCurrentPage(currentPage => (currentPage -= 1));
        }}
      />
    </div>
  );
};
