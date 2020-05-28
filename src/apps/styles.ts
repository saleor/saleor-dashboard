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
      marginBottom: theme.spacing(2)
    },
    appContent: {
      padding: 0
    },
    colAction: {
      "&&": {
        paddingRight: theme.spacing(1)
      },
      textAlign: "right",
      width: 140
    },
    colName: {
      paddingLeft: 0,
      width: 250
    },
    table: {
      tableLayout: "fixed"
    },
    tableRow: {
      cursor: "pointer"
    }
  }),
  { name: "WebhooksList" }
);
