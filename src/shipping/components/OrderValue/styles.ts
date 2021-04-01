import { makeStyles } from "@saleor/theme";

export const useStyles = makeStyles(
  theme => ({
    caption: {
      marginBottom: theme.spacing(2)
    },
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
    content: {
      "&:last-child": {
        paddingBottom: 0
      },
      paddingLeft: 0,
      paddingRight: 0
    },
    info: {
      fontSize: 14
    },
    price: {
      verticalAlign: "top"
    },
    subheader: {
      padding: theme.spacing(0, 3, 2, 3)
    },
    table: {
      tableLayout: "fixed"
    }
  }),
  {
    name: "OrderValue"
  }
);
