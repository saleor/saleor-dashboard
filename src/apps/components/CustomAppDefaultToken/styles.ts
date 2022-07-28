import { fade } from "@material-ui/core/styles/colorManipulator";
import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    cancel: {
      marginRight: theme.spacing(1),
    },
    closeContainer: {
      display: "flex",
      justifyContent: "flex-end",
      position: "relative",
      right: theme.spacing(-1),
      top: theme.spacing(-1),
    },
    content: {
      display: "grid",
      gridColumnGap: theme.spacing(3),
      gridTemplateColumns: "1fr 60px",
      marginBottom: theme.spacing(3),
    },
    copy: {
      marginTop: theme.spacing(),
      position: "relative",
      right: theme.spacing(1),
    },
    paper: {
      background: fade(theme.palette.primary.main, 0.05),
      padding: theme.spacing(2, 3),
    },
    root: {
      boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.05)",
    },
  }),
  {
    name: "CustomAppTokenCreateDialog",
  },
);
