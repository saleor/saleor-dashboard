import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    appListWrapper: {
      display: "grid",
      gridTemplateColumns: `repeat(1, 1fr)`,
      gap: theme.spacing(2),
      marginTop: theme.spacing(1),
      [theme.breakpoints.up(900)]: {
        gridTemplateColumns: `repeat(2, 1fr)`,
      },
      [theme.breakpoints.up("lg")]: {
        gridTemplateColumns: `repeat(3, 1fr)`,
      },
    },
  }),
  {
    name: "AllAppList",
  },
);
