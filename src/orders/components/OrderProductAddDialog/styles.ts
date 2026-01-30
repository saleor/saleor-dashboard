import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    avatar: {
      width: 64,
    },
    colVariantCheckbox: {
      padding: 0,
    },
    textRight: {
      textAlign: "right",
    },
    variantCheckbox: {
      left: theme.spacing(),
      position: "relative",
    },
  }),
  { name: "OrderProductAddDialog" },
);
