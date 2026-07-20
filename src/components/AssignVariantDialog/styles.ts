import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    avatar: {
      width: 64,
    },
    colVariantCheckbox: {
      padding: 0,
    },
    content: {
      overflowY: "scroll",
      paddingTop: 0,
      marginBottom: theme.spacing(3),
    },
    grayText: {
      color: theme.palette.text.disabled,
    },
    overflow: {
      overflowY: "hidden",
    },
    textRight: {
      textAlign: "right",
    },
    variantCheckbox: {
      left: theme.spacing(),
      position: "relative",
    },
    wideCell: {
      width: "100%",
    },
  }),
  { name: "AssignVariantDialog" },
);
