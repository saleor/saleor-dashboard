import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  () => ({
    colName: {
      fontSize: 14,
      width: "auto",
    },
    colType: {
      fontSize: 14,
      textAlign: "right",
      width: 250,
    },
    info: {
      fontSize: 14,
    },
    price: {
      verticalAlign: "top",
    },
    table: {
      tableLayout: "fixed",
    },
  }),
  {
    name: "OrderValue",
  },
);
