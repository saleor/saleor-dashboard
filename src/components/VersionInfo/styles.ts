import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    container: {
      display: "flex",
      justifyContent: "flex-end",
    },
    versionItem: {
      [theme.breakpoints.down("md")]: {
        fontSize: theme.spacing(1.75),
      },
      [theme.breakpoints.up("md")]: {
        fontSize: theme.spacing(2),
      },
      color: theme.palette.saleor.main[3],
      lineHeight: theme.spacing(3.2),
      fontSize: theme.spacing(2),
      marginLeft: theme.spacing(1.5),
      letterSpacing: "0.02em",
    },
  }),
  {
    name: "VersionInfo",
  },
);
