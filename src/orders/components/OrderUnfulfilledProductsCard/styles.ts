import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    actions: {
      flexDirection: "row-reverse",
      padding: theme.spacing(2, 3),
    },
    table: {
      "& td, & th": {
        "&:not(:first-child):not(:last-child)": {
          paddingLeft: theme.spacing(1),
          paddingRight: theme.spacing(1),
        },
      },
      tableLayout: "fixed",
    },
    toolbarButton: {
      border: 0,
    },
    toolbarButtonContent: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
    },
    cardTitle: {
      justifyContent: "space-between",
      "& > div": {
        "&:first-child": {
          flex: 0,
          whiteSpace: "nowrap",
        },
        "&:last-child": {
          flex: "0 1 auto",
          minWidth: 0,
          marginLeft: theme.spacing(1),
        },
      },
    },
  }),
  { name: "OrderUnfulfilledItems" },
);
