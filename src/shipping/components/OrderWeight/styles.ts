import { makeStyles } from "@saleor/theme";

export const useStyles = makeStyles(
  theme => ({
    caption: {
      marginBottom: theme.spacing(2)
    },
    grid: {
      display: "grid",
      gridColumnGap: theme.spacing(2),
      gridTemplateColumns: "1fr 1fr"
    }
  }),
  {
    name: "OrderWeight"
  }
);
