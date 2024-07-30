import { alpha } from "@material-ui/core/styles";
import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    paper: {
      background: alpha(theme.palette.primary.main, 0.05),
      padding: theme.spacing(2, 3),
      whiteSpace: "pre-wrap",
    },
  }),
  {
    name: "TokenCreateDialog",
  },
);
