import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    colName: {
      fontSize: 14,
      paddingLeft: 0,
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
    tableContainer: {
      margin: theme.spacing(0, -4),
    },
  }),
  {
    name: "VoucherValue",
  },
);
