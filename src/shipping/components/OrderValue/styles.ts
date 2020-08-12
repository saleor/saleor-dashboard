import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles(
  theme => ({
    colName: {
      fontSize: 14,
      paddingLeft: 0,
      width: "auto"
    },
    colType: {
      fontSize: 14,
      textAlign: "right",
      width: 200
    },
    info: {
      margin: theme.spacing(2, 0)
    },
    table: {
      tableLayout: "fixed"
    }
  }),
  {
    name: "OrderValue"
  }
);
