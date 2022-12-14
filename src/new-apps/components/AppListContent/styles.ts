import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    appContent: {
      margin: `${theme.spacing(4)} 0`,
    },
    appListWrapper: {
      display: "grid",
      gridTemplateColumns: `repeat(auto-fit, minmax(400px, 1fr))`,
      gap: theme.spacing(2),
      marginTop: theme.spacing(1),
    },
  }),
  {
    name: "AppListContent",
  },
);
