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
    truncatedHint: {
      color: theme.palette.text.secondary,
      display: "block",
      fontSize: "0.75rem",
      marginTop: theme.spacing(0.5),
    },
  }),
  { name: "OrderProductAddDialog" },
);
