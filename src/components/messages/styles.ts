import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    container: {
      display: "grid",
      justifyContent: "end",
      right: 0,
      pointerEvents: "auto",
      position: "fixed",
      top: 0,
      width: "auto",
      maxHeight: "100vh",
      overflowY: "auto",
      zIndex: 10000,
    },
    notification: {
      // Parent container has disabled pointer events so we need to turn them on
      // for action and timer pausing to work
      pointerEvents: "all",
      margin: theme.spacing(2),
    },
  }),
  { name: "MessageManager" },
);
