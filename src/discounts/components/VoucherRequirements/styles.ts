import { makeStyles } from "@material-ui/core/styles";

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
    table: {
      tableLayout: "fixed"
    },
    tableContainer: {
      margin: theme.spacing(0, -3),
      width: `calc(100% + ${theme.spacing(6)}px)`
    }
  }),
  {
    name: "VoucherRequirements"
  }
);
