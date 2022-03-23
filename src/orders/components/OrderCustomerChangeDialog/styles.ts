import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  {
    container: {
      display: "block"
    },
    optionLabel: {
      display: "block"
    },
    overflow: {
      overflowY: "visible"
    },
    buttonsContainer: {
      display: "flex",
      justifyContent: "flex-end"
    }
  },
  { name: "OrderCustomerChangeDialog" }
);
