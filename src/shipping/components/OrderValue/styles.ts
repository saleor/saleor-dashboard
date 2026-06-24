import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  () => ({
    colName: {
      fontSize: 14,
      width: "auto",
    },
    colType: {
      fontSize: 14,
      width: 220,
    },
    price: {
      textAlign: "right",
    },
    table: {
      tableLayout: "fixed",
    },
  }),
  {
    name: "OrderValue",
  },
);
