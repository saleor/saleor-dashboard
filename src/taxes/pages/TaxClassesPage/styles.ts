import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    supportText: {
      color: theme.palette.saleor.main[3],
    },
  }),
  { name: "TaxClassesPage" },
);
