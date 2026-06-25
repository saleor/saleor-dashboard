import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    container: {
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
    itemLink: {
      color: "inherit",
      textDecoration: "none",
      borderRadius: 4,
      "&:focus-visible": {
        outline: "2px solid var(--mu-colors-border-info1)",
        outlineOffset: 2,
      },
    },
    sortableHandle: {
      marginRight: theme.spacing(1),
    },
    grabbing: {
      cursor: "grabbing",
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
