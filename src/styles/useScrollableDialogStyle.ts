import { makeStyles } from "@saleor/macaw-ui";

const useScrollableDialogStyle = makeStyles(
  theme => ({
    dialog: {
      height: "calc(100% - 64px)",
      maxHeight: 700,
    },
    form: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      overflowY: "auto",
    },
    loadMoreLoaderContainer: {
      alignItems: "center",
      display: "flex",
      height: theme.spacing(3),
      justifyContent: "center",
      marginTop: theme.spacing(3),
    },
    scrollArea: {
      overflowY: "scroll",
      paddingTop: 0,
      height: "inherit",
      marginBottom: theme.spacing(3),
    },
  }),
  {
    name: "ScrollableDialog",
  },
);

export default useScrollableDialogStyle;
