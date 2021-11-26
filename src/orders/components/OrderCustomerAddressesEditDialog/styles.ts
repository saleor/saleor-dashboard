import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  {
    scrollableContent: {
      maxHeight: `calc(100vh - 250px)`,
      overflow: "scroll"
    },
    scrollableWrapper: {
      maxHeight: 400,
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
