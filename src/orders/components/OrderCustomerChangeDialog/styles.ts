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
      overflowY: "visible",
      paddingTop: 0
    },
    buttonsContainer: {
      display: "flex",
      justifyContent: "flex-end"
    }
  },
  { name: "OrderCustomerChangeDialog" }
);
