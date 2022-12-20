import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    sectionHeader: {
      fontSize: 14,
      fontWeight: 700,
      color: theme.palette.saleor.main[3],
      margin: theme.spacing(8, 0, 3, 0),
      textTransform: "uppercase",
    },
  }),
  { name: "AppListPage" },
);
