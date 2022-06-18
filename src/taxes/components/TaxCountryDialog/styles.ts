import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  () => ({
    inputPadding: {
      padding: "16px 0 16px 0"
    },
    wrapper: {
      overflowX: "visible",
      padding: 0
    },
    scrollable: {
      display: "flex",
      flexDirection: "column",
      overflowY: "scroll",
      maxHeight: 450,
      marginLeft: -15,
      paddingLeft: 15
    }
  }),
  { name: "TaxCountryDialog" }
);
