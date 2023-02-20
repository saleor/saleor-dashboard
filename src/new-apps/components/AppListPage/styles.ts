import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    appContent: {
      width: "100%",
      [theme.breakpoints.up("md")]: {
        width: "50vw",
      },
    },
    sectionHeader: {
      fontSize: 14,
      fontWeight: 700,
      color: theme.palette.saleor.main[3],
      margin: theme.spacing(8, 0, 3, 0),
      textTransform: "uppercase",
    },
    previewLabel: {
      marginLeft: theme.spacing(2),
    },
  }),
  { name: "AppListPage" },
);
