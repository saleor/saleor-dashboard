import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    inputPadding: {
      padding: theme.spacing(2, 0),
    },
    wrapper: {
      overflowX: "visible",
      padding: 0,
    },
    scrollable: {
      display: "flex",
      flexDirection: "column",
      overflowY: "scroll",
      maxHeight: "60vh",
      marginLeft: -15,
      paddingLeft: 15,
    },
    dialog: {
      maxHeight: "unset",
    }
  }),
  { name: "TaxCountryDialog" },
);
