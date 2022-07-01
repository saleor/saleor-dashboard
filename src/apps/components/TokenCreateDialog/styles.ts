import { fade } from "@material-ui/core/styles/colorManipulator";
import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    cancel: {
      marginRight: theme.spacing(1),
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
  }),
  {
    name: "TokenCreateDialog",
  },
);
