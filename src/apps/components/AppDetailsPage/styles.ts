import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    appHeader: {
      marginBottom: theme.spacing(3),
    },
    appHeaderLinks: {
      "& img": {
        marginRight: theme.spacing(1),
      },
      alignItems: "center",
      display: "flex",
      padding: theme.spacing(2, 0),
    },
    headerLinkContainer: {
      "& svg": {
        marginRight: theme.spacing(),
      },
      "& span": {
        fontWeight: 500,
      },
      alignItems: "center",
      color: theme.palette.text.primary,
      display: "flex",
      fontSize: theme.spacing(2),
      fontWeight: 500,
      lineHeight: 1.2,
      marginRight: theme.spacing(3),
      padding: 0,
      textTransform: "none",
    },
    hr: {
      border: "none",
      borderTop: `1px solid ${theme.palette.divider}`,
      height: 0,
      marginBottom: 0,
      marginTop: 0,
      width: "100%",
    },
    marketplaceContent: {
      "& button": {
        marginTop: theme.spacing(1),
      },
      "&:last-child": {
        padding: theme.spacing(2, 3, 2, 3),
      },
      padding: theme.spacing(1),
    },
  }),
  { name: "AppDetailsPage" },
);
