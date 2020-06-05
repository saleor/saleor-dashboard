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
    alignRight: {
      textAlign: "right"
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
    appHeader: {
      marginBottom: theme.spacing(3)
    },
    appHeaderLinks: {
      "& img": {
        marginRight: theme.spacing(1)
      },
      alignItems: "center",
      display: "flex",
      padding: theme.spacing(2, 0)
    },
    appName: {
      color: theme.palette.primary.main
    },

    colAction: {
      "&&": {
        paddingRight: theme.spacing(1),
        textAlign: "right"
      },
      textAlign: "right"
    },
    colInstallAction: {
      "& > *": {
        display: "inline-flex"
      }
    },
    colName: {
      paddingLeft: 0,
      width: theme.spacing(30)
    },
    colSpinner: {
      "& svg": {
        textAlign: "right"
      },
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(2)
    },
    customTooltip: {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.primary.contrastText,
      padding: theme.spacing(2)
    },
    error: {
      "& svg": {
        bottom: theme.spacing(0.2),
        marginLeft: theme.spacing(0.6),
        position: "relative"
      },
      color: theme.palette.error.main,
      margin: theme.spacing(0, 1, 0.7, 0)
    },
    headerLinkContainer: {
      "& span": {
        fontWeight: 500
      },
      alignItems: "center",
      display: "flex",
      fontSize: theme.spacing(2),
      fontWeight: 500,
      lineHeight: 1.2,
      marginRight: theme.spacing(3),
      padding: 0,
      textTransform: "none"
    },
    hr: {
      border: "none",
      borderTop: `1px solid ${theme.palette.divider}`,
      height: 0,
      marginBottom: 0,
      marginTop: 0,
      width: "100%"
    },
    installText: {
      color: theme.palette.primary.contrastText
    },
    linkContainer: {
      fontWeight: 500,
      marginTop: theme.spacing(1.5)
    },
    marketplaceContent: {
      "& button": {
        marginTop: theme.spacing(1)
      },
      "&:last-child": {
        padding: theme.spacing(2, 3, 2, 3)
      },
      padding: theme.spacing(1)
    },
    permissionsContainer: {
      "& li": {
        "&:last-child": {
          marginBottom: 0
        },
        marginBottom: theme.spacing(1)
      },
      paddingLeft: theme.spacing(2)
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
  { name: "AppList" }
);
