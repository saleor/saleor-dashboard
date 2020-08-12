import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles(
  theme => ({
    grid: {
      display: "grid",
      gridColumnGap: theme.spacing(2),
      gridTemplateColumns: "1fr 1fr"
    },
    info: {
      margin: theme.spacing(2, 1)
    }
  }),
  {
    name: "OrderValue"
  }
);
