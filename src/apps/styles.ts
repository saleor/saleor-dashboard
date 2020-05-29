import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles(
  theme => ({
    [theme.breakpoints.up("lg")]: {
      colName: {
        "&&": {
          width: "auto"
        }
      }
    },
    appContainer: {
      marginBottom: theme.spacing(3)
    },
    appContent: {
      "&:last-child": {
        padding: "0!important"
      },
      padding: 0
    },
    appName: {
      color: theme.palette.primary.main
    },
    colAction: {
      "&&": {
        paddingRight: theme.spacing(1)
      },
      textAlign: "right"
    },
    colName: {
      paddingLeft: 0,
      width: 250
    },
    error: {
      "& svg": {
        marginLeft: theme.spacing(0.6),
        position: "relative",
        top: theme.spacing(0.8)
      },
      color: theme.palette.error.main,
      marginBottom: theme.spacing(0.7)
    },
    hr: {
      border: "none",
      borderTop: `1px solid ${theme.palette.divider}`,
      height: 0,
      marginBottom: 0,
      marginTop: 0,
      width: "100%"
    },
    marketplaceContent: {
      "& button": {
        marginTop: theme.spacing(1)
      },
      "&:last-child": {
        padding: theme.spacing(2, 3, 0, 3)
      },
      padding: theme.spacing(1)
    },
    retryBtnCol: {
      paddingRight: theme.spacing(1),
      width: theme.spacing(14)
    },
    table: {
      tableLayout: "fixed"
    },
    tableRow: {
      cursor: "pointer"
    },
    text: {
      color: theme.palette.text.secondary
    },
    title: {
      flex: 1,
      fontWeight: 500,
      lineHeight: 1
    }
  }),
  { name: "WebhooksList" }
);
