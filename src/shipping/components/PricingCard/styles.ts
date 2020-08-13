import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles(
  () => ({
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
    table: {
      tableLayout: "fixed"
    }
  }),
  {
    name: "PricingCard"
  }
);
