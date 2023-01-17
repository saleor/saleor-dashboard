import { commonMessages } from "@dashboard/intl";
import { makeStyles, Pagination } from "@saleor/macaw-ui";
import React, { Dispatch, SetStateAction } from "react";
import { useIntl } from "react-intl";

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
  const intl = useIntl();

  const handleNextPage = () => {
    setCurrentPage(currentPage => (currentPage += 1));
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage => (currentPage -= 1));
  };

  return (
    <div className={classes.container}>
      <Pagination
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPrevPage}
        labels={{
          noOfRows: intl.formatMessage(commonMessages.noOfRows),
        }}
        rowNumber={rowNumber}
        onRowNumberUpdate={setRowNumber}
        onNextPage={handleNextPage}
        onPreviousPage={handlePrevPage}
      />
    </div>
  );
};
