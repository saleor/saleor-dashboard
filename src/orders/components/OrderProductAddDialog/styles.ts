import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    avatar: {
      width: 64,
    },
    colName: {},
    colVariantCheckbox: {
      padding: 0,
    },
    productCheckboxCell: {},
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
