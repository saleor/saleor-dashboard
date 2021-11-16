import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
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
    },
    searchInput: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2)
    }
  }),
  { name: "OrderCustomerAddressesEditDialog" }
);
