import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    root: {
      padding: 0
    },
    dialogContent: {
      maxHeight: `calc(100vh - 250px)`,
      overflowX: "hidden",
      padding: "0 24px",
      margin: 0
    },
    wrapper: {
      maxHeight: 400,
      minHeight: theme.spacing(3)
    },
    scrollableWrapper: {
      overflowY: "scroll"
    },
    container: {
      display: "block"
    },
    optionLabel: {
      display: "block"
    },
    searchInput: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2)
    },
    exitButton: {
      marginLeft: "auto"
    }
  }),
  { name: "OrderCustomerAddressesEditDialog" }
);
