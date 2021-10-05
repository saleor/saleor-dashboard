import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    avatar: {
      paddingLeft: 0,
      width: 64
    },
    colName: {
      paddingLeft: 0
    },
    colVariantCheckbox: {
      padding: 0
    },
    content: {
      overflowY: "scroll",
      paddingTop: 0,
      marginBottom: theme.spacing(3)
    },
    grayText: {
      color: theme.palette.text.disabled
    },
    loadMoreLoaderContainer: {
      alignItems: "center",
      display: "flex",
      height: theme.spacing(3),
      justifyContent: "center",
      marginTop: theme.spacing(3)
    },
    overflow: {
      overflowY: "hidden"
    },
    topArea: {
      overflowY: "hidden",
      paddingBottom: theme.spacing(6),
      margin: theme.spacing(0, 3, 3, 3)
    },
    productCheckboxCell: {
      "&:first-child": {
        paddingLeft: 0,
        paddingRight: 0
      }
    },
    textRight: {
      textAlign: "right"
    },
    variantCheckbox: {
      left: theme.spacing(),
      position: "relative"
    },
    wideCell: {
      width: "100%"
    }
  }),
  { name: "AssignVariantDialog" }
);
