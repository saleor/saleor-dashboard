import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  {
    scrollabeWrapper: {
      height: 400,
      overflow: "scroll"
    },
    container: {
      display: "block"
    },
    optionLabel: {
      display: "block"
    },
    overflow: {
      overflowY: "visible"
    }
  },
  { name: "OrderCustomerAddressesEditDialog" }
);
