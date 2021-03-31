import { makeStyles } from "@saleor/theme";

export const useStyles = makeStyles(
  theme => ({
    colName: {
      fontSize: 14,
      paddingLeft: 0,
      width: "auto"
    },
    colPrice: {
      minWidth: 240
    },
    colType: {
      fontSize: 14,
      textAlign: "right",
      width: 200
    },
    hr: {
      margin: theme.spacing(2, -3),
      width: `calc(100% + ${theme.spacing(6)}px)`
    },
    table: {
      tableLayout: "fixed"
    },
    tableContainer: {
      margin: theme.spacing(0, -3),
      width: `calc(100% + ${theme.spacing(6)}px)`
    }
  }),
  {
    name: "VoucherValue"
  }
);
