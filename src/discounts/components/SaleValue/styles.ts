import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles(
  theme => ({
    card: {
      "&:last-child": {
        paddingBottom: 0
      }
    },
    colName: {
      fontSize: 14,
      paddingLeft: 0,
      width: "auto"
    },
    colType: {
      fontSize: 14,
      textAlign: "right",
      width: 235
    },
    info: {
      fontSize: 14
    },
    row: {
      "&:last-child": {
        "& td": {
          borderBottom: "none"
        }
      }
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
    name: "SaleValue"
  }
);
