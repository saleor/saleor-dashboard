import { makeStyles } from "@saleor/macaw-ui";

export const useProductErrorCellStyles = makeStyles(
  theme => ({
    container: {
      position: "relative",
    },
    errorBox: {
      backgroundColor: theme.palette.error.main,
      borderRadius: 8,
      marginRight: theme.spacing(3),
      padding: theme.spacing(2, 3),
      width: 280,
      zIndex: 1000,
    },
    errorText: {
      color: "white",
      fontSize: 14,
    },
    errorTextHighlighted: {
      color: theme.palette.error.main,
      fontSize: 12,
      marginRight: theme.spacing(1),
    },
    titleContainer: {
      alignItems: "center",
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
    },
  }),
  { name: "ProductErrorCell" },
);
