import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    namePadding: {
      padding: "16px",
    },
    supportText: {
      color: theme.palette.saleor.main[3],
    },
  }),
  { name: "TaxClassesPage" },
);
