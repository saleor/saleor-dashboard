import { makeStyles } from "@saleor/macaw-ui";

export const useExpanderStyles = makeStyles(
  theme => ({
    expanded: {},
    root: {
      boxShadow: "none",
      padding: theme.spacing(1, 4),

      "&:before": {
        content: "none",
      },

      "&$expanded": {
        margin: 0,
        border: "none",
      },
    },
  }),
  { name: "Expander" },
);

export const useHeaderStyles = makeStyles(
  theme => ({
    container: {
      width: "100%",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    skeleton: {
      width: "100%",
      marginRight: theme.spacing(4),
    },
    // empty expanded needed for mui to use root styles
    expanded: {},
    root: {
      width: "100%",
      border: "none",
      marginRight: theme.spacing(1),
      padding: 0,
      paddingBottom: theme.spacing(2),
      minHeight: 0,

      "&$expanded": {
        minHeight: 0,
      },
    },
    content: {
      margin: 0,

      "&$expanded": {
        margin: 0,
      },
    },
  }),
  { name: "AssignmentListHeader" },
);

export const useStyles = makeStyles(
  theme => ({
    container: {
      padding: theme.spacing(1, 0),
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      background: theme.palette.background.paper,
    },
    containerContent: {
      display: "flex",
      overflow: "auto",
    },
    sortableHandle: {
      marginRight: theme.spacing(1),
    },
    grabbing: {
      cursor: "grabbing",
    },
    root: {
      paddingRight: theme.spacing(1),
    },
    infoMessage: {
      padding: theme.spacing(3),
    },
    skeleton: {
      margin: theme.spacing(4, 0),
    },
  }),
  { name: "AssignmentList" },
);
