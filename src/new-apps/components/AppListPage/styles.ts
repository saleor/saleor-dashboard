import { alpha } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    appContent: {
      margin: theme.spacing(4, 0),
    },
    sectionHeader: {
      fontSize: 14,
      fontWeight: 700,
      color:
        theme.palette.type === "dark"
          ? alpha(theme.palette.saleor.generic.light, 0.8)
          : theme.palette.saleor.generic.dark,
      margin: theme.spacing(8, 0, 3, 0),
      textTransform: "uppercase",
    },
  }),
  { name: "AppListPage" },
);
