import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  () => ({
    dialogContent: {
      maxHeight: `calc(100vh - 250px)`,
      overflowY: "scroll",
      overflowX: "hidden",
      padding: "24px",
      margin: 0,
    },
    container: {
      display: "block",
    },
    optionLabel: {
      display: "block",
    },
  }),
  { name: "OrderCustomerAddressesEditDialog" },
);
