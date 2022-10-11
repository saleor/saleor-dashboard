import { makeStyles } from "@saleor/macaw-ui";

export const NODE_HEIGHT = 56;
export const NODE_MARGIN = 40;

export const useStyles = makeStyles(
  theme => ({
    actions: {
      "&&": {
        padding: theme.spacing(2, 4),
      },
      flexDirection: "row",
    },
    container: {
      background: theme.palette.grey[200],
    },
    darkContainer: {
      background: `${theme.palette.grey[800]} !important`,
    },
    deleteButton: {
      marginRight: theme.spacing(1),
    },
    dragIcon: {
      cursor: "grab",
    },
    nodeTitle: {
      cursor: "pointer",
      marginLeft: theme.spacing(7),
    },
    root: {
      "& .rst__collapseButton": {
        display: "none",
      },
      "& .rst__node": {
        "&:first-of-type": {
          "& $row": {
            borderTop: `1px ${theme.palette.divider} solid`,
          },
        },
      },
    },
    row: {
      alignItems: "center",
      background: theme.palette.background.paper,
      borderBottom: `1px ${theme.palette.divider} solid`,
      borderRadius: 0,
      display: "flex",
      flexDirection: "row",
      height: NODE_HEIGHT,
      justifyContent: "flex-start",
      paddingLeft: theme.spacing(3),
    },
    rowContainer: {
      "& > *": {
        opacity: 1,
        transition: `opacity ${theme.transitions.duration.standard}ms`,
      },
      transition: `margin ${theme.transitions.duration.standard}ms`,
    },
    rowContainerDragged: {
      "&$rowContainer": {
        "&:before": {
          background: theme.palette.background.paper,
          border: `1px solid ${theme.palette.primary.main}`,
          borderRadius: "100%",
          content: "''",
          height: 7,
          left: 0,
          position: "absolute",
          top: -3,
          width: 7,
        },
        borderTop: `1px solid ${theme.palette.primary.main}`,
        height: 0,
        position: "relative",
        top: -1,
      },
    },
    rowContainerPlaceholder: {
      opacity: 0,
    },
    spacer: {
      flex: 1,
    },
  }),
  { name: "MenuItems" },
);
