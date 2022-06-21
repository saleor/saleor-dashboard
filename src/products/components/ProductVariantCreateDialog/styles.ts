import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    option: {
      marginBottom: theme.spacing(2),
      width: 400,
    },
    dialogContent: {
      padding: 0,
    },
  }),
  { name: "ProductVariantCreateDialog" },
);
