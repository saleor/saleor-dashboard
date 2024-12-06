import { commonMessages } from "@dashboard/intl";
import { makeStyles, Pagination } from "@saleor/macaw-ui";
import { useIntl } from "react-intl";

interface TaxPaginationProps {
  rowNumber: number;
  currentPage: number;
  setRowNumber: (rowNumber: number) => void;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  setCurrentPage: (currentPage: number) => void;
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
  currentPage,
}: TaxPaginationProps) => {
  const classes = useStyles();
  const intl = useIntl();
  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };
  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
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
