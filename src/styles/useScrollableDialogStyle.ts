import makeStyles from "@material-ui/core/styles/makeStyles";

const useScrollableDialogStyle = makeStyles(
  theme => ({
    content: {
      overflowY: "hidden"
    },
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
    scrollArea: {
      overflowY: "scroll"
    }
  }),
  {
    name: "ScrollableDialog"
  }
);

export default useScrollableDialogStyle;
