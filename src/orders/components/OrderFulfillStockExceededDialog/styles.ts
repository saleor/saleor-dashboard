import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    colName: {
      width: "auto",
      margin: "0px",
    },
    colQuantity: {
      textAlign: "right",
      width: 100,
      padding: "4px 4px",
    },
    colWarehouseStock: {
      textAlign: "right",
      width: 150,
      padding: "4px 24px",
    },
    table: {
      tableLayout: "fixed",
    },
    label: {
      margin: theme.spacing(2),
    },
    scrollable: {
      maxHeight: 450,
      overflow: "scroll",
    },
  }),
  { name: "OrderFulfillStockExceededDialog" },
);
