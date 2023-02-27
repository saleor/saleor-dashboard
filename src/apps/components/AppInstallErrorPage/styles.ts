import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    button: {
      marginTop: theme.spacing(2),
      padding: theme.spacing(1.5, 2),
    },
    root: {
      "& > div": {
        minHeight: "80vh",
      },
      "& h3": {
        fontWeight: 600,
        marginBottom: theme.spacing(3),
        maxWidth: theme.spacing(60),
      },
      "& img": {
        maxWidth: "100%",
      },
    },
  }),
  {
    name: "AppInstallErrorPage",
  },
);
