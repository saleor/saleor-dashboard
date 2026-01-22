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
    noContentText: {
      marginBottom: theme.spacing(3),
    },
    content: {
      overflowY: "scroll",
      paddingTop: 0,
      marginBottom: theme.spacing(3),
    },
    grayText: {
      color: theme.palette.text.disabled,
    },
    loadMoreLoaderContainer: {
      alignItems: "center",
      display: "flex",
      height: theme.spacing(3),
      justifyContent: "center",
      marginTop: theme.spacing(3),
    },
    overflow: {
      overflowY: "hidden",
    },
    productCheckboxCell: {},
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
