import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  () => ({
    colName: {
      width: "auto",
      margin: "0px",
    },
    colQuantity: {
      textAlign: "right",
      width: 88,
      padding: "4px 4px",
    },
    colWarehouseStock: {
      textAlign: "right",
      width: 88,
      padding: "4px 4px",
    },
    colShort: {
      textAlign: "right",
      width: 72,
      padding: "4px 16px 4px 4px",
    },
    table: {
      tableLayout: "fixed",
    },
  }),
  { name: "OrderFulfillStockExceededDialog" },
);
