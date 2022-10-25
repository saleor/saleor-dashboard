import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    inputPadding: {
      padding: "16px 0 16px 0",
    },
    greyText: {
      color: theme.palette.text.hint,
    },
    noDivider: {
      "&::after, &::before": { display: "none" },
    },
    right: {
      margin: 0,
      display: "flex",
      placeContent: "flex-end",
      textAlign: "right",
    },
  }),
  { name: "TaxCountriesPage" },
);
