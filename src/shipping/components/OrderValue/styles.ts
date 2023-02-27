import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    colName: {
      fontSize: 14,
      paddingLeft: 0,
      width: "auto",
    },
    colType: {
      fontSize: 14,
      textAlign: "right",
      width: 250,
    },
    content: {
      padding: theme.spacing(3, 0, 3, 0),
    },
    info: {
      fontSize: 14,
    },
    price: {
      verticalAlign: "top",
    },
    subheader: {
      padding: theme.spacing(0, 3, 0, 3),
    },
    table: {
      tableLayout: "fixed",
    },
  }),
  {
    name: "OrderValue",
  },
);
