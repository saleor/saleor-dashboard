import { makeStyles } from "@saleor/theme";

const useScrollableDialogStyle = makeStyles(
  theme => ({
    dialog: {
      height: "calc(100% - 64px)",
      maxHeight: 700
    },
    loadMoreLoaderContainer: {
      alignItems: "center",
      display: "flex",
      height: theme.spacing(3),
      justifyContent: "center",
      marginTop: theme.spacing(3)
    },
    topArea: {
      overflowY: "visible"
    },
    scrollArea: {
      overflowY: "scroll",
      paddingTop: 0,
      height: "inherit"
    }
  }),
  {
    name: "ScrollableDialog"
  }
);

export default useScrollableDialogStyle;
