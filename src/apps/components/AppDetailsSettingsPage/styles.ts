import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles(
  theme => ({
    appSettingsHeader: {
      "& > button, & > a": {
        "&:last-child": {
          marginRight: 0
        },
        marginRight: theme.spacing(2)
      },
      display: "flex",
      justifyContent: "flex-end"
    },
    breadcrumb: {
      "&:not(:last-child)": {
        "&:after": {
          content: "'/'",
          display: "block",
          position: "absolute",
          right: -theme.spacing(2),
          top: 0
        },
        "&:not(:first-child):hover": {
          cursor: "pointer",
          textDecoration: "underline"
        }
      },
      marginRight: theme.spacing(3),
      position: "relative"
    },
    breadcrumbContainer: {
      alignItems: "center",
      display: "flex"
    },
    breadcrumbDisabled: {
      "&:hover": {
        textDecoration: "none"
      },
      color: theme.palette.text.disabled
    },
    breadcrumbs: {
      display: "flex"
    },
    hr: {
      border: "none",
      borderTop: `1px solid ${theme.palette.divider}`,
      height: 0,
      marginBottom: 0,
      marginTop: 0,
      width: "100%"
    },
    iframeContainer: {
      "& > iframe": {
        border: "none",
        minHeight: "75vh",
        width: "100%"
      }
    }
  }),
  { name: "AppDetailsSettingsPage" }
);
