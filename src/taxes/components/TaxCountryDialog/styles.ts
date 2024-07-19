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
  }),
  { name: "TaxCountryDialog" },
);
