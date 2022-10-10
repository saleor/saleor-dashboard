import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    searchPadding: {
      padding: "16px 0 16px 0",
    },
    namePadding: {
      padding: "16px",
    },
    supportText: {
      color: theme.palette.saleor.main[3],
    },
  }),
  { name: "TaxClassesPage" },
);
