import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  () => ({
    colName: {
      fontSize: 14,
      width: "auto",
    },
    colPrice: {
      minWidth: 300,
      paddingTop: 12,
      paddingBottom: 12,
    },
    colType: {
      fontSize: 14,
      textAlign: "right",
      width: 300,
    },
    table: {
      tableLayout: "fixed",
    },
    tableContainer: {},
  }),
  {
    name: "VoucherValue",
  },
);
